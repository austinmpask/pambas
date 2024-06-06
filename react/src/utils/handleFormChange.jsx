//Helper to update state of most form data
export default function handleFormChange(event, setState) {
  const { name, value } = event.target;
  setState((prevState) => ({ ...prevState, [name]: value }));
}
