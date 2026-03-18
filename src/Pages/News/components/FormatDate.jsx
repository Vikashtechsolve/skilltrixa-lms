const FormatDate = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);

  // Check for invalid date
  if (isNaN(date.getTime())) {
    return isoString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short", // "Oct"
    day: "numeric", // "25"
    year: "numeric", // "2025"
  });
};

export default FormatDate;
