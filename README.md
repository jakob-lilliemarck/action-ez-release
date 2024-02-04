# Switch matrix
Run heterogeneous commands in a GitHub workflow job matrix.

```yml
name: Create a release

on: [push]

jobs:
 main:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "foo" > foo.txt
          echo "bar" > bar.txt
          echo "bax" > baz.txt

      - uses: jakob-lilliemarck/action-release@v1
        with:
          release_artifacts: |
            foo.txt
            bar.txt
            baz.txt
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```