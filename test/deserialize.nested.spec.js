/* global beforeEach, describe, it */
import 'jsdom-global/register'
import {expect} from 'chai'
import deserialize from '../lib/deserialize'
import domify from 'domify'

describe('deserializing nested key names', () => {
  describe('when the view has nested naming with []', () => {
    let form

    beforeEach(() => {
      form = domify(
        '<form>' +
        '<input type="text" name="widget">' +
        '<input type="text" name="foo[bar]">' +
        '<input type="text" name="foo[baz][qux]">' +
        '</form>'
      )

      deserialize(
        form,
        {
          widget: 'wombat',
          foo: {
            bar: 'baz',
            baz: {
              qux: 'qux'
            }
          }
        }
      )
    })

    it('should set root values', () => {
      expect(form.querySelector('[name="widget"]').value).to.equal('wombat')
    })

    it('should set first nested value', () => {
      expect(form.querySelector('[name="foo[bar]"]').value).to.equal('baz')
    })

    it('should set sibling nested value', () => {
      expect(form.querySelector('[name="foo[baz][qux]"]').value).to.equal('qux')
    })
  })

  describe('when the view has nested naming with [] and ends with [] for an array, on checkboxes', () => {
    let chk

    beforeEach(() => {
      let form = domify(
        '<form>' +
        '<input id="baz" type="checkbox" name="foo[bar][]" value="baz">' +
        '<input type="checkbox" name="foo[bar][]" value="qux">' +
        '</form>'
      )

      deserialize(
        form,
        {
          foo: {
            bar: ['baz', 'qux']
          }
        },
        {
          inputWriters: {
            'checkbox': (el, value) => {
              if (value.indexOf(el.value) !== -1) {
                el.checked = true
              }
            }
          }
        }
      )

      chk = form.querySelector('#baz')
    })

    it('should select the first checkbox', () => {
      expect(chk).to.be.checked
    })

    it('should select the second checkbox', () => {
      expect(chk).to.be.checked
    })
  })

  describe('when the view has nested naming with a . and using a custom keyJoiner', () => {
    let form

    beforeEach(() => {
      form = domify(
        '<form>' +
        '<input type="text" name="widget" value="wombat">' +
        '<input type="text" name="foo.bar" value="baz">' +
        '<input type="text" name="foo.baz.quux" value="qux">' +
        '</form>'
      )

      deserialize(
        form,
        {
          widget: 'wombat',
          foo: {
            bar: 'baz',
            baz: {
              quux: 'qux'
            }
          }
        },
        {
          keyJoiner: (parentKey, childKey) => {
            return [parentKey, childKey].join('.')
          }
        }
      )
    })

    it('should set root values', () => {
      expect(form.querySelector('[name="widget"]').value).to.equal('wombat')
    })

    it('should set first nested value', () => {
      expect(form.querySelector('[name="foo.bar"]').value).to.equal('baz')
    })

    it('should set sibling nested value', () => {
      expect(form.querySelector('[name="foo.baz.quux"]').value).to.equal('qux')
    })
  })
})
