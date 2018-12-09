function getStyle(element : Element, style : string) {
  return window.getComputedStyle(element, null).getPropertyValue(style)
}

function fixSlideDimensions(ratio : number) {
  let browserWidth = document.body.clientWidth
  let browserHeight = document.body.clientHeight

  if (browserWidth / browserHeight < ratio)
    browserHeight = browserWidth / ratio
  else
    browserWidth = browserHeight * ratio

  const root = <HTMLElement>document.querySelector(':root')
  root.style.fontSize = `${browserWidth / 80}px`

  const slides = <NodeListOf<HTMLElement>> document.querySelectorAll('article.slide')
  for (let i = 0, slide; slide = slides[i]; i += 1) {
    const paddingTop = parseInt(getStyle(slide, 'padding-top'))
    const paddingRight = parseInt(getStyle(slide, 'padding-right'))
    const paddingBottom = parseInt(getStyle(slide, 'padding-bottom'))
    const paddingLeft = parseInt(getStyle(slide, 'padding-left'))

    slide.style.width = `${browserWidth - paddingLeft - paddingRight}px`
    slide.style.height = `${browserHeight - paddingTop - paddingBottom}px`
  }
}

function handleKeyPress(e : KeyboardEvent) {
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

function handleWheel(e : WheelEvent) {
  if (e.deltaY < 0) previousSlide()
  if (e.deltaY > 0) nextSlide()
}

function handleClick(e : MouseEvent) {
  if (e.button === 0) {
    if (e.clientX < window.innerWidth / 2) previousSlide()
    else nextSlide()
  }
}

function nextSlide() {
  const number = +window.location.hash.slice(1)
  if (document.querySelector(`article[id='${number + 1}']`))
    changeHash(`#${number + 1}`)
}

function previousSlide() {
  const number = +window.location.hash.slice(1)
  if (number > 1)
    changeHash(`#${number - 1}`)
}

function fixSlideNumber() {
  const number = +window.location.hash.slice(1)
  if (!document.querySelector(`article[id='${number}']`))
    changeHash('#1')
}

function changeHash(hash : string) {
  location.replace(hash)
}

let fixDimensions = fixSlideDimensions.bind(window, 4 / 3)

window.addEventListener('load', fixDimensions)
window.addEventListener('resize', fixDimensions)
window.addEventListener('orientationchange', fixDimensions)

document.addEventListener('click', handleClick)
document.addEventListener('keypress', handleKeyPress)

document.addEventListener('wheel', handleWheel, false)

fixSlideNumber()
