const getRemovableRolls = (field) => {
  const rolls = field.matchAll(/@/g);
  const width = field.indexOf('\n');
  return Array.from(rolls, ({ index }) => index).filter((index) => {
    // We count the '@' in the cells around by concatenating them in a string that
    // we're going to split by '@'
    const around =
      // We must avoid dealing with negative indexes in the first row, because they'd give part of the *last* row
      (index < width ? '' : field.slice(index - width - 2, index - width + 1)) +
      // Out of bound indexes yield undefined, so meh
      field[index - 1] +
      field[index + 1] +
      field.slice(index + width, index + width + 3);
    // The rolls must be less than 4, so the split parts must be less than 5
    return around.split('@').length < 5;
  });
};

console.log(getRemovableRolls(input).length);

const removeAllRolls = (field, rollIndexes) => rollIndexes.reduce((fld, index) => fld.slice(0, index) + '.' + fld.slice(index + 1), field);

const countAllRemovableRolls = (field) => {
  let rollIndexes;
  let count = 0;
  while ((rollIndexes = getRemovableRolls(field)).length) {
    count += rollIndexes.length;
    field = removeAllRolls(field, rollIndexes);
  }
  return count;
};

console.log(countAllRemovableRolls(input));
