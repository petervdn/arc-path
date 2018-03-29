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

## return data
The `drawArcPath` method returns an object containing info about the shape that was drawn.
