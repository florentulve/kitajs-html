<br />

[![Issues](https://img.shields.io/github/issues/kitajs/html?logo=github&label=Issues)](https://github.com/kitajs/html/issues)
[![Stars](https://img.shields.io/github/stars/kitajs/html?logo=github&label=Stars)](https://github.com/kitajs/html/stargazers)
[![License](https://img.shields.io/github/license/kitajs/html?logo=githu&label=License)](https://github.com/kitajs/html/blob/master/LICENSE)
[![Speed Blazing](https://img.shields.io/badge/speed-blazing%20%F0%9F%94%A5-brightgreen.svg)](https://twitter.com/acdlite/status/974390255393505280)

[![Latest Version](https://img.shields.io/npm/v/@kitajs/html)](https://www.npmjs.com/package/@kitajs/html)
[![Downloads](https://img.shields.io/npm/dw/@kitajs/html)](https://www.npmjs.com/package/@kitajs/html)
[![JsDelivr](https://data.jsdelivr.com/v1/package/npm/@kitajs/html/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@kitajs/html)
[![Bundlephobia](https://img.shields.io/bundlephobia/minzip/@kitajs/html/latest?style=flat)](https://bundlephobia.com/package/@kitajs/html@latest)
[![Packagephobia](https://packagephobia.com/badge?p=@kitajs/html@latest)](https://packagephobia.com/result?p=@kitajs/html@latest)

<br />

<div align="center">
  <pre>
  <h1>🏛️<br />KitaJS HTML</h1>
  </pre>
  <br />
</div>

<h3 align="center">
  <code>KitaJS HTML</code> is a 0 dependencies, fast and concise HTML generator for JavaScript with JSX syntax.
  <br />
  <br />
</h3>

<br />

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Installing](#installing)
- [Getting Started](#getting-started)
- [Sanitization](#sanitization)
  - [The safe attribute](#the-safe-attribute)
- [Migrating from HTML](#migrating-from-html)
- [Compiling html](#compiling-html)
- [Fragments](#fragments)
- [Supported HTML](#supported-html)
  - [The `tag` tag](#the-tag-tag)
- [Async Components](#async-components)
- [Extending types](#extending-types)
- [Performance](#performance)
- [How it works](#how-it-works)
- [Format HTML output](#format-html-output)
- [Fork credits](#fork-credits)

<br />

## Installing

```sh
npm install @kitajs/html # or yarn add @kitajs/html
```

<br />

## Getting Started

Install `@kitajs/html` with your favorite package manager, import it into the top of your `jsx`/`tsx` file and change your tsconfig.json to transpile jsx syntax.

```js
// tsconfig.json

{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "html.createElement",
    "jsxFragmentFactory": "html.Fragment"
  }
}
```

```jsx
// Always remember to import html from '@kitajs/html'
import html from '@kitajs/html'

// Using as a simple html builder
console.log(<div>Hello World</div>) // '<div>Hello World</div>'

// Maybe your own server-side html frontend
function route(request, response) {
  return response
    .header('Content-Type', 'text/html')
    .send(<div>Hello World</div>)
}

// What about generating a static html file?
fs.writeFileSync(
  'index.html',
  <html>
    <head>
      <title>Hello World</title>
    </head>
    <body>
      <div>Hello World</div>
    </body>
  </html>
)

// Also as a component library
function Layout({ name, children }: html.PropsWithChildren<{ name: string }>) {
  return (
    <html>
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <div>Hello {name}</div>
        {children}
      </body>
    </html>
  )
}

console.log(<Layout name="World">I'm in the body!</Layout>)

// Anywhere you want! All JSX becomes a string
typeof (<div>Hello World</div>) === 'string'
```

This package just provides functions to transpile JSX to a HTML string, you can imagine doing something like this before, but now with type checking and intellisense:

```ts
// without @kitajs/html
const html = `<div> Hello World!<div>` ❌
```

```jsx
// with @kitajs/html
const html = <div>Hello World!<div> ✅
// Also results into a string, but with type checks.
```

<br />

## Sanitization

This package aims to be a HTML builder, **_not an HTML sanitizer_**. This means that no HTML content is escaped by default. However we provide a custom attribute called **_`safe`_** that will sanitize everything inside of it. You can also use the exported `html.escapeHtml` function to escape other contents arbitrarily.

```jsx
// Attributes are always escaped by default
<div style={'"&<>\''}></div> // <div style="&#34;&amp;&lt;&gt;&#39;"></div>
<div style={{ backgroundColor: '"&<>\'' }}></div> // <div style="background-color:&#34;&amp;&lt;&gt;&#39;;"></div>
```

```jsx
// Correct way to escape input content, you should only use when rendering user input
<div safe>{untrusted}</div> // <div>&lt;script&gt;alert(&#34;hacked!&#34;)&lt;/script&gt;</div>
```

```jsx
// Manual escaping with html.escapeHtml
<div>{'<a></a>' + html.escapeHtml('<a></a>')}</div> // <div><a></a>&lt;a&gt;&lt;/a&gt;</div>
```

```jsx
// ⚠️ unsafe input is not escaped by default
<div>{untrusted}</div> // <div><script>alert('hacked!')</script></div>
```

It's like if React's `dangerouslySetInnerHTML` was enabled by default.

<br />

### The safe attribute

You should always use the `safe` attribute when you are rendering user input. This will sanitize its contents and avoid XSS attacks.

```jsx
function UserCard({ name, description, date, about }) {
  return (
    <div class="card">
      <h1 safe>{name}</h1>
      <br />
      <p safe>{description}</p>
      <br />
      // controlled input, no need to sanitize
      <time datetime={date.toISOString()}>{date.toDateString()}</time>
      <br />
      <p safe>{about}</p>
    </div>
  )
}
```

Note that only at the very bottom of the HTML tree is where you should use the `safe` attribute, to only escape where its needed.

👉 There's an open issue to integrate this within a typescript plugin to emit warnings and alerts to use the safe attribute everywhere a variable is used. Wanna help? Check [this issue](https://github.com/kitajs/html/issues/2).

<br />

## Migrating from HTML

Migrating from plain HTML to JSX can be a pain to convert it all manually, as you will find yourself hand placing quotes and closing void elements. Luckily for us, there's a tool called [htmltojsx](https://magic.reactjs.net/htmltojsx.htm) that can help us with that.

```html
<!-- Hello world -->
<div class="awesome" style="border: 1px solid red">
  <label for="name">Enter your name: </label>
  <input type="text" id="name" />
</div>
<p>Enter your HTML here</p>
```

Generates:

```jsx
<>
  {/* Hello world */}
  <div className="awesome" style={{ border: '1px solid red' }}>
    <label htmlFor="name">Enter your name: </label>
    <input type="text" id="name" />
  </div>
  <p>Enter your HTML here</p>
</>
```

<br />

## Compiling html

When you have static html, is simple to get amazing performances, just save it to a constant and reuse it. However, if you need to hydrate the html with dynamic values in a super fast way, you can use the `compile` property to compile the html and reuse it later.

```tsx
import html from '@kitajs/html'

const compiled = html.compile<['param1', 'param2']>(
  <div>
    <div>$param1</div>
    <div>$param2</div>
    <div>$notFound</div>
  </div>,
  // or
  <MyComponent param1="$param1" param2="$param2" />
)

const html = compiled({ param1: 'Hello', param2: 'World!' })
// formatted html to make it easier to read
// <div>
//   <div>Hello</div>
//   <div>World!</div>
//   <div>$notFound</div>
// </div>
```

This makes the html generation around [**_1500_**](#performance) times faster than just using normal jsx.

Variables that were not passed to the `compile` function are ignored **silently**, this way you can reuse the result into another `compile` function or just because the your _"`$val`"_ was supposed to be a static value.

<br />

## Fragments

JSX does not allow multiple root elements, but you can use a fragment to group multiple elements:

```jsx
const html = (
  <>
    <div>1</div>
    <div>2</div>
  </>
)
```

[Learn more about JSX syntax here!](https://react.dev/learn/writing-markup-with-jsx)

<br />

## Supported HTML

All HTML elements and attributes should be supported.

- [Supported html elements](https://html.spec.whatwg.org/multipage#toc-semantics)
- [Supported html events](https://www.w3schools.com/tags/ref_eventattributes.asp)

**Missing an element or attribute?** Please create an issue or a PR to add it. It's easy to add.

<br />

### The `tag` tag

The `<tag of="">` tag is a custom internal tag that allows you to render any runtime selected tag you want. Possibly reasons to prefer this tag over extending types:

- You want to render a tag that is chosen at runtime.
- You don't want to mess up with extending globally available types.
- You are writing javascript with typechecking enabled.
- You are writing a library and should not extend types globally.
- You need to use kebab-case tags, which JSX syntax does not support.

```jsx
<tag of="asd" />
// <asd></asd>

<tag of="my-custom-KEBAB" />
// <my-custom-KEBAB></my-custom-KEBAB>
```

We do recommend using [extending types](#extending-types) instead, as it will give you intellisense and type checking.

<br />

## Async Components

Sadly, we cannot allow async components in JSX and keep the same string type for everything else. Even though it should be possible to write async components you will have no real benefit from it, as you will always have to await the whole html generation
to complete before you can render it.

You should fetch async data in the following way:

```jsx
// Fetches all async code beforehand and passes its contents to the component.
async function render(name) {
  const data = await api.data(name)
  const otherData = await api.otherData(name)

  return <Layout data={data} otherData={data} />
}
```

<br />

## Extending types

Just as exemplified above, you may also want to add custom properties to your elements. You can do this by extending the `JSX` namespace.

> ⚠️ Please follow the JSX convention and do not use `kebab-case` for your properties, use `camelCase` instead. We internally transform all `camelCase` properties to `kebab-case` to be compliant with the HTML and JSX standards.

```tsx
declare global {
  namespace JSX {
    // Adds a new element called mathPower
    interface IntrinsicElements {
      mathPower: HtmlTag & {
        // Changes properties to the math-power element
        myExponential: number
        // this property becomes the <>{children}</> type
        children: number
      }
    }

    // Adds hxBoost property to all elements native elements (those who extends HtmlTag)
    interface HtmlTag {
      hxBoost: boolean
    }
  }
}

const element = (
  <mathPower myExponential={2} hxBoost>
    {3}
  </mathPower>
)
// Becomes <math-power my-exponential="2" hx-boost>3</math-power>
```

<br />

## Performance

This package is just a string builder on steroids, as you can see [how this works](#how-it-works). However we are running a benchmark with an JSX HTML with about 10K characters to see how it performs.

You can run this yourself by running `pnpm bench`.

```java
// Apple M1 Pro 8gb

@kitajs/html:
  44 767 ops/s, ±0.17%       | 99.91% slower

@kitajs/html - compiled:
  48 124 728 ops/s, ±0.48%   | fastest

typed-html:
  19 199 ops/s, ±0.45%       | slowest, 99.96% slower
```

<br />

## How it works

This package just aims to be a drop in replacement syntax for JSX, and it works because you [tell tsc to transpile](#getting-started) JSX syntax to calls to our own `html` namespace.

```jsx
<ol start={2}>
  {[1, 2].map((i) => (
    <li>{i}</li>
  ))}
</ol>
```

Gets transpiled by tsc to plain javascript:

```js
html.createElement(
  'ol',
  { start: 2 },
  [1, 2].map((i) => html.createElement('li', null, i))
)
```

Which, when called, returns this string:

```js
'<ol start="2"><li>1</li><li>2</li></ol>'
```

<br />

## Format HTML output

This package emits HTML as a compact string, useful for over the wire environments. However, if your use case really needs the output
HTML to be pretty printed, you can use an external JS library to do so, like [html-prettify](https://www.npmjs.com/package/html-prettify).

```jsx
import html from '@kitajs/html'
import prettify from 'html-prettify'

const html = (
  <div>
    <div>1</div>
    <div>2</div>
  </div>
)

console.log(html)
// <div><div>1</div><div>2</div></div>

console.log(prettify(html))
// <div>
//   <div>1</div>
//   <div>2</div>
// </div>
```

👉 There's an open PR to implement this feature natively, wanna work on it? Check [this PR](https://github.com/kitajs/html/pull/1).

<br />

## Fork credits

This repository was initially forked from [typed-html](https://github.com/nicojs/typed-html) and modified to add some features and increase performance.

Initial credits to [nicojs](https://github.com/nicojs) and [contributors](https://github.com/nicojs/typed-html/graphs/contributors) for the amazing work.

Licensed under the [Apache License, Version 2.0](LICENSE).

<br />
