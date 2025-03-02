export let CURRENT_DATE = new Date(); // Default is today

export const setCurrentDate = (date: string | Date) => {
  CURRENT_DATE = new Date(date);
};
