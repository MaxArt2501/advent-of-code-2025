let position = 50;
let atZero = 0;
const movements = input.trim().split('\n').map(line => line.slice(1) * (line[0] === 'L' ? -1 : 1));
for (const movement of movements) {
  position += movement;
  // I'll be honest: this is kind of ugly. But it works!
  // Start by counting the hundreds
  atZero += Math.abs(Math.floor(position / 100))
    // We need to add one if we're at 0, -100, -200, etc.
    + (position % 100 === 0 && movement < 0)
    // But also we need to subtract one if we're starting from 0
    - (position === movement && position < 0);
  // Reset to 0-99 interval
  position = (position % 100 + 100) % 100;
}
console.log(atZero);
