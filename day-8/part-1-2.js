const junctionBoxes = input
  .trim()
  .split('\n')
  .map((line) => line.split(',').map(Number));
const LIMIT = 1000;

/**
 * @param {[number, number, number]} coords1
 * @param {[number, number, number]} coords2
 */
const getDistance = (coords1, coords2) =>
  // We don't need to get the square root of the distance, since the square root is a
  // monotone function (i.e. a < b => sqrt(a) < sqrt(b))
  coords1.reduce((sum, coord, index) => sum + (coord - coords2[index]) ** 2, 0);

// Mapping distances to the relative box index pairs
const distanceMap = new Map(
  junctionBoxes.flatMap((box, index) =>
    junctionBoxes
      .slice(index + 1)
      .map((otherBox, otherIndex) => [
        getDistance(box, otherBox),
        [index, otherIndex + index + 1],
      ])
  )
);
// Sorting the distances
const shortestDistances = Array.from(distanceMap.keys()).sort((a, b) => a - b);

/**
 * Circuits will be sets of box *indexes*
 * @type {Set<number>[]}
 */
const circuits = [];
const joinCircuits = distanceIndex => {
  const pair = distanceMap.get(distanceIndex);
  const [circuitIdx1, circuitIdx2] = pair.map(boxIndex => circuits.findIndex(circuit => circuit.has(boxIndex)));
  if (circuitIdx1 >= 0) {
    // There's a circuit containing the first box. If it's the same of the second box, we're out
    if (circuitIdx1 === circuitIdx2) return;
    if (circuitIdx2 >= 0) {
      // There's a (different) circuit containing the second box too: we join them together
      circuits[circuitIdx1] = circuits[circuitIdx1].union(circuits[circuitIdx2]);
      // and remove the other one
      circuits.splice(circuitIdx2, 1);
    } else if (circuitIdx2 < 0) {
      // Otherwise we add the second box index to the circuit
      circuits[circuitIdx1].add(pair[1]);
    }
  } else if (circuitIdx2 >= 0) {
    // There's only a circuit containing the second box: we add the first box index to it
    circuits[circuitIdx2].add(pair[0]);
  } else {
    // There are no circuits containing any of the box in the pair: we create a new one with them
    circuits.push(new Set(pair));
  }
};

for (let index = 0; index < shortestDistances.length; index++) {
  const distanceIndex = shortestDistances[index];
  joinCircuits(distanceIndex);

  // Part One
  if (index === LIMIT - 1) {
    const largetsCircuits = circuits.toSorted((c1, c2) => c2.size - c1.size);
    console.log(largetsCircuits.slice(0, 3).reduce((product, { size }) => product * size, 1));
  }

  // Part Two
  if (circuits[0].size === junctionBoxes.length) {
    const [x1, x2] = distanceMap.get(distanceIndex).map(index => junctionBoxes[index][0]);
    console.log(x1 * x2);
    break;
  }
}
