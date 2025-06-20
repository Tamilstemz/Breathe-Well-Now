export const isSlotExpired = (slotTimeStr: string, slotDateStr: string): boolean => {
  const now = new Date();
  // console.log('slots--oooo',slotDateStr,'-----',slotTimeStr);
  
  // Extract start time
  const [startTimeStr] = slotTimeStr.split(" to ");
  const [time, period] = startTimeStr.trim().split(" ");
  const [hoursStr, minutesStr] = time.split(":");

  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  // Parse slot date (e.g., "2025-06-18" or "06/18/2025")
  const slotDate = new Date(slotDateStr);
  const slotStartTime = new Date(
    slotDate.getFullYear(),
    slotDate.getMonth(),
    slotDate.getDate(),
    hours,
    minutes
  );

  // Subtract 5 minutes from the slot time
  slotStartTime.setMinutes(slotStartTime.getMinutes() - 5);

  return now >= slotStartTime;
};
