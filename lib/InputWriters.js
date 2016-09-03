import TypeRegistry from './TypeRegistry'

export default class InputWriters extends TypeRegistry {
  constructor (options) {
    super(options)
    this.registerDefault((el, value) => { el.value = value })
    this.register('checkbox', (el, value) => {
      if (value === null) {
        el.indeterminate = true
      } else {
        el.checked = value
      }
    })
    this.register('radio', function (el, value) {
      if (value !== undefined) {
        el.checked = el.value === value.toString()
      }
    })
  }
}
