import core from '@actions/core';
import github from '@actions/github';
import { WebhookPayload } from '@actions/github/lib/interfaces.js';
import { Octokit } from '@octokit/action';

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

const boolean = (value: string | undefined) => {
  switch (value) {
    case 'true':
      return true
    default:
      return false
  }
}

const getPaths = (release_artifacts: string) => release_artifacts.split(",").map((path) => path.trim())

const getRepositoryInformation = (payload: WebhookPayload) => {
  if (!payload.repository) throw new Error(`No key "repository" in payload: \n${JSON.stringify(payload, null, 4)}`)
  const { owner: { name }, full_name } = payload.repository
  if (!(name && full_name)) throw new Error(`Could not extract required information from the pau`)
  return { owner: name, repo: full_name }
}

//try {
//  // `who-to-greet` input defined in action metadata file
//  const tag_name = getRequired('tag_name');
//  const release_name = getInput('release_name');
//  const release_body = getInput('release_body');
//  const release_artifacts = getInput('release_artifacts');
//  const generate_release_notes = boolean(getInput('generate_release_notes'));
//  const { owner, repo } = getRepositoryInformation(github.context.payload)

// Create release
//const { data: { id, html_url } } = await octokit.request(
//  `POST /repos/${repo}/releases`,
//  {
//    owner,
//    repo,
//    tag_name,
//    name: release_name,
//    body: release_body,
//    draft: false,
//    prerelease: false,
//    generate_release_notes,
//    headers: {
//      'X-GitHub-Api-Version': '2022-11-28'
//    }
//  }
//)

//if (release_artifacts) {
//  await Promise.all(getPaths(release_artifacts).map((path) =>
//    octokit.request(
//      `POST https://uploads.github.com/repos/${repo}/releases/${id}/assets?name=${release_artifacts}`,
//      {
//        owner,
//        repo,
//        release_id: `${id}`,
//        data: `@${path}`,
//        headers: {
//          'X-GitHub-Api-Version': '2022-11-28'
//        }
//      }
//    )
//  ))
//}

//  core.setOutput("location", "test");
//} catch (error) {
//  // @ts-ignore
//  core.setFailed(error.message);
//}

try {
  // `who-to-greet` input defined in action metadata file
  const tag_name = getRequired('tag_name');
  const name = getInput('release_name');
  const body = getInput('release_body');
  const release_artifacts = getInput('release_artifacts');
  const release_discussion = getInput('release_discussion');
  const generate_release_notes = boolean(getInput('generate_release_notes'));

  // @ts-ignore
  const { owner, full_name, } = github.context.payload.repository

  const release_payload = {
    owner: owner.name,
    repo: full_name,
    tag_name,
    name,
    body,
    draft: false,
    prerelease: false,
    generate_release_notes,
  }

  // Create release
  const { data: { id, html_url, upload_url: provided_upload_url } } = await octokit.request(
    `POST /repos/${full_name}/releases`,
    {
      ...release_payload,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })


  const upload_url = `POST /repos/${full_name}/releases/${id}/assets?name=${release_artifacts}`
  const upload_payload = {
    owner: owner.name,
    repo: full_name,
    release_id: `${id}`,
    data: `@${release_artifacts}`
  }

  // Append assets
  const upload_response = await octokit.request(`POST https://uploads.github.com/repos/${full_name}/releases/${id}/assets?name=${release_artifacts}`, {
    ...upload_payload,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  core.setOutput("location", html_url);
} catch (error) {
  //@ts-ignore
  core.setFailed(error.message);
}
