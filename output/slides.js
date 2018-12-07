function fixSlideDimensions(ratio) {
  let browserWidth = document.body.clientWidth
  let browserHeight = document.body.clientHeight

  if (browserWidth / browserHeight < ratio)
    browserHeight = browserWidth / ratio
  else
    browserWidth = browserHeight * ratio

  let root = document.querySelector(":root");
  root.style.fontSize = browserWidth / 80 + 'px'

  let slides = document.querySelectorAll('article.slide')
  for (let i = 0, slide; slide = slides[i]; i++) {
    let paddingTop = parseInt(window.getComputedStyle(slide, null).getPropertyValue('padding-top'))
    let paddingRight = parseInt(window.getComputedStyle(slide, null).getPropertyValue('padding-right'))
    let paddingBottom = parseInt(window.getComputedStyle(slide, null).getPropertyValue('padding-bottom'))
    let paddingLeft = parseInt(window.getComputedStyle(slide, null).getPropertyValue('padding-left'))

    slide.style.width = (browserWidth - paddingLeft - paddingRight) + 'px'
    slide.style.height = (browserHeight - paddingTop - paddingBottom) + 'px'
  }
}

let fixDimensions = fixSlideDimensions.bind(window, 4/3)

window.addEventListener('load', fixDimensions)
window.addEventListener('resize', fixDimensions)