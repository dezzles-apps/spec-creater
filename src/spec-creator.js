import mustache from 'mustache'
import fs from 'fs'
const gcloudRunTemplate = fs.readFileSync('./gcloud-run.mustache.yml', 'utf-8')

export default function mapSpec(spec, version, environments) {
  const mappedSpec = JSON.parse(JSON.stringify(spec));
  mappedSpec.version = version;
  mappedSpec.environments = environments;
  return mappedSpec;
}

export function createSpec(spec, version, environment) {
  const hasSidecars = spec.sidecars && spec.sidecars.length > 0
  return mustache.render(gcloudRunTemplate, { spec, version, environment, hasSidecars })
}