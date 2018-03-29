export default function drawArcPath(
  context: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  startRadians: number,
  endRadians: number,
  outerRadius: number,
  innerRadius: number,
  partSpacing: number,
): IArcData {
  if (outerRadius <= 0 || innerRadius <= 0) {
    throw new Error('Radius can not be negative');
  }
  if (outerRadius <= innerRadius) {
    throw new Error('Outer radius can not be smaller than, or equal to, inner');
  }

  const arcData = getArcData(
    centerX,
    centerY,
    startRadians,
    endRadians,
    outerRadius,
    innerRadius,
    partSpacing,
  );

  context.beginPath();
  context.arc(centerX, centerY, outerRadius, arcData.startRadiansOuter, arcData.endRadiansOuter);

  context.lineTo(
    centerX + Math.cos(arcData.endRadiansInner) * innerRadius,
    centerY + Math.sin(arcData.endRadiansInner) * innerRadius,
  );

  context.arc(
    centerX,
    centerY,
    innerRadius,
    arcData.endRadiansInner,
    arcData.startRadiansInner,
    true,
  );

  context.lineTo(
    centerX + Math.cos(arcData.startRadiansOuter) * outerRadius,
    centerY + Math.sin(arcData.startRadiansOuter) * outerRadius,
  );
  context.closePath();

  return arcData;
}

export function getArcData(
  centerX: number,
  centerY: number,
  startRadians: number,
  endRadians: number,
  outerRadius: number,
  innerRadius: number,
  partSpacing: number,
): IArcData {
  const halfOuterSpacingAngle = 0.5 * getRadiansForLength(partSpacing, outerRadius);
  const halfInnerSpacingAngle = 0.5 * getRadiansForLength(partSpacing, innerRadius);
  const startRadiansOuter = startRadians + halfOuterSpacingAngle;
  const endRadiansOuter = endRadians - halfOuterSpacingAngle;
  const startRadiansInner = startRadians + halfInnerSpacingAngle;
  const endRadiansInner = endRadians - halfInnerSpacingAngle;

  const tl: IPoint = {
    x: centerX + Math.cos(startRadiansOuter) * outerRadius,
    y: centerY + Math.sin(startRadiansOuter) * outerRadius,
  };
  const tr: IPoint = {
    x: centerX + Math.cos(endRadiansOuter) * outerRadius,
    y: centerY + Math.sin(endRadiansOuter) * outerRadius,
  };
  const br: IPoint = {
    x: centerX + Math.cos(endRadiansInner) * innerRadius,
    y: centerY + Math.sin(endRadiansInner) * innerRadius,
  };
  const bl: IPoint = {
    x: centerX + Math.cos(startRadiansInner) * innerRadius,
    y: centerY + Math.sin(startRadiansInner) * innerRadius,
  };

  return {
    tl,
    tr,
    br,
    bl,
    startRadiansOuter,
    endRadiansOuter,
    startRadiansInner,
    endRadiansInner,
  };
}

interface IPoint {
  x: number;
  y: number;
}

/**
 * Returns the radians for a certain length.
 * @param {number} length
 * @param {number} radius
 * @returns {number}
 */
function getRadiansForLength(length: number, radius: number): number {
  // todo get rid of this
  return length / radius;
}
interface IArcData {
  tl: IPoint;
  tr: IPoint;
  br: IPoint;
  bl: IPoint;
  startRadiansOuter: number;
  endRadiansOuter: number;
  startRadiansInner: number;
  endRadiansInner: number;
}
