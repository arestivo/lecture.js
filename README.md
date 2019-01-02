# lecture.js

A themeable, markdown based, slideshow tool.

Still in its early stages. Lots of functionalities are missing so use at your own risk.

## Setup

```bash
git clone git@github.com:arestivo/lecture.js.git
cd lecture.js
npm install
npm run build
```

## Usage

```bash
ts-node src/backend/generator.ts markdown/lecture.md
```

This will generate a *lecture.html* file inside the *output* folder containing your presentation.

By default, *Lecture.js* uses the *default* theme (duh). If you want to use a different theme just use the *--theme* parameter. If you want to create the presentation in a different folder, use the *output* parameter. 

```bash
ts-node src/backend/generator.ts markdown/lecture.md --theme plain --output html
```

## Themes

Currently only two themes exist: plain and default

## Demo

A demo can be found [here](https://arestivo.github.io/lecture.js/).