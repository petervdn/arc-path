import drawArcPath, { getPositionOnCircle, IPoint } from '../../src';

const canvas = <HTMLCanvasElement>document.querySelector('canvas');

const ctx = canvas.getContext('2d');
const settings = {
  innerRadius: { value: 120, min: 10, max: 150 },
  outerRadius: { value: 200, min: 160, max: 300 },
  numberOfParts: { value: 6, min: 1, max: 20, isInt: true },
  spacing: { value: 40, min: 0, max: 100 },
  rotateOffset: { value: 0, min: 0, max: 1 },
  showPoints: false,
  drawFirstOnly: false,
  showSpacing: false,
  showDrawOrder: false,
};

// const drawOnePart = true; // used for taking screenshot for readme

Object.keys(settings).forEach(key => {
  const wrap = document.createElement('div');
  const label = document.createElement('label');
  label.style.display = 'block';
  label.style.fontSize = '10px';
  label.innerText = key;
  const input = document.createElement('input');
  if (typeof settings[key] === 'boolean') {
    input.type = 'checkbox';

    // listen to change
    input.addEventListener('change', () => {
      settings[key] = input.checked;
      draw();
    });
  } else {
    input.type = 'range';

    // listen to change
    input.addEventListener('input', () => {
      const setting = settings[key];
      let value = setting.min + parseInt(input.value, 10) / 100 * (setting.max - setting.min);

      if (setting.isInt) {
        value = Math.round(value);
      }

      setting.value = value;
      draw();
    });
  }

  wrap.appendChild(label);
  wrap.appendChild(input);

  document.getElementById('controls').appendChild(wrap);
});

const draw = () => {
  if (settings.showSpacing) {
    drawParts('white', true, true, true);
    drawParts('deepskyblue', false, false, false);
  } else {
    drawParts();
  }
};

const drawParts = (color = 'deepskyblue', noSpacing = false, clear = true, skipPoints = false) => {
  if (clear) {
    ctx.fillStyle = '#DDD';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  const center = {
    x: canvas.width * 0.5,
    y: canvas.height * 0.5,
  };
  const radiansPerPart = Math.PI * 2 / settings.numberOfParts.value;
  for (let i = 0; i < settings.numberOfParts.value; i++) {
    if (settings.drawFirstOnly && i !== 0) {
      continue;
    }
    const offset = settings.rotateOffset.value * Math.PI * 2;
    const startRadians = i * radiansPerPart + offset;
    const endRadians = startRadians + radiansPerPart;
    const arcData = drawArcPath(
      ctx,
      center.x,
      center.y,
      startRadians,
      endRadians,
      settings.outerRadius.value,
      settings.innerRadius.value,
      noSpacing ? 0 : settings.spacing.value,
    );

    ctx.globalAlpha = 0.6;
    ctx.fillStyle = color;
    ctx.fill();

    ctx.globalAlpha = 1;
    if (settings.showPoints && !skipPoints) {
      drawArcPoints(ctx, arcData);
    }

    if (settings.showSpacing) {
      const dash = [5,5];
      const color = 'black';

      const startPoints = getInnerOuterPoints(
        center,
        settings.outerRadius.value,
        settings.innerRadius.value,
        startRadians,
      );
      const endPoints = getInnerOuterPoints(
        center,
        settings.outerRadius.value,
        settings.innerRadius.value,
        endRadians,
      );

      drawDottedLine(ctx, startPoints.inner, startPoints.outer, dash, color);
      const halfStart = getHalfWay(startPoints.inner, startPoints.outer);
      const perpendicularSpacingPointStart:IPoint = {
        x: halfStart.x + (Math.cos(startRadians + Math.PI * 0.5) * settings.spacing.value * 0.5),
        y: halfStart.y + (Math.sin(startRadians + Math.PI * 0.5) * settings.spacing.value * 0.5),
      };

      drawDottedLine(ctx, halfStart, perpendicularSpacingPointStart, [], 'magenta', 2);


      // when drawing 1 part, also draw the line for the end
      if (settings.drawFirstOnly) {
        drawDottedLine(ctx, endPoints.inner, endPoints.outer, dash, color);

        const halfEnd = getHalfWay(endPoints.inner, endPoints.outer);
        const perpendicularSpacingPointEnd:IPoint = {
          x: halfEnd.x + (Math.cos(endRadians - Math.PI * 0.5) * settings.spacing.value * 0.5),
          y: halfEnd.y + (Math.sin(endRadians - Math.PI * 0.5) * settings.spacing.value * 0.5),
        };
        // drawPoint(ctx, perpendicularSpacingPointEnd.x, perpendicularSpacingPointEnd.y, 'yellow', 5);
        drawDottedLine(ctx, halfEnd, perpendicularSpacingPointEnd, [], 'magenta', 2);
      }
    }
  }
};

function getInnerOuterPoints(
  center: IPoint,
  outer: number,
  inner: number,
  radians: number,
): {outer:IPoint; inner: IPoint} {

  return {
    outer: getPositionOnCircle(center.x, center.y, radians, outer),
    inner: getPositionOnCircle(center.x, center.y, radians, inner),
  }
}

function drawDottedLine(context:CanvasRenderingContext2D, point1:IPoint, point2: IPoint, lineDash:number[], color:string, lineWidth = 1): void {
  context.beginPath();
  context.moveTo(point1.x, point1.y);
  context.lineTo(point2.x, point2.y);
  context.setLineDash(lineDash);
  context.strokeStyle = color;
  context.lineWidth = lineWidth;
  context.stroke();
  context.closePath();
  context.setLineDash([]);
}

const orderedProps = ['outerStart', 'outerEnd', 'innerStart', 'innerEnd'];
function drawArcPoints(context: CanvasRenderingContext2D, arcData: any): void {
  Object.keys(arcData).forEach(key => {
    if (typeof arcData[key] !== 'object') {
      // only draw points
      return;
    }

    const label = settings.showDrawOrder ? `${key} (${orderedProps.indexOf(key) + 1})` : key;
    drawPoint(context, arcData[key].x, arcData[key].y, 'red');
    context.font = '9px monospace';
    context.fillStyle = 'black';
    const space = 5;
    context.fillText(label, arcData[key].x + space, arcData[key].y - space);
  });
}

function drawPoint(context, x: number, y: number, color = 'black', radius: number = 3): void {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

function getHalfWay(point1: IPoint, point2: IPoint): IPoint {
  return {
    x: point1.x + 0.5 * (point2.x - point1.x),
    y: point1.y + 0.5 * (point2.y - point1.y),
  }
}

draw();
