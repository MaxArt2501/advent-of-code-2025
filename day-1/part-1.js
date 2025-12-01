let position = 50;
let atZero = 0;
const movements = input.trim().split('\n').map(line => line.slice(1) * (line[0] === 'L' ? -1 : 1));
for (const movement of movements) {
  position = ((position + movement) % 100 + 100) % 100;
  if (position === 0) atZero++;
}
console.log(atZero);
