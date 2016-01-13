# postsvg-prefixize

[PostSVG](https://github.com/kisenka/postsvg) plugin to add prefix to `id` attributes.

Properly converts:

- `xlink:href="#id"`
- `style` attribute values like `style="fill:url(#id)"`
- any other attribute value like `attr="url(#id)"`

## Installation

```
$ npm install postsvg-prefixize
```

## Usage

```js
var fs = require('fs');
var postsvg = require('postsvg');
var prefixize = require('./');

var input = fs.readFileSync('input.svg', 'utf8');
var output = postsvg()
  .use(prefixize({prefix: 'TRALALA_'}))
  .process(input)
  .toString();

console.log(output);
```

Using this `input.svg`

```svg
<svg id="test-svg" width="100" height="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <linearGradient id="gradient">
            <stop offset="5%" stop-color="green"/>
            <stop offset="95%" stop-color="gold"/>
        </linearGradient>

        <circle id="circle" fill="url(#gradient)" style="fill:url(#gradient)" cx="50" cy="50" r="50"/>
    </defs>
    <use xlink:href="#circle"/>
</svg>
```

you will get:

```svg
<svg id="TRALALA_test-svg" width="100" height="100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <linearGradient id="TRALALA_gradient">
            <stop offset="5%" stop-color="green"/>
            <stop offset="95%" stop-color="gold"/>
        </linearGradient>

        <circle id="TRALALA_circle" fill="url(#TRALALA_gradient)" style="fill:url(#TRALALA_gradient)" cx="50" cy="50" r="50"/>
    </defs>
    <use xlink:href="#TRALALA_circle"/>
</svg>
```

Checkout [test](test/prefixize.test.js#L8) for examples.

### Standalone usage

```js
var prefixize = require('postsvg-prefixize');
var result = prefixize({prefix: 'TRALALA_'}).process('<svg id="test" />');
console.log(result.toString());
```

## Run tests

```
npm test
```