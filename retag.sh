#!/bin/bash
if [ $# -eq 2 ]
  then
    ncc build src/index.ts --license licenses.txt
    git add .
    git push --delete origin $1
    git tag -d $1
    git commit -m $2
    git tag -a $1 -m $2
    git push --follow-tags
fi