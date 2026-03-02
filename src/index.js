import * as core from "@actions/core"
import * as github from "@actions/github"
import yaml from 'js-yaml'
import fs from 'fs'
import { createSpec } from "./spec-creator.js"
import validate from "./validator.js"
function getParameters() {
  const version = core.getInput("version")
  const spec = core.getInput("spec")
  return { version, spec }
}
try {
  const { version, spec } = getParameters()
  core.info(`Version: ${version}`)
  core.info(`Spec: ${spec}`)
  if (!fs.existsSync(spec)) {
    throw new Error(`Spec file not found: ${spec}`)
  }
  const specBody = fs.readFileSync(spec, 'utf-8')
  let specJson = null
  if (spec.endsWith('.json')) {
    specJson = JSON.parse(specBody)
  } else if (spec.endsWith('.yaml') || spec.endsWith('.yml')) {
    specJson = yaml.load(specBody)
  } else {
    throw new Error('Unsupported spec file format. Please use JSON or YAML.')
  }
  const validationErrors = validate(specJson)
  if (validationErrors.length > 0) {
    const errorMessages = validationErrors.map(e => `Field: ${e.field}${e.index !== null ? `[${e.index}]` : ''} - ${e.message}`).join('\n')
    throw new Error(`Spec validation failed with the following errors:\n${errorMessages}`)
  }
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  fs.mkdirSync('specs', { recursive: true })
  specJson.environments.forEach(env => {
    const generatedSpec = createSpec(specJson, version, env)
    const outputPath = `specs/${specJson.name}-${env}.yaml`
    fs.writeFileSync(outputPath, generatedSpec)
  })
  core.info(`The event payload: ${payload}`)
} catch (error) {
  core.setFailed(error.message)
}