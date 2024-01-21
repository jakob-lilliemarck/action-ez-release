import core from '@actions/core';
import github from '@actions/github';
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

try {
  // `who-to-greet` input defined in action metadata file
  const tag_name = getRequired('tag_name');
  const name = getInput('release_name');
  const body = getInput('release_body');
  const release_artifacts = getInput('release_artifacts');
  const release_discussion = getInput('release_discussion');
  const generate_release_notes = boolean(getInput('generate_release_notes'));

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
  const response = await octokit.request(
    `POST /repos/${full_name}/releases`,
    {
      ...release_payload,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

  console.log('response: ', response)

  // Append assets
  //const upload_response = await octokit.request(`POST /repos/${full_name}/releases/${id}/assets?name=${release_artifacts}`, {
  //  owner: owner.name,
  //  repo: full_name,
  //  release_id: id,
  //  data: `@${release_artifacts}`,
  //  headers: {
  //    'X-GitHub-Api-Version': '2022-11-28'
  //  }
  //})
  //console.log('UPLOAD RESPONSE: ', upload_response)

  core.setOutput("location", response.html_url);
} catch (error) {
  core.setFailed(error.message);
}
