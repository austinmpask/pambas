// "Wed, 13 Nov 2024 02:18:55 GMT",

//Make date the format: 13 Nov
export default function xsDate(date) {
  // Remove weekday
  const trimmed = date.substring(5);

  //Split up the rest and remove the timestamp and year
  const splitDate = trimmed.split(" ");

  //Rejoin and return
  return splitDate.slice(0, 2).join(" ").trim();
}
