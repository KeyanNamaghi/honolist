import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { html } from 'hono/html'
import { getCookie, setCookie } from 'hono/cookie'
import { serveStatic } from 'hono/bun'

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
        <meta name="view-transition" content="same-origin" />
        <title>Hono + htmx</title>
        <link rel="stylesheet" href="/static/page.css" />
      </head>
      <body>
        <div class="p-4">${children}</div>
      </body>
    </html>
  `
})

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))

app.get('*', renderer)

app.get('/', (c) => {
  const key = getCookie(c, 'key')

  return c.render(
    <div>
      <div class='items'>
        <a class='item item-1' href='./item?id=1'>
          <img src='/static/1.jpg' alt='' />
        </a>
        <a class='item item-2' href='./item?id=2'>
          <img src='/static/2.jpg' alt='' />
        </a>
        <a class='item item-3' href='./item?id=3'>
          <img src='/static/3.jpg' alt='' />
        </a>
      </div>
    </div>
  )
})

app.get('/item/*', (c) => {
  const key = getCookie(c, 'key')

  const id = c.req.query('id') ?? 1

  const copy = {
    1: "Hey there, pals! I'm Rocky Rascal, the coolest raccoon in town. Whether I'm scaling trees or rummaging through garbage cans, adventure is my middle name!",
    2: "Howdy, y'all! I'm Bandit Bongo, the country raccoon with a heart as big as the open fields. Life's a hoedown, and I'm always ready to dance!",
    3: "Greetings! I'm Luna Larceny, the nocturnal queen of mischief. When the moon rises, so does my mischievous spirit!"
  }[id]

  return c.render(
    <div class='item-card'>
      <img class={`item item-${id} item-large`} src={`/static/${id}.jpg`} alt='' />
      <div class='card-contents'>
        <small style='view-transition-name: all-items-link'>
          <a href='./'>&lt; All items</a>
        </small>
        <h1 style='view-transition-name: title'>Item name</h1>
        <p style='view-transition-name: desc'>{copy}</p>
      </div>
    </div>
  )
})

app.post('/clicked', (c) => {
  setCookie(c, 'key', 'value')
  return c.render(<div>Clicked!</div>)
})

export default app
