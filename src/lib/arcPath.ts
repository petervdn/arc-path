/**
 * Draws a path consisting of 4 parts
 * @param {CanvasRenderingContext2D} context
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} startRadians
 * @param {number} endRadians
 * @param {number} outerRadius in pixels
 * @param {number} innerRadius in pixels
 * @param {number} partSpacing in pixels
 * @returns {IArcData}
 */
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
  // part 1: CW outer arc
  context.arc(centerX, centerY, outerRadius, arcData.startRadiansOuter, arcData.endRadiansOuter);

  // part 2: line to inner
  context.lineTo(arcData.innerStart.x, arcData.innerStart.y);

  // part 3: CCW inner arc
  context.arc(
    centerX,
    centerY,
    innerRadius,
    arcData.endRadiansInner,
    arcData.startRadiansInner,
    true,
  );

  // part 4 line back to start (outer)
  context.lineTo(arcData.outerStart.x, arcData.outerStart.y);

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
  const halfOuterSpacingAngle = 0.5 * partSpacing / outerRadius;
  const halfInnerSpacingAngle = 0.5 * partSpacing / innerRadius;
  const startRadiansOuter = startRadians + halfOuterSpacingAngle;
  const endRadiansOuter = endRadians - halfOuterSpacingAngle;
  const startRadiansInner = startRadians + halfInnerSpacingAngle;
  const endRadiansInner = endRadians - halfInnerSpacingAngle;

  const outerStart = getPositionOnCircle(centerX, centerY, startRadiansOuter, outerRadius);
  const outerEnd = getPositionOnCircle(centerX, centerY, endRadiansOuter, outerRadius);
  const innerStart = getPositionOnCircle(centerX, centerY, endRadiansInner, innerRadius);
  const innerEnd = getPositionOnCircle(centerX, centerY, startRadiansInner, innerRadius);

  return {
    outerStart,
    outerEnd,
    innerStart,
    innerEnd,
    startRadiansOuter,
    endRadiansOuter,
    startRadiansInner,
    endRadiansInner,
  };
}

/**
 * Returns the position for a point on a circle.
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} radians
 * @param {number} radius
 * @returns {IPoint}
 */
function getPositionOnCircle(
  centerX: number,
  centerY: number,
  radians: number,
  radius: number,
): IPoint {
  return {
    x: centerX + Math.cos(radians) * radius,
    y: centerY + Math.sin(radians) * radius,
  };
}

export interface IPoint {
  x: number;
  y: number;
}

export interface IArcData {
  outerStart: IPoint;
  outerEnd: IPoint;
  innerEnd: IPoint;
  innerStart: IPoint;
  startRadiansOuter: number;
  endRadiansOuter: number;
  startRadiansInner: number;
  endRadiansInner: number;
}
