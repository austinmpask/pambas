//React
import { useEffect, useState } from "react";

//Utils
import handleFormChange from "src/utils/handleFormChange";

//Component for a section entry in the dynamic part of the new project form
export default function FormProjectSection({ index, forwardData }) {
  //Each section has a section # and # of controls.
  const [formData, setFormData] = useState({
    section: "",
    controls: "",
  });

  //Forward the state up to the parent upon any changes to this child's state
  useEffect(() => {
    forwardData([index, formData]);
  }, [formData, index, forwardData]);

  //Wrap helper to pass state change func
  function handleChange(event) {
    return handleFormChange(event, setFormData);
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
