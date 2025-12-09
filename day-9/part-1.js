const tiles = input.trim().split('\n').map((line) => line.split(',').map(Number));
const getArea = ([a, b], [c, d]) => (Math.abs(a - c) + 1) * (Math.abs(b - d) + 1);
console.log(Math.max(...tiles.flatMap((tile, index) => tiles.slice(index + 1).map(otherTile => getArea(tile, otherTile)))));
