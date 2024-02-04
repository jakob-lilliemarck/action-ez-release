import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/action';
import { readFile } from 'fs'
import type { WebhookPayload } from '@actions/github/lib/interfaces';
import {
  getVersionedFilename,
  toBool,
  getPaths,
  getFilename
} from './lib';

const octokit = new Octokit()

const getInput = (key: string) => {
  const value = core.getInput(key);
  return value !== '' ? value : undefined
}

const getRequired = (key: string) => {
  const value = getInput(key)
  if (value !== undefined) return value
  throw new Error(`Missing required input ${key}`)
}

const getRepositoryInformation = (payload: WebhookPayload) => {
  if (!payload.repository) throw new Error(`No key "repository" in payload: \n${JSON.stringify(payload, null, 4)}`)
  const { owner: { name }, full_name } = payload.repository
  if (!(name && full_name)) throw new Error(`Could not extract required information from the pau`)
  return { owner: name, repo: full_name }
}

try {
  const tag_name = getRequired('tag_name');
  const release_name = getInput('release_name');
  const release_body = getInput('release_body');
  const release_artifacts = getInput('release_artifacts');
  const generate_release_notes = toBool(getInput('generate_release_notes'));
  const { owner, repo } = getRepositoryInformation(github.context.payload)

  getPaths(release_artifacts).map((path, i) => {
    console.log(`Path ${i}: ${path}`)
    console.log(`Filename: ${getVersionedFilename(path, tag_name)}`)
  })

  const { data: { id } } = await octokit.request(
    `POST /repos/${repo}/releases`,
    {
      owner,
      repo,
      tag_name,
      name: release_name,
      body: release_body,
      draft: false,
      prerelease: false,
      generate_release_notes,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }
  )

  if (release_artifacts) {
    await Promise.all(getPaths(release_artifacts).map((path) => {
      console.info(`Uploading artifacts at "${path}"`)
      return new Promise((resolve, reject) => {
        readFile(path, (err, data) => {
          if (err) reject(err)
          if (data) {
            octokit.request(
              `POST https://uploads.github.com/repos/${repo}/releases/${id}/assets?name=${getFilename(path)}`,
              {
                owner,
                repo,
                release_id: `${id}`,
                data,
                headers: {
                  'X-GitHub-Api-Version': '2022-11-28'
                }
              }
            ).then((response) => resolve(response))
          }
        })
      })
    }))
  }

  core.setOutput("release_id", id);
} catch (error) {
  core.setFailed(error.message);
}