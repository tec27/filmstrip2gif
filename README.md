#filmstrip2gif
Convert a filmstrip image to an animated GIF in the browser.

[![NPM](https://nodei.co/npm/filmstrip2gif.png)](https://www.npmjs.org/package/filmstrip2gif)

## Usage
`filmstrip2gif` is designed to be used with browserify. To use it, include it in a browserified module:
```javascript
var filmstrip2gif = require('filmstrip2gif')
var NUM_FRAMES = 10
  , DURATION_SECONDS = 1

filmstrip2gif(document.querySelector('img.film').src, DURATION, NUM_FRAMES, false,
    function(err, gifBlob) {
  if (err) {
    alert('oh no!: ' + err)
    return
  }

  var img = document.createElement('img')
  img.src = window.URL.createObjectURL(gifBlob)
  docuument.body.appendChild(img)
})
```

## API
`var filmstrip2gif = require('filmstrip2gif')`

<b><code>filmstrip2gif(imgUrl, duration, numFrames, isHorizontal, cb)</code></b>

Convert an image located at imgUrl (with known total duration `duration` and number of
frames `numFrames`, assumed to be evenly distributed) to an animated GIF, calling `cb` when done.
`cb` is a `function(err, gifBlob)`. If `isHorizontal` is true, the filmstrip will be sliced
into `numFrames` pieces horizontally, vertically otherwise.

## Installation
`npm install filmstrip2gif`

## License
MIT
