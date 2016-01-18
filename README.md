# postsvg-rename-id

[PostSVG](https://github.com/kisenka/postsvg) plugin to rename `id` attribute and it's references.

Rename following references:

- `xlink:href="#id"`
- `style` attribute values like `style="fill:url(#id)"`
- any other attribute value like `attr="url(#id)"`

## Installation

```
$ npm install postsvg-rename-id
```

## Usage

```js
var fs = require('fs');
var postsvg = require('postsvg');
var renameId = require('postsvg-rename-id');

var input = fs.readFileSync('input.svg', 'utf8');
var result = postsvg()
  .use(renameId({pattern: 'TRALALA_[id]'}))
  .process(input);

console.log(result.toString());
```

Using this `input.svg`

```xml
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

```xml
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

### Standalone usage

```js
var renameId = require('postsvg-rename-id');
var result = renameId({pattern: 'TRALALA_[id]'}).process('<svg id="test" />');
console.log(result.toString());
```

## Configuration

### `pattern (string|Function)`

Renaming pattern. Following placeholders can be used:
- `[id]` - id attribute value.
- `[document-id]` - current document uid.

If `pattern` provided as a function it will be called with processing options.
In this way it must returns a string (placeholders can be used as well):

```js
postsvg()
  .use(renameId({pattern: function(options) {
    return options.filename + '_[id]'
  }}))
  .process('<svg id="test"/>', {filename: 'a.svg'})
```

## Tests

```
npm test
```