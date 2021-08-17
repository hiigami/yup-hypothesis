export function isPositiveByMin(min?: number): boolean {
  return min !== undefined && min >= 0;
}

export function isNegativeByMax(max?: number): boolean {
  return max !== undefined && max <= 0;
}
