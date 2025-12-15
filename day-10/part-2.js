const parseLine = (/** @type {string} */ line) => {
  const parts = line.split(' ');
  const state = parts[0].slice(1, -1);
  const buttons = parts
    .slice(1, -1)
    .map((values) => values.slice(1, -1).split(',').map(Number))
    // Sorting because with "longer" buttons we need to press less times, so we try with them first
    .sort((list1, list2) => list2.length - list1.length);
  const joltage = parts.at(-1).slice(1, -1).split(',').map(Number);
  return { state, buttons, joltage };
};
const machines = input.trim().split('\n').map(parseLine);

/**
 * @param {number[]} button
 * @param {number[]} joltage
 */
const getMaximumButtonPresses = (button, joltage) => Math.min(...button.map(index => joltage[index]));

/**
 * @param {number[]} button
 * @param {number[]} joltage
 * @param {number} presses
 */
const pressButton = (button, joltage, presses) => {
  const state = joltage.slice();
  button.forEach(index => (state[index] -= presses));
  return state;
};

/**
 * THIS WORKS but it is TOO SLOW. I'll come back with a faster solution later. I have some ideas...
 * Edit: see part-2-alt.js
 * @param {number[][]} buttons
 * @param {number[]} joltage
 * @return {number}
 */
const getFewestPressesForJoltage = (buttons, joltage) => {
  const [button, ...otherBtns] = buttons;
  let minimum = Infinity;
  for (let presses = getMaximumButtonPresses(button, joltage); presses >= 0; presses--) {
    const state = pressButton(button, joltage, presses);
    if (otherBtns.length) {
      const total = presses + getFewestPressesForJoltage(otherBtns, state);
      if (total < minimum) minimum = total;
    } else if (!state.some(Boolean)) {
      return presses;
    }
  }
  return minimum;
};

console.log(machines.reduce((total, machine) => total + getFewestPressesForJoltage(machine.buttons, machine.joltage), 0));
