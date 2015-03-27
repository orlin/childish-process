/*global expect */

'use strict'

var o = require('../options/index.js')

describe('options', () => {
  describe('args:', () => {
    it('given no args, returns an empty object', () => {
      expect(o()).to.eql({})
    })
  })
})
