title: Lecture.js
author: André Restivo

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
npm run build
```

This will clone the *Lecture.js* repository from *github*, install all needed dependencies and build the system.

---

# Usage

To use *Lecture.js*, create a markdown file anywhere (e.g. *markdown/lecture.md*) and run the following command:

```bash
ts-node src/generator.ts markdown/lecture.md
```

This will generate a *lecture.html* file inside the *output* folder containing your presentation.

By default, *Lecture.js* uses the *default* theme (duh). If you want to use a different theme just use the *--theme* parameter. If you want to create the presentation in a different folder, use the *output* parameter. 

```bash
ts-node src/lecture.ts markdown/lecture.md --theme plain --output html
```

At the moment there are only two different themes, *plain* and *default*, but more will be added shortly.

---

# Markdown

Inside the *markdown* file, slides are separated by 3 dashes. Anything before the first set of dashes is considered *frontmatter* (YAML). Inside each slide you can also add YAML attributes by prefixing lines with 3 colons:

```bash
 title: Lecture.js     # this is not a slide
 author: André Restivo
 ---

 ::: class: title # this is not content
 # Presentation Title

 ---

 # Slide 2
```

At this moment, the only frontmatter that can be applied is: *title* and *author*, to the global show frontmatter, and *class*, to the slide frontmatter.

---

# Features

  * If you have a slide with lots of content
  * I mean, a really long slide
  * Like those you're not supposed to do
  * But do anyway
  * Because you don't know better
  * And you really have a lot of points to make
  * Like, really a lot
  * And it doesn't seem to stop
  * Ever
  * Eventually...
  * ... you will get out of space
  * But *Lecture.js* will take care of that for you
  * So you can go on in your merry life
  * Without worrying
  * And just keep doing giant slides