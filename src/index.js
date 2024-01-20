import core from '@actions/core';
import github from '@actions/github';
import { Octokit } from '@octokit/action';

const octokit = new Octokit()


try {
  // `who-to-greet` input defined in action metadata file
  const artifacts = core.getInput('artifacts');
  console.log('INPUTS', artifacts)
  console.log('CONTEXT', github.context)
  console.log('ENV', github.repository)
  const request = `POST /repos/jakob-lilliemarck/action-release-test/releases`

  //const response = await octokit.request(request, {
  //  owner: github.repository_owner,
  //  repo: github.repository,
  //  tag_name: 'v1.0.0',
  //  target_commitish: 'main',
  //  name: 'v1.0.0',
  //  body: 'Description of the release',
  //  draft: false,
  //  prerelease: false,
  //  generate_release_notes: false,
  //  headers: {
  //    'X-GitHub-Api-Version': '2022-11-28'
  //  }
  //})
  //core.setOutput("location", response.url);
} catch (error) {
  core.setFailed(error.message);
}
