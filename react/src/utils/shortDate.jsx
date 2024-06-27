export default function shortDate(dateStr) {
  const splitStr = dateStr.split(" ");

  splitStr.pop();
  splitStr.pop();

  return splitStr.join(" ");
}
