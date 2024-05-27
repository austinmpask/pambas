import ProjectSection from "./ProjectSection";
import { useState } from "react";
import { toastError } from "../../assets/styles/toasts";
import { ToastContainer } from "react-toastify";

export default function EngagementForm() {
  const [sections, setSections] = useState([
    <ProjectSection key={0} index={0} />,
  ]);

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    budget: "",
    manager: "",
  });

  function handleSubmit(event) {
    event.preventDefault();

    const sectionList = {};

    const payload = {
      name: formData.name,
      type: "",
      budget: formData.budget,
      manager: formData.manager,
      sections: sectionList,
    };

    console.log(payload);
  }

  function handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function addSection(event) {
    event.preventDefault();
    if (sections.length < 10) {
      const lastKey = Number(sections[sections.length - 1].key);
      setSections([
        ...sections,
        <ProjectSection key={lastKey + 1} index={lastKey + 1} />,
      ]);
    } else {
      toastError("Can't add more sections!");
    }
  }

  function removeSection(event) {
    event.preventDefault();
    if (sections.length > 1) {
      setSections(sections.slice(0, sections.length - 1));
    } else {
      toastError("Must have atleast one section!");
    }
  }

  return (
    <section className="section">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div className="columns">
          <div className="column">
            <h3 className="title is-3 mb-6">Details</h3>
            <div className="field mb-3">
              <label className="label">Engagement Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="name"
                  placeholder="Company ABC"
                  value={formData.name}
                  onChange={handleChange}
                ></input>
              </div>
            </div>

            <div className="field mb-3">
              <label className="label">Type</label>
              <div className="control">
                <div className="select" name="type">
                  <select>
                    <option>SOC 1</option>
                    <option>SOC 2</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field mb-3">
              <label className="label">Budgeted Hours</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="How many hours were you assigned?"
                ></input>
              </div>
            </div>

            <div className="field mb-3">
              <label className="label">Project Manager</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="manager"
                  value={formData.manager}
                  onChange={handleChange}
                  placeholder="Name"
                ></input>
              </div>
            </div>
            <div className="block mt-3">
              <button className="button is-primary" type="submit">
                Add
              </button>
            </div>
          </div>

          <div className="column">
            <h3 className="title is-3 mb-6">Sections</h3>
            <div className="field mb-3">
              <div className="columns">
                <div className="column">
                  <label className="label">Section #</label>
                </div>

                <div className="column">
                  <label className="label"># of Controls</label>
                </div>
              </div>
              {sections}
              <div className="block">
                <button className="mr-3 button is-dark" onClick={addSection}>
                  <span className="icon">
                    <i className="fas fa-plus"></i>
                  </span>
                </button>
                <button className="button" onClick={removeSection}>
                  <span className="icon">
                    <i className="fas fa-minus"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
