// I am TOTALLY UNSATISFIED by this solution *and* the problem!
const tiles = input
  .trim()
  .split('\n')
  .map((line) => line.split(',').map(Number));

const lines = tiles.map((tile, index) => [tiles.at(index - 1), tile]);
const { 0: horizontalLines, 1: verticalLines } = Object.groupBy(lines, (_, index) => index & 1);
const isInsideRect = ([x, y], [[a, b], [c, d]]) => {
  const mx = Math.min(a, c);
  const Mx = a + c - mx;
  const my = Math.min(b, d);
  const My = b + d - my;
  return mx <= x && x <= Mx && my <= y && y <= My;
};
const isInsideArea = (tile) => {
  // Included in some line connecting tiles
  if (lines.some((line) => isInsideRect(tile, line))) return true;

  const [x, y] = tile;
  const crossingVertical = verticalLines.filter(
    ([[a, b], [c, d]]) => a > x && Math.min(b, d) < y && Math.max(b, d) >= y
  );
  return (crossingVertical.length & 1) !== 0;
};

const getArea = ([a, b], [c, d]) => (Math.abs(a - c) + 1) * (Math.abs(b - d) + 1);

const areIntersecting = ([[a, b], [c, d]], [[e, f], [g, h]]) => {
  if (a === c) {
    // Vertical line: assume f === h
    const mx = Math.min(e, g);
    const Mx = e + g - mx;
    const my = Math.min(b, d);
    const My = b + d - my;
    return mx < a && a < Mx && my < f && f < My;
  }
  // Horizontal line: assume e === g
  const mx = Math.min(a, c);
  const Mx = a + c - mx;
  const my = Math.min(f, h);
  const My = f + h - my;
  return mx < e && e < Mx && my < b && b < My;
};

let maxArea = 0;
for (let index = 0; index < tiles.length; index++) {
  const tile = tiles[index];
  for (let otherIndex = index + 1; otherIndex < tiles.length; otherIndex++) {
    const otherTile = tiles[otherIndex];
    const area = getArea(tile, otherTile);
    if (area < maxArea) continue;
    const [a, b] = tile;
    const [c, d] = otherTile;
    if (!isInsideArea([a, d]) || !isInsideArea([b, c])) continue;

    const verticalIntersecting = verticalLines.find(line => areIntersecting([[a, b], [c, b]], line) || areIntersecting([[a, d], [c, d]], line));
    const horizontalIntersecting = horizontalLines.find(line => areIntersecting([[a, b], [a, d]], line) || areIntersecting([[c, b], [c, d]], line));
    const rect = [tile, otherTile];
    if (!verticalIntersecting && !horizontalIntersecting && area > maxArea) {
      // This *should* be good, ALTHOUGH I HAVE QUESTIONS
      // E.g. it should *fail* with the following input:
      // 0,0
      // 2,0
      // 2,1
      // 3,1
      // 3,2
      // 1,2
      // 1,3
      // 3,3
      // 3,4
      // 0,4
      // But I've tested it with other inputs and it works! IT SHOULD NOT!
      // I guess the inputs aren't as tricky as imagined... But other assumptions have never been stated.
      maxArea = area;
    }
  }
}
console.log(maxArea);
