# Create a release
Create a GitHub release and optionally append release assets.

This action requires permissions to create releases, either by toggling write access for workflows under repository settings, or by specifying `contents: write` when calling the action in your workflow.

```yml
name: Create a release

on: [push]

jobs:
 main:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - run: |
          echo "foo" > ./foo.txt
          echo "bar" > ./bar.txt
          echo "bax" > ./baz.txt
          ls -R

      - uses: jakob-lilliemarck/action-release@v1
        with:
          tag_name: _test
          release_artifacts: |
            foo.txt
            bar.txt
            baz.txt
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```