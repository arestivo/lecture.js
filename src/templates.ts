export const header = `
<!DOCTYPE html>
<html>
  <head>
    <title>PHP</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="lecture.css">
    <link rel="stylesheet" href="theme.css">
    <script src="lecture.js" defer></script>
  </head>
  <body>
`
export const footer = `
  </body>
</html>
`
export const content = `
<article id="{{num}}" class="slide {{frontmatter.class}}">
  <section class="content">
    {{{html}}}
  </section>
  <footer>
    <span class="left">PHP</span>
    <span class="center">André Restivo</span>
    <span class="right">{{num}}/2</span>
  </footer>
</article>
`
