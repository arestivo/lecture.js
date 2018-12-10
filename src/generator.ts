#!/usr/bin/env node

import program from 'commander'
import mustache from 'mustache'
import fs from 'fs'
import yaml from 'js-yaml'

import MarkdownIt from 'markdown-it'

import minifyCSS from 'clean-css'
import minifyJS from 'babel-minify'

import rmdir from 'rimraf'
import ncp from 'ncp'

interface Slide {
  frontmatter : string
  markdown : string
  html? : string
}

const markdownIt = new MarkdownIt()

program
  .version('0.0.1')
  .arguments('<markdown>')
  .option('-o, --output <dir>', 'Output directory', 'output')
  .option('-a, --assets <dir>', 'Assets directory')
  .option('-t, --theme <name>', 'Theme name', 'default')
  .parse(process.argv)

program.parse(process.argv)

const input = program.args[0]
const output = program.output
const theme = program.theme
const assets = program.assets

if (input === undefined) {
  console.error('No markdown file specified!')
  process.exit(1)
}

if (!fs.existsSync(input)) {
  console.error('Markdown file not found!')
  process.exit(1)
}

if (!fs.existsSync(`themes/${theme}`)) {
  console.error('Theme not found!')
  process.exit(1)
}

if (assets !== undefined && !fs.existsSync(`${assets}`)) {
  console.error('Assets not found!')
  process.exit(1)
}

build(input, output, theme, assets)

/**
 * Builds a slide set from the contents of a markdown file.
 * @param input Path to markdown file.
 * @param output Path to output directory.
 */
function build(input: string, output: string, theme: string, assets: string) {
  const name = input.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '')
  const contents = fs.readFileSync(input, 'utf8')

  const parts = [...split(contents)]
  const [frontmatter, ...unparsed] = parts
  const slides = unparsed.map(parse).map(markdown)

  render(slides, frontmatter, output, name)

  copyTheme(theme, output)
  if (assets !== undefined)
    copyAssets(assets, output, name)
}

/**
 * Parse a single slide into frontmatter and markdown.
 * @param slide The slide to parse
 */
function parse(slide: string) : Slide {
  const lines = slide.split('\n')
  let frontmatter = ''
  let markdown = ''
  for (const line of lines) {
    if (line.startsWith(':::'))
      frontmatter += `${line.slice(3)}\n`
    else
      markdown += `${line}\n`
  }
  return { markdown, frontmatter: yaml.load(frontmatter) || {}, html: undefined }
}

/**
 * Renders a slide markdown and stores in the slide.
 * @param slide The slide to render.
 */
function markdown(slide: Slide) {
  slide.html = markdownIt.render(slide.markdown)
  return slide
}

/**
 * Renders an array of slide into HTML.
 * @param slides The slides to render.
 * @param output The output file.
 */
function render(slides: Slide[], frontmatter: string, output: string, name: string) {
  const header = readFile('templates/header.mustache')
  const footer = readFile('templates/footer.mustache')
  const content = readFile('templates/slide.mustache')

  let contents = ''
  contents += mustache.render(header, {
    theme,
    show: yaml.load(frontmatter),
    'lecture-css': new minifyCSS({}).minify(readFile('templates/lecture.css')).styles,
    'lecture-script': minifyJS(readFile('templates/lecture.js'), {}, {}).code
  })

  let num = 1
  for (const slide of slides) {
    contents += mustache.render(content, {
      num, total: slides.length,
      show: yaml.load(frontmatter),
      slide: slide.frontmatter,
      html: slide.html
    })
    num += 1
  }

  contents += mustache.render(footer, {
    show: yaml.load(frontmatter),
  })

  if (!fs.existsSync(output)) fs.mkdirSync(output)
  fs.writeFileSync(`${output}/${name}.html`, contents)
}

/**
 * Copies a theme to the output directory
 * @param theme The name of the theme to copy.
 * @param output Output directory
 */
function copyTheme(theme : string, output : string) {
  if (!fs.existsSync(output)) fs.mkdirSync(output)
  if (!fs.existsSync(`${output}/themes`)) fs.mkdirSync(`${output}/themes`)
  if (fs.existsSync(`${output}/themes/${theme}`))
    rmdir.sync(`${output}/themes/${theme}`)

  ncp.ncp(`themes/${theme}`, `${output}/themes/${theme}`, _ => {})
}

function copyAssets(assets: string, output: string, name: string) {
  if (!fs.existsSync(output)) fs.mkdirSync(output)
  if (!fs.existsSync(`${output}/assets`)) fs.mkdirSync(`${output}/assets`)
  if (fs.existsSync(`${output}/assets/${name}`))
    rmdir.sync(`${output}/assets/${name}`)

  ncp.ncp(`${assets}`, `${output}/assets/${name}`, _ => {})
}

/**
 * Generator that returns the frontmatter and each slide as an array.
 * @param contents The contents as read from the markdown file.
 */
function* split(contents: string) {
  const lines = contents.split('\n')
  let part = ''

  for (const line of lines) {
    if (line.startsWith('---')) {
      yield part
      part = ''
    } else part += `${line}\n`
  }
  yield(part)
}

function readFile(path: string) {
  return fs.readFileSync(path, 'utf8')
}
