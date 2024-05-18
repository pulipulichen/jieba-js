#!/bin/bash

node build/update-citation.js

# =================================================================

new_version=$(date '+%Y%m%d.%H%M%S')

git tag $new_version
git push origin $new_version

# =================================================================

git add .
git commit -m "${new_version}"
git push --force-with-lease