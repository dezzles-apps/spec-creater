import { Validator } from '@cfworker/json-schema';
import { readFileSync } from 'fs'

export default function validate(spec) {
  const projectV1Schema = JSON.parse(
    readFileSync('./schemas/project.v1.schema.json', 'utf8')
  );
  
  const validator = new Validator(projectV1Schema);
  [
    'container',
    'env-variable',
    'secret',
    'gcs-mount'
  ].forEach(schema => {
    const s = readFileSync(`./schemas/${schema}.schema.json`, 'utf8');
    validator.addSchema(JSON.parse(s))
  })

  return validator.validate(spec)
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