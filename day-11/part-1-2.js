// Using maps instead of objects is probably overkill but... I've started with maps
// fearing performance problems, and it stuck there
const devices = new Map(
  input.trim().split('\n').concat('out').map(line => {
    const [device, ...outputs] = line.split(/\W+/);
    return [device, outputs];
  })
);

const countPaths = (start, end) => {
  // Cache that maps devices to the number of paths to the end device
  const visited = new Map();
  // I would have preferred an iterative approach with the usual breadth-first search,
  // but somehow it didn't work for part 2. So recursive it is...
  const walkPath = device => {
    if (visited.has(device)) return visited.get(device);
    let count = 0;
    for (const output of devices.get(device)) {
      if (output === end) count++;
      else count += walkPath(output, end);
    }
    visited.set(device, count);
    return count;
  };
  return walkPath(start);
};

console.log(countPaths('you', 'out'));

console.log(
  // Suppose 'fft' comes before 'dac'. In order to know the number of valid paths, we compute
  // the number of paths between 'svr' and 'fft', then from 'fft' to 'dac', then from 'dac' to
  // 'out', and multiply these values.
  // But we don't know whether 'dac' or 'fft' comes first. However, if 'dac' comes first, then
  // `countPaths('fft', 'dac')` is 0, and if 'fft' comes first then `countPaths('dac', 'fft')`
  // is 0, so the respective terms cancel out.
  countPaths('svr', 'fft') * countPaths('fft', 'dac') * countPaths('dac', 'out') +
  countPaths('svr', 'dac') * countPaths('dac', 'fft') * countPaths('fft', 'out')
);
