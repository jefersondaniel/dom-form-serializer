/* global beforeEach, describe, it */
import 'global-jsdom/register'
import { expect } from 'chai'
import serialize from '../lib/serialize'
import domify from 'domify'

describe('serializing nested key names', () => {
  describe('when the view has nested naming with []', () => {
    let result

    beforeEach(() => {
      const form = domify(
        '<form>' +
        '<input type="text" name="widget" value="wombat">' +
        '<input type="text" name="foo[bar]" value="baz">' +
        '<input type="text" name="foo[baz][quux]" value="qux">' +
        '</form>'
      )
      result = serialize(form)
    })

    it('has a property defined', () => {
      expect(result.widget).to.not.equal(undefined)
    })

    it('retrieves the value for the property', () => {
      expect(result.widget).to.equal('wombat')
    })

    it('has a nested property defined', () => {
      expect(result.foo.bar).to.not.equal(undefined)
    })

    it('retrieves the value for the nested property', () => {
      expect(result.foo.bar).to.equal('baz')
    })

    it('has a nested, sibling property defined', () => {
      expect(result.foo.baz.quux).to.not.equal(undefined)
    })

    it('retrieves the value for the nested, sibling property', () => {
      expect(result.foo.baz.quux).to.equal('qux')
    })
  })

  describe('when the view has nested naming with [] and ends with [] for an array', () => {
    let result

    beforeEach(() => {
      const form = domify(
        '<form>' +
        '<input type="checkbox" name="foo[bar][]" value="baz" checked="checked">' +
        '<input type="checkbox" name="foo[bar][]" value="qux" checked="checked">' +
        '</form>'
      )

      result = serialize(
        form,
        {
          inputReaders: {
            checkbox: (el) => el.value
          }
        }
      )
    })

    it('has a nested property defined', () => {
      expect(result.foo.bar).to.not.equal(undefined)
    })

    it('should have the first value', () => {
      expect(result.foo.bar[0]).to.equal('baz')
    })

    it('should have the second value', () => {
      expect(result.foo.bar[1]).to.equal('qux')
    })
  })

  describe('when the keys are split by a custom splitter in the serialize call', () => {
    let result

    beforeEach(() => {
      const form = domify(
        '<form>' +
        '<input type="text" name="widget" value="wombat">' +
        '<input type="text" name="foo.bar" value="baz">' +
        '<input type="text" name="foo.baz.quux" value="qux">' +
        '</form>'
      )

      result = serialize(
        form,
        {
          keySplitter: (key) => key.split('.')
        }
      )
    })

    it('has a property defined', () => {
      expect(result.widget).to.not.equal(undefined)
    })

    it('retrieves the value for the property', () => {
      expect(result.widget).to.equal('wombat')
    })

    it('has a nested property defined', () => {
      expect(result.foo.bar).to.not.equal(undefined)
    })

    it('retrieves the value for the nested property', () => {
      expect(result.foo.bar).to.equal('baz')
    })

    it('has a nested, sibling property defined', () => {
      expect(result.foo.baz.quux).to.not.equal(undefined)
    })

    it('retrieves the value for the nested, sibling property', () => {
      expect(result.foo.baz.quux).to.equal('qux')
    })
  })

  describe('when an input name targets prototype-pollution sinks', () => {
    it('does not pollute Object.prototype via __proto__', () => {
      const form = domify(
        '<form>' +
        '<input type="text" name="__proto__[polluted]" value="yes">' +
        '</form>'
      )
      const result = serialize(form)
      expect({}.polluted).to.equal(undefined)
      expect(result.polluted).to.equal(undefined)
    })

    it('does not pollute Object.prototype via constructor.prototype', () => {
      const form = domify(
        '<form>' +
        '<input type="text" name="constructor[prototype][polluted]" value="yes">' +
        '</form>'
      )
      const result = serialize(form)
      expect({}.polluted).to.equal(undefined)
      expect(result.polluted).to.equal(undefined)
    })

    it('does not pollute via a nested __proto__ segment', () => {
      const form = domify(
        '<form>' +
        '<input type="text" name="foo[__proto__][polluted]" value="yes">' +
        '</form>'
      )
      serialize(form)
      expect({}.polluted).to.equal(undefined)
    })
  })
})
