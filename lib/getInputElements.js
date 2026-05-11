import getElementType from './getElementType'

export default function getInputElements (element, options) {
  return Array.prototype.filter.call(
    element.querySelectorAll('input,select,textarea'),
    (el) => {
      if (el.tagName.toLowerCase() === 'input' && (el.type === 'submit' || el.type === 'reset')) {
        return false
      }
      const myType = getElementType(el)
      const extractor = options.keyExtractors.get(myType)
      const identifier = extractor(el)
      const foundInInclude = (options.include || []).indexOf(identifier) !== -1
      const foundInExclude = (options.exclude || []).indexOf(identifier) !== -1
      let foundInIgnored = false
      let reject = false

      if (options.ignoredTypes) {
        for (const selector of options.ignoredTypes) {
          if (el.matches(selector)) {
            foundInIgnored = true
          }
        }
      }

      if (foundInInclude) {
        reject = false
      } else {
        if (options.include) {
          reject = true
        } else {
          reject = (foundInExclude || foundInIgnored)
        }
      }

      return !reject
    }
  )
}
