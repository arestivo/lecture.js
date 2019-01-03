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

  const firstSlide = <HTMLElement> document.querySelector('article.slide')
  const paddingTop = parseInt(getStyle(firstSlide, 'padding-top'))
  const paddingRight = parseInt(getStyle(firstSlide, 'padding-right'))
  const paddingBottom = parseInt(getStyle(firstSlide, 'padding-bottom'))
  const paddingLeft = parseInt(getStyle(firstSlide, 'padding-left'))

  root.style.setProperty('--slide-width', `${browserWidth - paddingLeft - paddingRight}px`)
  root.style.setProperty('--slide-height', `${browserHeight - paddingTop - paddingBottom}px`)

  setTimeout(resizeSlideContent, 100)
}

function resizeSlideContent() {
  //TODO: Find a better way to resize slides. Maybe start by resizing only images!

  const number = +window.location.hash.slice(1)

  const resizer = <HTMLElement> document.querySelector(`article[id='${number}'] .resizer`)
  if (resizer == null) return

  const content = <HTMLElement> document.querySelector(`article[id='${number}'] .content`)
  if (content == null) return

  content.style.removeProperty('--scale')
  resizer.style.overflow = 'auto'

  if (resizer.clientHeight < content.clientHeight) {
    const scale = resizer.clientHeight / content.clientHeight

    content.style.setProperty('--scale', scale.toString())
  }

  resizer.style.overflow = null
}

function handleKeyPress(e : KeyboardEvent) {
  const key = e.code || e.key
  switch (key) {
    case 'ArrowDown':
    case 'ArrowRight':
    case 'Space' || ' ':
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
  resizeSlideContent()
}

function createHeaders() {
  const slides = document.querySelectorAll('article.slide')
  slides.forEach(slide => {
    const header = slide.querySelector('header')
    const first = slide.querySelector('.content :first-child')
    if (header !== null && first !== null)
      header.append(first)
  })
}

let fixDimensions = fixSlideDimensions.bind(window, 4 / 3)
fixDimensions()

window.addEventListener('load', fixDimensions)
window.addEventListener('resize', fixDimensions)
window.addEventListener('orientationchange', fixDimensions)

document.addEventListener('click', handleClick)
document.addEventListener('keydown', handleKeyPress)

document.addEventListener('wheel', handleWheel, false)

window.addEventListener('load', createHeaders)

window.addEventListener('load', fixSlideNumber)