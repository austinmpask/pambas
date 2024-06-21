import validator from "validator";

//Make sure that only numbers were inputted for the section #s and control #s
export default function sectionNumberNumeric(childrenState) {
  return childrenState.every((child) => {
    return (
      validator.isNumeric(child.section) && validator.isNumeric(child.controls)
    );
  });
}
