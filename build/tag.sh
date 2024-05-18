#!/bin/bash

node build/update-citation.js

# =================================================================

new_version=$(date '+%Y%m%d.%H%M%S')

git tag $new_version
git push origin $new_version

# # =================================================================

git add .
git commit -m "${new_version}"
git push --force-with-lease

# =================================================================

GITHUB_HOMEPAGE=`jq -r '.homepage' package.json`
#echo $GITHUB_HOMEPAGE

GITHUB_USER=`echo $GITHUB_HOMEPAGE | awk -F'/' '{print $4}'`

GITHUB_REPO=`jq -r '.name' package.json`
#echo $GITHUB_REPO

DOI=`jq -r '.doi' package.json`

echo "================================================"
echo "Integrate GitHub with Zenodo: https://rb.gy/ql60qi"
echo ""
echo "Steps:"
echo "1. Zenono GitHub Setting:  https://zenodo.org/account/settings/github/"
echo "2. GitHub New Release:  https://github.com/${GITHUB_USER}/${GITHUB_REPO}/releases/new"
echo "3. Zenono Repository Management:  https://zenodo.org/account/settings/github/repository/${GITHUB_USER}/${GITHUB_REPO}"
echo "4. Create new tag and push to GitHub."
if [ -n "$DOI" ]; then
  echo "5. GitHub New Release Again:  https://github.com/${GITHUB_USER}/${GITHUB_REPO}/releases/new"
  echo "6. GitHub Homepage:  ${GITHUB_HOMEPAGE}"
  echo "7. Zenono Public:  https://doi.org/${DOI}"
fi
echo "================================================"