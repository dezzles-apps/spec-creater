import { expect } from 'chai'
import { describe, it } from 'mocha'
import { validName, arrayIsNotEmpty } from '../src/validator.js'

describe('validName', () => {
  ['nginx', 'nginx-1', 'nginx-app', 'nginx-app-1'].forEach(name => {
    it(`should validate ${name} as a valid name`, () => {
      expect(validName(name)).to.be.true
    })
  });
  [
    'Nginx', 'nginx_app', 'nginx.app', '-nginx', 'nginx-', 'nginx--app', '', '     ', 'test   '
  ].forEach(name => {
    it(`should validate ${name} as an invalid name`, () => {
      expect(validName(name)).to.be.false
    })
  });
})

describe('arrayIsNotEmpty', () => {
  it('should validate non-empty array as true', () => {
    expect(arrayIsNotEmpty([1, 2, 3])).to.be.true
  })
  it('should validate empty array as false', () => {
    expect(arrayIsNotEmpty([])).to.be.false
  })
  it('should validate non-array input as false', () => {
    expect(arrayIsNotEmpty('not an array')).to.be.false
    expect(arrayIsNotEmpty(123)).to.be.false
    expect(arrayIsNotEmpty({})).to.be.false
  })
})