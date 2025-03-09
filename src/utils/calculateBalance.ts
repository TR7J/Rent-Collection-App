export const calculateBalance = (
  earnings: number,
  deposits: number,
  expenses: number,
  utilities: number
): number => {
  return (
    [earnings, deposits].reduce((sum, value) => sum + value, 0) -
    [expenses, utilities].reduce((sum, value) => sum + value, 0)
  );
};
