const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('node:fs');

try {
  // `who-to-greet` input defined in action metadata file
  const artifacts = core.getInput('artifacts');

  artifacts.split(",").forEach((s) => {
    fs.readFile(s.trim(), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(data);
    });
  })

  core.setOutput("location", "thisWillBeAURI");

  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
