const trees = input.slice(input.lastIndexOf('\n\n') + 2).trim().split('\n').map(line => {
  const [width, height, ...presents] = line.split(/\D+/).map(Number);
  return { width, height, presents };
});

// Every present can be fit in a 3x3 square. The input is so that we don't need to
// get crazy by combining the presents, although the text hints that way. Tree areas
// that can't contain all the presents will just be *way* too small for the amount
// of presents. We don't even need to map the presents...
console.log(trees.filter(({ width, height, presents }) =>
  Math.floor(width / 3) * Math.floor(height / 3) >= presents.reduce((sum, count) => sum + count)
).length);
