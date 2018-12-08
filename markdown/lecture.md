title: Lecture.js

---
::: class: title

# Lecture.js

A themeable, markdown based, slideshow tool.

---

# What is Lecture.js

Markdown-driven slideshow tools have some big advantages over traditional slideshow tools like PowerPoint, Keynote, Google Slides and LibreOffice Impress. They can be edited using a simple **text editor** in any platform, they can be **manipulated** programmatically and they are version-control **friendly**. 

LaTeX-based slideshow tools also exist, but the LaTeX syntax gets in the way of writing far too often.

Lecture.js is a web-based, markdown-driven, slideshow tool that was created due to frustration when trying to theme current markdown-to-web slideshow tools.

---

# Installation

Installing **Lecture.js** is pretty straightforward if you have *git* and *npm* already installed:

```bash
git clone git@github.com:arestivo/lecture.js.git
cd lecture.js
npm install
npm run less
ts-node src/lecture.ts markdown/lecture.md --theme plain
```