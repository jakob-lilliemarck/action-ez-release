import core from '@actions/core';
import github from '@actions/github';
import { WebhookPayload } from '@actions/github/lib/interfaces.js';
import { Octokit } from '@octokit/action';

const octokit = new Octokit()

const getInput = (key) => {
  const value = core.getInput(key);
  return value !== '' ? value : undefined
}

const getRequired = (key) => {
  const value = getInput(key)
  if (value !== undefined) return value
  throw new Error(`Missing required input ${key}`)
}

const boolean = (value) => {
  switch (value) {
    case 'true':
      return true
    default:
      return false
  }
}

const getPaths = (release_artifacts) => release_artifacts.split(",").map((path) => path.trim())

const getRepositoryInformation = (payload) => {
  if (!payload.repository) throw new Error(`No key "repository" in payload: \n${JSON.stringify(payload, null, 4)}`)
  const { owner: { name }, full_name } = payload.repository
  if (!(name && full_name)) throw new Error(`Could not extract required information from the pau`)
  return { owner: name, repo: full_name }
}

const getFilename = (path) => {
  const { filename } = s.match(/(?<filename>\w+\.\w+$)/).groups
  if (!filename) throw new Error(`Could not get filename from path "${path}"`)
  return filename
}

const getVersionedFilename = (path, version) => {
  return getFilename(path).replace(/(?=\.)/, `-${version}`)
}

try {
  // `who-to-greet` input defined in action metadata file
  const tag_name = getRequired('tag_name');
  const release_name = getInput('release_name');
  const release_body = getInput('release_body');
  const release_artifacts = getInput('release_artifacts');
  const generate_release_notes = boolean(getInput('generate_release_notes'));
  const { owner, repo } = getRepositoryInformation(github.context.payload)

  const { data: { id, html_url } } = await octokit.request(
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
      console.log('PATH: ', path)
      return octokit.request(
        `POST https://uploads.github.com/repos/${repo}/releases/${id}/assets?name=${getVersionedFilename(path, tag_name)}`,
        {
          owner,
          repo,
          release_id: `${id}`,
          data: `@${path}`,
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }
      )
    }
    ))
  }

  core.setOutput("location", "test");
} catch (error) {
  core.setFailed(error.message);
}