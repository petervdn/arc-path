import drawArcPath from '../../src';

const canvas = <HTMLCanvasElement>document.querySelector('canvas');

const ctx = canvas.getContext('2d');
const settings = {
  innerRadius: { value: 120, min: 10, max: 150 },
  outerRadius: { value: 200, min: 160, max: 300 },
  numberOfParts: { value: 6, min: 1, max: 20, isInt: true },
  spacing: { value: 40, min: 0, max: 100 },
  showPoints: false,
};

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

      if(setting.isInt) {
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
  ctx.fillStyle = '#DDD';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const radiansPerPart = Math.PI * 2 / settings.numberOfParts.value
  for (let i = 0; i < settings.numberOfParts.value; i++) {
    const startRadians = i * radiansPerPart;
    const endRadians = startRadians + radiansPerPart;
    const arcData = drawArcPath(
      ctx,
      canvas.width * 0.5,
      canvas.height * 0.5,
      startRadians,
      endRadians,
      settings.outerRadius.value,
      settings.innerRadius.value,
      settings.spacing.value,
    );

    ctx.globalAlpha = 0.6;
    ctx.fillStyle = 'deepskyblue';
    ctx.fill();

    ctx.globalAlpha = 1;
    if (settings.showPoints) {
      drawArcPoints(ctx, arcData);
    }
  }
};

function drawArcPoints(
  context: CanvasRenderingContext2D,
  arcData: any
): void {
  Object.keys(arcData).forEach(key => {
    if (typeof arcData[key] !== 'object') {
      // only draw points
      return;
    }
    drawPoint(context, arcData[key].x, arcData[key].y, "red");
    context.font = "9px monospace";
    context.fillStyle = "black";
    const space = 5;
    context.fillText(key, arcData[key].x + space, arcData[key].y - space);
  });
}

function drawPoint(
  context,
  x: number,
  y: number,
  color = "black",
  radius: number = 3
): void {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
}

draw();
