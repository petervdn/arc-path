# arc-path

Draws an arc-path on a canvas, with adjustable width and equal spacing.

## install
```sh
npm install arc-path
```

## usage
The library exposes the `drawArcPath` method which can be used like so:
```javascript
import drawArcPath from 'arc-path';

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


The method draws a path for the following blue shape:

![picture](https://i.imgur.com/E3OzSGc.png)

- `drawArcPath` only draws a path, so you will need to do a `fill()` or `stroke()` call after it
- the path consists of four parts: two arcs and two straight lines, drawn clockwise and in the order as shown in the image
- the dashed black lines represent the `startRadians` and `endRadians`
- the magenta line has a length half of the `partSpacing` (and is perpendicular to the dashed line)
- the dashed line and the blue edge across are parallel, so the distance between them is half the `partSpacing` on every location (not just on the magenta line)
- the method returns an object containing the positions of all four points in the image: `outerStart`, `outerEnd`, `innerStart` and `innerEnd`

## but... why
The reason you would want to use this is to draw a full circle of several parts, all with an equal amount of `partSpacing` between them (instead of a gap that grows wider towards the outer edges)

![picture](https://i.imgur.com/iHqzT5C.png)

An interactive example can be found [here](https://petervdn.github.io/arc-path/example/).



