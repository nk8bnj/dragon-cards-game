export function waitAsync(time: number): Promise<null> {
  return new Promise(res => setTimeout(() => res(null), time));
}

export function normalizeBetSize(value: number, minBet: number, maxBet: number): number {
  const normalizedValue = value < minBet ? minBet : value > maxBet ? maxBet : value;
  return Math.floor(normalizedValue * 100) / 100;
}

