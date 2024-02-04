# Create a release
Create a GitHub release and optionally append release assets

```yml
name: Create a release

on: [push]

jobs:
 simple:
    runs-on: ubuntu-latest
    steps:
      - run: |
          echo "foo" > foo.txt
          echo "bar" > bar.txt
          echo "bax" > baz.txt

      - uses: jakob-lilliemarck/action-release@v1
        with:
          tag_name: '_test'
          release_artifacts: |
            foo.txt
            bar.txt
            baz.txt
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

```