var fs = require('fs')

var workerScriptSrc =
    fs.readFileSync(__dirname + '/Animated_GIF.worker.min.js', { encoding: 'utf8' })

var workerScriptBlob = new Blob([ workerScriptSrc ], { type: 'text/javascript' })

var AnimatedGif = require('animated_gif/src/Animated_GIF.js')
  , toBlob = require('data-uri-to-blob')

module.exports = function(imgSrc, duration, numFrames, isHorizontal, cb) {
  var frameDuration = duration / numFrames
    , recordingElem = document.createElement('img')
    , uriData = getSrcUri(imgSrc)
    , workerScriptUri = window.URL.createObjectURL(workerScriptBlob)
    , gifCreator = new AnimatedGif({ workerPath: workerScriptUri })
    , canvas = document.createElement('canvas')
    , context = canvas.getContext('2d')

  gifCreator.setDelay(frameDuration * 1000)
  recordingElem.addEventListener('error', function(err) {
    cleanup()
    cb(err)
  })

  recordingElem.addEventListener('load', function() {
    try {
      var width = recordingElem.width
        , height = recordingElem.height
      canvas.width = width
      canvas.height = height
      context.drawImage(recordingElem, 0, 0)

      var frameWidth = isHorizontal ? (width / numFrames) : width
        , frameHeight = isHorizontal ? height : (height / numFrames)
        , xInc = isHorizontal ? frameWidth : 0
        , yInc = isHorizontal ? 0 : frameHeight
      gifCreator.setSize(frameWidth, frameHeight)
      for (var i = 0; i < numFrames; i++) {
        var sx = i * xInc
          , sy = i * yInc
        gifCreator.addFrameImageData(context.getImageData(sx, sy, frameWidth, frameHeight))
      }

      gifCreator.getBlobGIF(function(image) {
        cleanup()
        cb(null, image)
      })
    } catch (err) {
      cleanup()
      cb(err)
    }
  })

  function cleanup() {
    window.URL.revokeObjectURL(workerScriptUri)
    uriData.cleanup()
    gifCreator.destroy()
    delete recordingElem.src
  }

  recordingElem.src = uriData.uri
}

function getSrcUri(videoElemSrc) {
  if (/^data:/.test(videoElemSrc)) {
    // Work around Firefox not considering data URI's "origin-clean" (meaning we can't draw from the
    // data URI video to our canvas and still be able to call getImageData). Object URIs count as
    // origin-clean correctly, however, so we construct one of those
    var srcBlob = toBlob(videoElemSrc)
      , srcUri = window.URL.createObjectURL(srcBlob)
    return {
      uri: srcUri,
      cleanup: function() {
        window.URL.revokeObjectURL(srcUri)
      }
    }
  }

  return { uri: videoElemSrc, cleanup: function() {} }
}
