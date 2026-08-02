import mustache from 'mustache'
import gcloudRunTemplate from './gcloud-template.js'
export default function mapSpec(spec, version, environments) {
  const mappedSpec = JSON.parse(JSON.stringify(spec));
  mappedSpec.version = version;
  mappedSpec.environments = environments;
  return mappedSpec;
}

function handleNumericEnvValues(env) {
  return env.map(variable => {
    if (typeof variable.value === 'number') {
      return { ...variable, value: `'${variable.value}'` };
    }
    if (typeof variable.value === 'string' && !isNaN(variable.value)) {
      return { ...variable, value: `'${variable.value}'` };
    }
    return variable;
  });
}

export function createSpec(spec, version, environment) {
  const hasSidecars = spec.sidecars && spec.sidecars.length > 0
  if (spec.primary) {
    spec.primary.env = handleNumericEnvValues(spec.primary.env || []);
  }
  if (spec.sidecars) {
    spec.sidecars = spec.sidecars.map(sidecar => {
      sidecar.env = handleNumericEnvValues(sidecar.env || []);
      return sidecar;
    });
  }
  return mustache.render(gcloudRunTemplate, { spec, version, environment, hasSidecars })
}