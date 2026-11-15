// Date and Time Helper locked to Asia/Kolkata (IST)

const getTodayIST = () => {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return istFormatter.format(now); // Returns YYYY-MM-DD
};

const getCurrentTimeIST = () => {
  const now = new Date();
  const istFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return istFormatter.format(now); // Returns HH:mm
};

const isPastGracePeriod = (scheduledDate, scheduledTime, graceMinutes = 30) => {
  // Parse scheduled date and time in IST
  const [year, month, day] = scheduledDate.split('-').map(Number);
  const [hour, minute] = scheduledTime.split(':').map(Number);

  // Scheduled date in IST
  const scheduledTimestamp = Date.UTC(year, month - 1, day, hour, minute) - (5.5 * 60 * 60 * 1000);
  const nowTimestamp = Date.now();
  const gracePeriodMs = graceMinutes * 60 * 1000;

  return nowTimestamp > (scheduledTimestamp + gracePeriodMs);
};

module.exports = {
  getTodayIST,
  getCurrentTimeIST,
  isPastGracePeriod,
};
