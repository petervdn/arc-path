# arc-path

Draws an arc-path on a canvas, with adjustable width and equal spacing on the sides.

## install
```sh
npm install arc-path
```

## usage
The library exposes the `drawArcPath` method that accepts a `CanvasRenderingContext2D` and some parameters about the arc. It only draws a path, so you need to do a `fill()` or `stroke()` call after that.
```javascript
import drawArcPath from 'draw-arc';

drawArcPath(
  context,
  centerX,
  centerY,
  startRadians,
  endRadians,
  outerRadius,
  innerRadius,
  partSpacing,
 );

context.fill();
```

The drawing will be done in such a way that the spacing between multiple arcs all have a consistent width. An example (drawing multiple arcs too fill up a full circle) can be found [here](https://petervdn.github.io/arc-path/example/). 

![picture](https://i.imgur.com/thnaYDQ.png)

## return data
The `drawArcPath` method returns an object containing info about the shape that was drawn. It has the start/end radians for both the inner and outer curve, and the position of every cornerpoint, which may come in handy if you need to calculate bounding boxes.

![picture](https://i.imgur.com/l4RJQkU.png)

The naming for these 4 points (`topLeft`, `topRight`, `bottomLeft`, `bottomRight`) are in relation to an arc-part that is on the topside of the circle.
