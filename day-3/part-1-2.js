const getLargestJoltage = (block, count) => {
  let max = Math.max(...block); // Yes, we can spread strings. Yes, max works on numeric strings too
  // If we're looking for just one battery, we return it
  if (count < 2) return String(max);
  // Otherwise we attach other (count - 1) batteries found with the same criteria
  while (max > 0) {
    // Look for the first occurrence of the max value
    const index = block.indexOf(String(max));
    // We have to check if there are enough batteries left in the block
    if (index >= 0 && index <= block.length - count) {
      return max + getLargestJoltage(block.slice(index + 1), count - 1);
    }
    // If there aren't, we try with the digit immediately below
    max--;
  }
};

const blocks = input.trim().split('\n');

const getTotalJoltage = (count) => blocks
  .map(block => getLargestJoltage(block, count))
  .reduce((sum, joltage) => sum + Number(joltage), 0);

console.log(getTotalJoltage(2));
console.log(getTotalJoltage(12));
