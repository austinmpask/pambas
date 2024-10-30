//Remove anything that is 0/NaN, be it section # or amount of controls

export default function projectTrim(data) {
  return data.filter((sectionRow) => !sectionRow.some((number) => !number));
}
