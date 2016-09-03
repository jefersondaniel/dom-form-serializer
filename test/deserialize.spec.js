/* global beforeEach, describe, it */
import 'jsdom-global/register'
import {expect} from 'chai'
import deserialize from 'deserialize'
import domify from 'domify'

describe('deserializing an object into a form', () => {
  describe('when no elements are found', () => {
    let form

    beforeEach(() => {
      form = domify('<div><span>When I am alone I pretend to be a carrot<span/></div>')
    })

    it('should not throw an exception', () => {
      expect(() => {
        deserialize(form, {foo: 'bar'})
      }).to.not.throw(Error)
    })
  })

  describe('when deserializing into a text input', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="text" name="foo">' +
        '</form>'
      )
      deserialize(form, {foo: 'bar'})
      result = form.querySelector('[name=foo]').value
    })

    it('should set the input\'s value to the corresponding value in the given object', () => {
      expect(result).to.equal('bar')
    })
  })

  describe('when deserializing into a textarea', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<textarea name="foo"></textarea>' +
        '</form>'
      )
      deserialize(form, {foo: 'bar'})
      result = form.querySelector('[name=foo]').value
    })

    it('should set the input\'s value to the corresponding value in the given object', () => {
      expect(result).to.equal('bar')
    })
  })

  describe('when deserializing into a select box', function () {
    let result

    beforeEach(function () {
      let form = domify(
        '<form>' +
        '<select name="foo">' +
        '<option value="baz">baz</option>' +
        '<option value="bar">bar</option>' +
        '</select>' +
        '</form>'
      )
      deserialize(form, {foo: 'bar'})
      result = form.querySelector('[name=foo]').value
    })

    it('should select the option corresponding to the value in the given object', () => {
      expect(result).to.equal('bar')
    })
  })

  describe('when deserializing into a checkbox', () => {
    let makeForm

    beforeEach(() => {
      makeForm = () => {
        return domify(
          '<form>' +
          '<input type="checkbox" id="the-checkbox" name="chk">' +
          '</form>'
        )
      }
    })

    describe('and the corresponding value in the given object is true', () => {
      let result

      beforeEach(() => {
        let form = makeForm()
        deserialize(form, {chk: true})
        result = form.querySelector('[name=chk]').checked
      })

      it('should check the checkbox', () => {
        expect(result).to.be.true
      })
    })

    describe('and the corresponding value in the given object is false', () => {
      let result

      beforeEach(() => {
        let form = makeForm()
        form.querySelector('[name=chk]').checked = true
        deserialize(form, {chk: false})
        result = form.querySelector('[name=chk]').checked
      })

      it('should uncheck the checkbox', () => {
        expect(result).to.be.false
      })
    })
  })

  describe('when deserializing into a button', () => {
    let result, value

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<button name="btn">foo</button>' +
        '</form>'
      )
      value = form.querySelector('[name=btn]').value
      deserialize(form, {btn: 'foo'})
      result = form.querySelector('[name=btn]').value
    })

    it('the button value should remain unchanged', () => {
      expect(result).to.equal(value)
    })
  })

  describe('when deserializing into an input with type of "submit"', () => {
    let value, result

    beforeEach(function () {
      let form = domify(
        '<form>' +
        '<input type="submit" name="btn" text="Foo">' +
        '</form>'
      )
      value = form.querySelector('[name=btn]').value
      deserialize(form, {btn: 'foo'})
      result = form.querySelector('[name=btn]').value
    })

    it('the input value should remain unchanged', () => {
      expect(result).to.equal(value)
    })
  })

  describe('when deserializing into an input with type of "reset"', () => {
    let value, result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="reset" name="btn" text="Foo">' +
        '</form>'
      )
      value = form.querySelector('[name=btn]').value
      deserialize(form, {btn: 'foo'})
      result = form.querySelector('[name=btn]').value
    })

    it('the input should not have a value', () => {
      expect(result).to.equal(value)
    })
  })

  describe('when deserializing into a radio button group', () => {
    let checked

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="radio" name="foo" value="foo">' +
        '<input type="radio" name="foo" value="bar">' +
        '<input type="radio" name="foo" value="baz">' +
        '</form>'
      )
      deserialize(form, {foo: 'bar'})
      checked = form.querySelector('input[name=foo][value=bar]').checked
    })

    it('should select the corresponding radio button', () => {
      expect(checked).to.be.true
    })
  })

  describe('when deserializing into a radio button group (when value is a number)', () => {
    let checked

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="radio" name="foo" value="1"/>' +
        '<input id="value-2" type="radio" name="foo" value="2"/>' +
        '<input type="radio" name="foo" value="3"/>' +
        '</form>'
      )
      deserialize(form, {foo: 2})
      checked = form.querySelector('#value-2').checked
    })

    it('should select the corresponding radio button', () => {
      expect(checked).to.be.true
    })
  })

  describe('when deserializing without a form', () => {
    let result

    beforeEach(() => {
      let div = domify(
        '<div>' +
        '<input type="text" name="foo">' +
        '</div>'
      )
      deserialize(div, {foo: 'bar'})
      result = div.querySelector('input').value
    })

    it('should set the input\'s value', () => {
      expect(result).to.equal('bar')
    })
  })

  describe('when deserializing multiple forms', () => {
    let div

    beforeEach(() => {
      div = domify(
        '<div>' +
        '<form>' +
        '<input type="text" name="foo">' +
        '</form>' +
        '<form>' +
        '<input type="text" name="bar">' +
        '</form>' +
        '</div>'
      )
      deserialize(div, {foo: 'bar', bar: 'foo'})
    })

    it('should set the input\'s value', () => {
      let foo = div.querySelector('input[name=foo]').value
      let bar = div.querySelector('input[name=bar]').value
      expect(foo).to.equal('bar')
      expect(bar).to.equal('foo')
    })
  })

  describe('when ignoring a field by selector', () => {
    let result

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input type="text" name="foo" value="bar">' +
        '<input type="text" name="dontDeserialize" class="doNotSerializeMe" value="myOriginalValue">' +
        '</form>'
      )
      // ignore all .doNotSerializeMe elements
      deserialize(
        form,
        {foo: 'foo', dontDeserialize: 'iShouldNotBeSet'},
        {ignoredTypes: ['.doNotSerializeMe']}
      )
      result = form.querySelector('input[name=dontDeserialize]').value
    })

    it('should not modify fields excluded by selector', () => {
      expect(result).to.eql('myOriginalValue')
    })
  })
})
