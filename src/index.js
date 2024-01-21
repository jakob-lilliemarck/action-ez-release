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
    discussion_category_name: release_discussion
  }

  console.log('RELEASE PAYLOAD: ', release_payload)
  console.log(github.context.repository)

  //const response = await octokit.request(
  //  `POST /repos/${github.context.payload.repository.full_name}/releases`,
  //  {
  //    ...release_payload,
  //    headers: {
  //      'X-GitHub-Api-Version': '2022-11-28'
  //    }
  //  })

  // console.log('RELEASE URL: ', response.url)
  // core.setOutput("location", response.url);
} catch (error) {
  core.setFailed(error.message);
}
