/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.3.0): tools/sanitizer.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const uriAttrs = [
  'background',
  'cite',
  'href',
  'itemtype',
  'longdesc',
  'poster',
  'src',
  'xlink:href'
]

/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe.
 *
 * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
 */
const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi

/**
 * A pattern that matches safe data URLs. Only matches image, video and audio types.
 *
 * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
 */
const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i

function allowedAttribute(attr, allowedAttributeList) {
  const attrName = attr.nodeName.toLowerCase()

  if (allowedAttributeList.indexOf(attrName) !== -1) {
    if (uriAttrs.indexOf(attrName) !== -1) {
      return attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN)
    }

    return true
  }

  return false
}

export function sanitizeHtml(unsafeHtml, forbiddenTagList, allowedAttributeList) {
  const domParser = new window.DOMParser()
  const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html')

  const elements = [].slice.call(createdDocument.body.querySelectorAll('*'))
  for (let i = 0, len = elements.length; i < len; i++) {
    const el = elements[i]

    if (forbiddenTagList.indexOf(el.nodeName.toLowerCase()) !== -1) {
      el.parentNode.removeChild(el)

      continue
    }

    const attributeList = [].slice.call(el.attributes)

    attributeList.forEach((attr) => {
      if (!allowedAttribute(attr, allowedAttributeList)) {
        el.removeAttribute(attr.nodeName)
      }
    })
  }

  return createdDocument.body.innerHTML
}
