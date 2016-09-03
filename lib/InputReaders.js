import TypeRegistry from './TypeRegistry'

export default class InputReaders extends TypeRegistry {
  constructor (options) {
    super(options)
    this.registerDefault(el => el.value)
    this.register('checkbox', el => el.checked)
  }
}
