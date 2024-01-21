import core from '@actions/core';
import github from '@actions/github';
import { Octokit } from '@octokit/action';

const octokit = new Octokit()

const getRequiredInput = (key) => {
  const value = core.getInput(key);
  if (value) return value
  throw new Error(`Missing required input ${key}`)
}

const getBoolean = (value) => {
  switch (value) {
    case 'true':
      return true
    default:
      return false
  }
}

try {
  // `who-to-greet` input defined in action metadata file
  const tag_name = getRequiredInput('tag_name');
  const name = core.getInput('release_name');
  const body = core.getInput('release_body');
  const release_artifacts = core.getInput('release_artifacts');
  const release_discussion = core.getInput('release_discussion');
  const generate_release_notes = getBoolean(core.getInput('generate_release_notes'));

  const { owner, full_name, } = github.context.payload.repository

  const release_payload = {
    owner,
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

  //const response = await octokit.request(
  //  `POST /repos/${github.context.payload.repository.full_name}/releases`,
  //  {
  //    ...release_payload,
  //    headers: {
  //      'X-GitHub-Api-Version': '2022-11-28'
  //    }
  //  })

  //console.log('RELEASE URL: ', response.url)
  //core.setOutput("location", response.url);
} catch (error) {
  core.setFailed(error.message);
}
