import { useState } from "react";

export default function ProjectSection({ index }) {
  const [formData, setFormData] = useState({
    section: "",
    controls: "",
  });

  function handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="columns">
      <div className="column">
        <input
          className="input"
          type="number"
          name="section"
          value={formData.section}
          onChange={handleChange}
          placeholder="Section #"
        ></input>
      </div>
      <div className="column">
        <input
          className="input"
          type="number"
          name="controls"
          value={formData.controls}
          onChange={handleChange}
          placeholder="# of Controls"
        ></input>
      </div>
    </div>
  );
}
