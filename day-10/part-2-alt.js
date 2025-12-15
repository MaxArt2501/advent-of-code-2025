const parseLine = (/** @type {string} */ line) => {
  const parts = line.split(' ');
  const state = parts[0].slice(1, -1);
  const buttons = parts
    .slice(1, -1)
    .map((values) => values.slice(1, -1).split(',').map(Number));
  const joltage = parts.at(-1).slice(1, -1).split(',').map(Number);
  return { state, buttons, joltage };
};
const machines = input.trim().split('\n').map(parseLine);

// Basically we're dealing with a linear system of equations.
// Assume a machine like this one from the text:
// [...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
// There are 5 buttons: if we call `a` the presses for the first button, `b` the
// presses for the second and so on, we get:
// a + c + d = 7
// d + e = 5
// a + b + d + e = 12
// a + b + e = 7
// a + c + e = 2
// This is a matter of solving this system of equations. There could be linearly dependent
// equations (which could be eliminated), but in the end there are at least as many
// variables as equations, leaving no or some "free" variables. We need to assign values
// to these free variables to find them all.

/**
 * Creates the system matrix starting from a machine's buttons and joltage targets.
 * @param {number[][]} buttons
 * @param {number[]} joltage
 */
const getSystem = (buttons, joltage) => joltage.map((value, index) => buttons.map(button => +button.includes(index) ? 1 : 0).concat(value));

/**
 * Reduces a given system, eventually swapping rows and columns in order to have the left
 * part of the matrix as the identity matrix.
 * @param {number[][]} system
 */
const reduceSystem = system => {
  system = system.map(line => line.slice(0));
  for (let index = 0; index < system.length; index++) {
    const equation = system[index];
    const coeffIdx = getFirstCoefficientIndex(equation);
    if (coeffIdx === -1) {
      system.splice(index, 1);
      index--;
      continue;
    }
    const coefficient = equation[coeffIdx];
    if (coefficient !== 1) {
      system[index] = equation.map(entry => entry && entry / coefficient);
    }
    system.forEach(({[coeffIdx]: factor}, otherIdx) => {
      if (otherIdx === index || factor === 0) return;
      system[otherIdx] = system[otherIdx].map((entry, idx) => entry - factor * system[index][idx]);
    });
  };
  for (let index = 0; index < system.length; index++) {
    const eqIdx = getEquationIndex(system, index);
    const coefficientIdx = getFirstCoefficientIndex(system[eqIdx]);
    [system[index], system[eqIdx]] = [system[eqIdx], system[index]];
    if (coefficientIdx > index) {
      system.forEach((equation, idx) => {
        [equation[coefficientIdx], equation[index]] = [equation[index], equation[coefficientIdx]];
      });
    }
  }
  return system;
};

/**
 * Returns the index of the equation with the first non-zero coefficient equals to the given one, or
 * the closest greater index.
 * @param {number[][]} system
 * @param {number} index
 */
const getEquationIndex = (system, index) => {
  const coefficientIndexes = system.map(getFirstCoefficientIndex);
  for (; index < system[0].length - 1; index++) {
    const eqIdx = coefficientIndexes.indexOf(index);
    if (eqIdx >= 0) return eqIdx;
  }
  return -1;
};

/**
 * Returns the index of the first non-zero coefficient.
 * @param {number[]} equation
 */
const getFirstCoefficientIndex = equation => equation.findIndex(Boolean);

/**
 * @param {[number, number][]} boundaries
 * @returns {Generator<number[]>}
 */
function* tuples([[minimum, maximum], ...rest]) {
  if (rest.length > 0) {
    for (let value = minimum; value <= maximum; value++) {
      for (const restValues of tuples(rest)) {
        yield [value, ...restValues];
      }
    }
  } else {
    for (let value = minimum; value <= maximum; value++) yield [value];
  }
}

/**
 * Tells if a value is integer regardless of its rounding errors. 1e-8 is an arbitrary epsilon.
 * @param {number} value
 */
const isInteger = value => Math.abs(value - Math.round(value)) < 1e-8;

/**
 * @param {number[][]} system
 */
const solveSystem = system => {
  // Rough estimate for the maximum amount of button presses
  const maxPresses = Math.max(...system.map(equation => equation.at(-1)));
  system = reduceSystem(system);
  const equations = system.length;
  const vars = system[0].length - 1;
  const freeVars = vars - equations;
  if (equations === vars) {
    const values = Array(equations).fill(0);
    for (const equation of system) {
      const varIdx = equation.indexOf(1);
      values[varIdx] = equation.at(-1);
    }
    return values.reduce((sum, value) => sum + value);
  }

  // Minimum and maximum of button presses for each of the "free" buttons
  const boundaries = Array.from({ length: freeVars }, () => [0, maxPresses]);
  // Optimization: improve the boundaries above with information from the system
  // We could improve further if the first non-zero coefficient of the equation isn't reduced to 1
  // (e.g. keep [2, 0, 3, 7] instead of [1, 0, 1.5, 3.5]) and use it to increment the amount, but...
  // it's fast enough already.
  for (const equation of system) {
    for (let index = 0; index < freeVars; index++) {
      const coefficient = equation[equations + index];
      if (!coefficient) continue;
      // We can only deduce some improvements only if the coefficient of other variables is positive or zero
      const allNonNegative = equation.every((coeff, idx) => coeff >= 0 || idx === equations + index || idx >= vars);
      if (!allNonNegative) continue;
      // If the coefficient is negative, we can get an estimate for the minimum; otherwise for the maximum
      if (coefficient < 0) boundaries[index][0] = Math.max(boundaries[index][0], Math.ceil(equation.at(-1) / coefficient));
      else boundaries[index][1] = Math.min(boundaries[index][1], Math.floor(equation.at(-1) / coefficient));
    }
  }

  let minimum = Infinity;
  for (const tuple of tuples(boundaries)) {
    const values = Array(equations).fill(0);
    // Substitute the values for the free vars and infer the values for all the variables
    for (const equation of system) {
      const value = equation.at(-1) - tuple.reduce((sum, val, idx) => sum + equation[equations + idx] * val, 0);
      const varIdx = equation.indexOf(1);
      values[varIdx] = value;
    }
    // Every value must be a non-negative integer
    if (values.every(value => isInteger(value) && Math.round(value) >= 0)) {
      minimum = Math.min(minimum, [...values, ...tuple].reduce((sum, value) => sum + Math.round(value), 0));
    }
  }
  return minimum;
};

console.log(machines.reduce((total, { buttons, joltage }) => total + solveSystem(getSystem(buttons, joltage)), 0));
