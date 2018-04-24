# arc-path

Draws an arc-path on a canvas, with adjustable width and equal spacing.

## install
```sh
npm install arc-path
```

## usage
The library exposes the `drawArcPath` method which can be used like so:
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


The method draws a path for the following blue shape:

![picture](https://i.imgur.com/E3OzSGc.png)

- `drawArcPath` only draws a path, so you will need to do a `fill()` or `stroke()` call after it
- the path consists of four parts: two arcs and two straight lines, drawn clockwise and in the order as shown in the image
- the dashed black lines represent the `startRadians` and `endRadians`
- the length of the magenta line is half of the `partSpacing`
- the magenta line is perpendicular to the dashed line
- the method returns an object containing the positions of all four points in the image: `outerStart`, `outerEnd`, 'innerStart' and 'innerEnd'

## why
While the above may sound complicated, the reason you would use this is to draw a full circle of several parts, all with an equal and straight `partSpacing` between them.

![picture](https://i.imgur.com/iHqzT5C.png)

An interactive example can be found [here](https://petervdn.github.io/arc-path/example/).



