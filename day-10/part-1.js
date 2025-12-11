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

const applyButton = (state, button) => {
  button.forEach(index => {
    state = state.slice(0, index) + (state[index] === '.' ? '#' : '.') + state.slice(index + 1);
  });
  return state;
};

const getFewestButtonPresses = ({ state, buttons }) => {
  let count = 1;
  let frontier = new Set(['.'.repeat(state.length)]);
  const visited = new Set(frontier);
  while (frontier.size) {
    const newFrontier = new Set();
    for (const currentState of frontier)
      for (const button of buttons) {
        const newState = applyButton(currentState, button);
        if (newState === state) return count;
        if (!visited.has(newState)) {
          newFrontier.add(newState);
          visited.add(newState);
        }
      }
    frontier = newFrontier;
    count++;
  }
  return -1;
};

console.log(machines.reduce((total, machine) => total + getFewestButtonPresses(machine), 0));
