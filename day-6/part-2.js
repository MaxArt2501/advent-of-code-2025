const lines = input.split('\n');
const problemIndexes = Array.from(lines.at(-1).matchAll(/\S/g), ({ index }) => index);
const problems = problemIndexes.map((index, arrayIndex) => {
  // Removing the last space or it'd generate an value of only spaces
  const numbers = lines.slice(0, -1).map(line => line.slice(index, problemIndexes[arrayIndex + 1]).replace(/ $/, ''));
  return ({
    operator: lines.at(-1)[index],
    values: Array.from(numbers[0], (_, idx) => numbers.map(number => number[idx]).join(''))
  });
});

console.log(problems.reduce((total, { operator, values }) => total + eval(values.join(operator)), 0));
