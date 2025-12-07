const width = input.indexOf('\n');
// Now we have to count in how many ways a beam can reach a certain cell
let nextFrontier = new Map([[input.indexOf('S'), 1]]);
let frontier;
do {
  frontier = nextFrontier;
  nextFrontier = new Map();
  for (const [index, count] of frontier) {
    const nextCell = input[index + width + 1];
    if (nextCell === '.') {
      // The next cell could have already been reached by a previously split beam, so we take
      // its count (if any) and add the current one
      nextFrontier.set(index + width + 1, (nextFrontier.get(index + width + 1) ?? 0) + count);
    } else if (nextCell === '^') {
      nextFrontier.set(index + width, (nextFrontier.get(index + width) ?? 0) + count);
      nextFrontier.set(index + width + 2, (nextFrontier.get(index + width + 2) ?? 0) + count);
    }
  }
} while (nextFrontier.size > 0);
console.log(Array.from(frontier.values()).reduce((sum, count) => sum + count));
