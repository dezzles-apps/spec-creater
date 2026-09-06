import { expect } from 'chai'
import { describe, it } from 'mocha'
import fs from 'fs'
import yaml from 'js-yaml'
import validate from '../src/validator.js'


describe('Validations', () => {
  ['single-app.yml', 'dual-app.yml'].forEach(test => {
    it(`Successfully validates ${test}`, () => {
      const spec = yaml.load(fs.readFileSync(`./test/${test}`, 'utf-8'))
      const results = validate(spec)
      console.table(results.errors)
      expect(results.valid).to.be.true
    })
  })
})