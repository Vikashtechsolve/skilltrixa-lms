const TimeAgo = (dateString) => {
  if (!dateString) {
    return "";
  }
  // Handle both string and Date objects
  let date = dateString instanceof Date ? dateString : new Date(dateString);
  if (isNaN(date.getTime())) {
    const parts = dateString.replace(",", "").split(" ");
    if (parts.length === 3) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const monthIndex = monthNames.findIndex(
        (m) => m.toLowerCase() === parts[0].toLowerCase()
      );
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);

      if (monthIndex !== -1 && !isNaN(day) && !isNaN(year)) {
        date = new Date(year, monthIndex, day);
      }
    }
  }

  if (isNaN(date.getTime())) return dateString;

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `${Math.max(0, diffInSeconds)} sec ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);

  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
};

export default TimeAgo;
