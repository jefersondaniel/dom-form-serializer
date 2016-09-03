/* global beforeEach, describe, it */
import 'jsdom-global/register'
import {expect} from 'chai'
import serialize from 'serialize'
import domify from 'domify'

describe('override the list of fields to include or ignore', () => {
  let form

  beforeEach(() => {
    form = domify(
      '<form>' +
      '<input name="a">' +
      '<input name="b">' +
      '<input name="c">' +
      '<input name="d">' +
      '<button name="e">' +
      '</form>'
    )
  })

  describe('when specifying which fields to include', () => {
    let result

    beforeEach(() => {
      result = serialize(form, {include: ['a', 'b']})
    })

    it('should include the specified fields', () => {
      expect(result).to.have.ownProperty('a')
      expect(result).to.have.ownProperty('b')
    })

    it('should not include other fields', () => {
      expect(result).not.to.have.ownProperty('c')
      expect(result).not.to.have.ownProperty('d')
      expect(result).not.to.have.ownProperty('e')
    })
  })

  describe('when specifying fields to exclude', () => {
    let result

    beforeEach(() => {
      result = serialize(form, {
        exclude: ['a', 'b']
      })
    })

    it('should ignore the specified fields', () => {
      expect(result).not.to.have.ownProperty('a')
      expect(result).not.to.have.ownProperty('b')
    })

    it('should include all other fields', () => {
      expect(result).to.have.ownProperty('c')
      expect(result).to.have.ownProperty('d')
    })
  })

  describe('when specifying fields to include that have also been excluded', () => {
    let result

    beforeEach(() => {
      result = serialize(form, {
        include: ['a', 'b'],
        exclude: ['a', 'b']
      })
    })

    it('should include the specified fields', () => {
      expect(result).to.have.ownProperty('a')
      expect(result).to.have.ownProperty('b')
    })
  })
})
