import { expect } from 'chai'
import { describe, it } from 'mocha'
import { createSpec } from '../src/spec-creator.js'
import fs from 'fs'
import yaml from 'js-yaml'
describe('Mapping', () => {
  it('should map single app spec correctly', () => {
    const spec = yaml.load(fs.readFileSync('./test/single-app.yml', 'utf-8'))
    const expected = fs.readFileSync('./test/single-app-expected.yml', 'utf-8').trim()
    const mappedSpec = createSpec(spec, '1.0.0', 'prod').trim()
    expect(mappedSpec).to.equal(expected)
  })
  it('should map dual app spec correctly', () => {
    const spec = yaml.load(fs.readFileSync('./test/dual-app.yml', 'utf-8'))
    const expected = fs.readFileSync('./test/dual-app-expected.yml', 'utf-8').trim()
    const mappedSpec = createSpec(spec, '1.0.2', 'uat').trim()
    expect(mappedSpec).to.equal(expected)
  })
})