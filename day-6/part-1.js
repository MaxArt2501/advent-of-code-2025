const lines = input.split('\n');
const problemIndexes = Array.from(lines.at(-1).matchAll(/\S/g), ({ index }) => index);
const problems = problemIndexes.map((index, arrayIndex) => ({
  operator: lines.at(-1)[index],
  // Trick: if the second argument of .slice is undefined it returns the string to then end
  values: lines.slice(0, -1).map(line => line.slice(index, problemIndexes[arrayIndex + 1]))
}));
// I know that "`eval` is evil", but whatever, it's Advent of Code, not security critical code
console.log(problems.reduce((total, { operator, values }) => total + eval(values.join(operator)), 0));
