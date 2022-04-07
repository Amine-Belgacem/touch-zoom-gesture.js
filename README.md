# Touch-zoom-gesture.js
.js class enabling basic pan, pinch and double-tap zoom gestures on DOM elements. Touch-zoom-gesture requires `jquery` and `hammer.js` which provides core functions for finger gestures.

## Get started
Clone repository.

    git clone https://github.com/Amine-Belkacem/Touch-zoom-gesture.js.git
Explore the example in `./demo`

## Methods Reference

 - `scaleFactor(factor)`
       Sets the scale factor.
 - `add(functions, callback)`
       Adds gesture event listeners specified by functions array and runs callback.
 - `resetScale()`
       Resets element zoom to intial scale.
