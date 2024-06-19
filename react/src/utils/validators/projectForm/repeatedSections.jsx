//Helper to make sure no sections were repeated in the right hand of new project form
export default function repeatedSections(childrenState) {
  //Track sections in a set for comparison
  const seen = new Set();

  childrenState.forEach((child) => {
    seen.add(child.section);
  });

  //Lengths should be same if no duplicates
  if (seen.size !== childrenState.length) {
    return ["Duplicate section submitted!"];
  }

  return false;
}
