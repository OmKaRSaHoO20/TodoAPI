export const calculateStartAndEndDate = () => {
  const today = new Date();
  const endDate = new Date();

  endDate.setDate(today.getDate() + 30);

  const startDateISO = today.toISOString().split("T")[0];
  const endDateISO = endDate.toISOString().split("T")[0];

  return { startDate: startDateISO, endDate: endDateISO };
};
