export function createSeededRng(seed: number) {
  let value = seed % 2147483647; // 2 power 31 - 1

  if (value <= 0) value += 2147483646;

  return function random() {
    value = (value * 16807) % 2147483647; // 2147483647 => 2 power 31 - 1
    return (value - 1) / 2147483646; // 2147483646 => 2 power 31 - 2
  };
}