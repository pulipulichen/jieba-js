const fs = require('fs')
const path = require('path')

const package_info = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8').toString())

const author_name = package_info.author.name
const family_name = author_name.slice(author_name.lastIndexOf(' ') + 1)
const given_name = author_name.slice(0, author_name.lastIndexOf(' '))

let repository_code = package_info.homepage
if (repository_code.indexOf('#') > -1) {
  repository_code = repository_code.slice(0, repository_code.indexOf('#'))
}

let citation_cff_yaml = `cff-version: 1.2.0
message: "If you use this software, please cite it using these metadata."
authors:
  - family-names: ${family_name}
    given-names: ${given_name}
    orcid: ${package_info.author.orcid}
    email: ${package_info.author.url}
title: "${package_info.name}"
license: "${package_info.license}"
repository-code: "${repository_code}"
abstract: "${package_info.description}"`

if (package_info.doi) {
  citation_cff_yaml = citation_cff_yaml + `
identifiers:
  - type: doi
    value: ${package_info.doi}`
}

fs.writeFileSync(path.resolve(__dirname, '../CITATION.cff'), citation_cff_yaml, 'utf-8')
