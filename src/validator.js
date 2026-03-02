export default function validate(spec) {
  const errors = [];
  if (spec === null || typeof spec !== 'object') {
    errors.push(error('spec', null, 'Invalid spec, missing or malformed'));
    return errors;
  }
  if (!validName(spec.name)) {
    errors.push(error('name', null, 'Invalid name, must be lowercase alphanumeric and can include hyphens'));
  }
  if (!arrayIsNotEmpty(spec.environments)) {
    errors.push(error('environments', null, 'Environments must be a non-empty array'));
  } else {
    spec.environments.forEach((env, index) => {
      if (!validEnvironment(env)) {
        errors.push(error('environments', index, `Invalid environment '${env}', must be one of: dev, sit, uat, non, prod`));
      }
    });
  }
  if (!isObject(spec.primary)) {
    errors.push(error('primary', null, 'Primary container must be set'));
  } else {
    validateContainer(spec.primary, 'primary', errors);
  }
  if (arrayIsNotEmpty(spec.sidecars)) {
    spec.sidecars.forEach((sidecar, index) => {
      if (!isObject(sidecar)) {
        errors.push(error('sidecars', index, 'Sidecar must be an object'));
      } else {
        validateContainer(sidecar, `sidecars[${index}]`, errors);
      }
    });
  }
  return errors;
}

export function validateContainer(container, fieldPrefix, errors) {
  if (!validName(container.name)) {
    errors.push(error(`${fieldPrefix}.name`, null, 'Invalid container name, must be lowercase alphanumeric and can include hyphens'));
  }
  if (typeof container.image !== 'string' || container.image.trim() === '') {
    errors.push(error(`${fieldPrefix}.image`, null, 'Container image must be set'));
  }
  if (!validPort(container.port)) {
    errors.push(error(`${fieldPrefix}.port`, null, 'Container port must be between 1 and 65535'));
  }
}

export function validPort(port) {
  return Number.isInteger(port) && port > 0 && port <= 65535;
}

export function validName(name) {
  const regex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  return regex.test(name);
}

export function arrayIsNotEmpty(arr) {
  return Array.isArray(arr) && arr.length > 0;
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

export function validEnvironment(env) {
  const validEnvironments = ['dev', 'sit', 'uat', 'non', 'prod'];
  return validEnvironments.includes(env);
}

export function error(field, index, message) {
  return {
    field,
    index,
    message,

  }
}