/* global beforeEach, describe, it */
import 'jsdom-global/register'
import {expect} from 'chai'
import serialize from '../lib/serialize'
import domify from 'domify'

describe('serialize', () => {
  describe('when serializing a text input', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="text" name="foo" value="bar">' +
        '</form>'
      )
      result = serialize(form)
    })

    it('should return an object with a key from the text input name', () => {
      expect(result).to.have.have.ownProperty('foo')
    })

    it('should have the input\'s value', () => {
      expect(result.foo).to.equal('bar')
    })
  })

  describe('when serializing a text input', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="text" value="bar">' +
        '</form>'
      )
      result = serialize(form)
    })

    it('should not serialize the value to the target object', () => {
      expect(result).to.be.ok
    })
  })

  describe('when serializing a textarea', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<textarea name="foo">bar</textarea>' +
        '</form>'
      )
      result = serialize(form)
    })

    it('should have the textarea\'s value', () => {
      expect(result.foo).to.equal('bar')
    })
  })

  describe('when serializing a select box', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<select name="foo">' +
        '<option value="bar">bar</option>' +
        '</select>' +
        '</form>'
      )
      result = serialize(form)
    })

    it('should have the options\'s value', function () {
      expect(result.foo).to.equal('bar')
    })
  })

  describe('when serializing a multiple select box', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<select name="foo" multiple>' +
        '<option value="foo">foo</option>' +
        '<option value="bar" selected>bar</option>' +
        '</select>' +
        '</form>'
      )
      result = serialize(form)
    })

    it('should have the options\'s value as array', function () {
      expect(result.foo).to.deep.equal(['bar'])
    })
  })

  describe('when serializing a checkbox', () => {
    let form

    beforeEach(() => {
      form = domify(
        '<form>' +
        '<input type="checkbox" id="the-checkbox" name="chk">' +
        '</form>'
      )
    })

    describe('and the checkbox is checked', () => {
      let result

      beforeEach(() => {
        form.querySelector('#the-checkbox').checked = true
        result = serialize(form)
      })

      it('should return an object with a value of true', () => {
        expect(result.chk).to.be.true
      })
    })

    describe('and the checkbox is not checked', () => {
      let result

      beforeEach(() => {
        result = serialize(form)
      })

      it('should return an object with a value of false', () => {
        expect(result.chk).to.be.false
      })
    })
  })

  describe('when serializing a button', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<button name="btn" value="foo">foo</button>' +
        '</form>'
      )
      result = serialize(form)
    })

    it('should return an object with a value of false', () => {
      expect(result.hasOwnProperty('btn')).to.be.false
    })
  })

  describe('when serializing an input with type of "submit"', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="submit" name="btn" value="foo" text="Foo">' +
        '</form>'
      )
      result = serialize(form)
    })

    it('should not have the button\'s value', () => {
      expect(result.hasOwnProperty('btn')).to.be.false
    })
  })

  describe('when serializing a radio button group', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="radio" name="foo" value="foo">' +
        '<input type="radio" name="foo" value="bar" checked>' +
        '<input type="radio" name="foo" value="baz">' +
        '</form>'
      )
      result = serialize(form)
    })

    it('should only return the value of the selected radio button', () => {
      expect(result.foo).to.equal('bar')
    })
  })

  describe('when serializing an array input', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="checkbox" name="foo[bar][]" value="baz" checked="checked">' +
        '<input type="checkbox" name="foo[bar][]" value="biz">' +
        '<input type="checkbox" name="foo[bar][]" value="qux" checked="checked">' +
        '</form>'
      )
      result = serialize(form)
    })

    it('should return result as array', () => {
      expect(result.foo.bar).to.deep.equal(['baz', 'qux'])
    })
  })

  describe('when ignoring a field by selector', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input name="a">' +
        '<input name="b" class="doNotSerializeMe">' +
        '<input name="c">' +
        '<input name="d" class="doNotSerializeMe">' +
        '<button name="e">' +
        '</form>'
      )
      result = serialize(form, {ignoredTypes: ['.doNotSerializeMe']})
    })

    it('should not include fields excluded by selector', () => {
      expect(result).to.eql({a: '', c: ''})
    })
  })
})
