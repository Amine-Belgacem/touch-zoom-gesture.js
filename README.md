# Touch-zoom-gesture.js
.Js class enabling basic pan, pinch and double-tap gestures on DOM elements. Touch-zoom-gesture requires jQuery and hammer.js which provides basic functionalities for finger gestures.

## Get started
Clone repository.

    git clone https://github.com/Amine-Belkacem/Quote-canvas.js.git
Explore the example in `./demo`

## Methods Reference

 - `drawBG(color)`
       Fills the background with a color of type color.
 - `drawRect(color, position, size, fixed)`
       Draws a filled rectangle at position with size.
 - `drawBGImage(path, callback)`
       Draws a background image specified by the path parameter and calls a callback.
 - `drawImage(path, style, position, size, callback, fixed)`
       Draws an image with style, position and size then call a callback.
 - `drawText(str, style, position, width, fixed)`
       Draws a string with style, position and width.
 - `move(elmentId, position)`
       Moves and element specified by elementId to a position then updates and redraws.
  - `update(elmentId, update)`
       Updates the element object specified by elementId.
  - `erase(elmentId)`
       Erasees the element object specified by elementId then redraws.   
  - `redraw()`
       Redraws all elements of the canvas.  
  - `getActiveElement()`
       Returns the element under focus.
  - `getActiveElementId()`
       Returns the id if the element under focus.       
  - `getAllElements()`
       Returns all drawn elements. 
  - `isElement(element)`
       Type check for element object. 
  - `isStyle(style)`
       Type check for style object.    
  - `isDimension(dimension)`
       Check if dimension is integer and > 0
  - `isColor(color)`
       Check if color is in hex format (e.g. #ffffff)
  - `isSize(size)`
       Type check for size object.
  - `isPath(path)`
       Checks if path is a valid image path.
  - `isPosition(position)`
       Type check for position object.
  - `isPosition(position)`
       Type check for position object.
  - `isWidth(width)`
       Checks if width is not null, defined and natural.
  - More reference coming soon...
