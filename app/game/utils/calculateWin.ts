export const calculateWin = (
  finalMatches: number[],
  multipliers: number[],
  bet: number,
): number => {
  const isLost = finalMatches.some((cardIndex) => multipliers[cardIndex] === 0);

  if (isLost) {
    return 0;
  }

  const wonMultiplier = finalMatches.reduce(
    (total, cardIndex) => (total += multipliers[cardIndex]),
    0,
  );

  return bet * wonMultiplier;
};
