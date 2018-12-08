function getStyle(element, style) {
  return window.getComputedStyle(element, null).getPropertyValue(style)
}

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
    let paddingTop = parseInt(getStyle(slide, 'padding-top'))
    let paddingRight = parseInt(getStyle(slide, 'padding-right'))
    let paddingBottom = parseInt(getStyle(slide, 'padding-bottom'))
    let paddingLeft = parseInt(getStyle(slide, 'padding-left'))

    slide.style.width = (browserWidth - paddingLeft - paddingRight) + 'px'
    slide.style.height = (browserHeight - paddingTop - paddingBottom) + 'px'
  }
}

function handleKeyPress(e) {
  switch (e.key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case ' ':
      nextSlide()
      break
    case 'ArrowUp':
    case 'ArrowLeft':
      previousSlide()
      break
  }
}

function handleClick(e) {
  if (e.clientX < window.innerWidth / 2) previousSlide()
  else nextSlide()
}

function getCurrentSlide(slides) {
  for (let i = 0, slide; slide = slides[i]; i++)
    if (getStyle(slide, 'display') != 'none')
      return i
}

function nextSlide(e) {
  const number = +window.location.hash.slice(1)
  if (document.querySelector(`article[id='${number + 1}']`))
    window.location.hash = number + 1
}

function previousSlide(e) {
  const number = +window.location.hash.slice(1)
  if (number > 1)
    window.location.hash =  number - 1
}

function fixSlideNumber() {
  const number = +window.location.hash.slice(1)
  if (!document.querySelector(`article[id='${number}']`))
    window.location.hash = 1
}

let fixDimensions = fixSlideDimensions.bind(window, 4/3)

window.addEventListener('load', fixDimensions)
window.addEventListener('resize', fixDimensions)

document.addEventListener('click', handleClick)
document.addEventListener('keypress', handleKeyPress)

fixSlideNumber()