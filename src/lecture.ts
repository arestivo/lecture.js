#!/usr/bin/env node

import program from 'commander'
import mustache from 'mustache'
import MarkdownIt from 'markdown-it'
import fs from 'fs'
import yaml from 'js-yaml'

const minifyJS = require('babel-minify')
const minifyCSS = require('clean-css');

interface Slide {
  frontmatter : string
  markdown : string
  html? : string
}

program
  .version('0.0.1')
  .arguments('<markdown>')
  .option('-o, --output <dir>', 'Output directory', 'output')
  .option('-t, --theme <name>', 'Theme name', 'plain')
  .parse(process.argv)

program.parse(process.argv)

const input = program.args[0]
const output = program.output
const theme = program.theme

if (input === undefined) {
  console.error('no markdown file specified!')
  process.exit(1)
}

build(input, output, theme)

/**
 * Builds a slide set from the contents of a markdown file.
 * @param input Path to markdown file.
 * @param output Path to output directory.
 */
function build(input: string, output: string, theme: string) {
  const name = input.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '')
  const contents = fs.readFileSync(input, 'utf8')

  const parts = [...split(contents)]
  const [frontmatter, ...unparsed] = parts
  const slides = unparsed.map(parse).map(markdown)

  render(slides, `${output}/${name}.html`, theme, frontmatter)
}

/**
 * Renders an array of slide into HTML.
 * @param slides The slides to render.
 * @param output The output file.
 */
function render(slides: Slide[], output: string, theme: string, frontmatter: string) {
  const header = readFile('templates/header.mustache')
  const footer = readFile('templates/footer.mustache')
  const content = readFile('templates/slide.mustache')

  let contents = ''
  contents += mustache.render(header, {
    theme,
    show: yaml.load(frontmatter),
    css: new minifyCSS({}).minify(readFile('templates/lecture.css')).styles,
    script: minifyJS(readFile('templates/lecture.js')).code
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

  fs.writeFileSync(output, contents)
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
  const parser = new MarkdownIt()
  slide.html = parser.render(slide.markdown)
  return slide
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
