export function random(): number {
  return Math.random();
}

export function randomIntInclusive(high: number, low = 0): number {
  return Math.floor(Math.random() * (high - low + 1) + low);
}
