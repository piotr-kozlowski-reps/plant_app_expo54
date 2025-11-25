export const getIsPossibleToProcess_After13_guard = (): boolean => {
  const currentHour = new Date(Date.now()).getHours();
  return currentHour > 12 ? false : true;
};
