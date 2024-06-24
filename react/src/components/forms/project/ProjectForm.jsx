//React
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";
import { toastError, toastSuccess } from "src/styles/toasts";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

//Utils
import handleFormChange from "src/utils/handleFormChange";
import addProject from "src/utils/addProject";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//Children
import FormProjectSection from "src/components/forms/project/FormProjectSection";

//Form for setting up a new project
export default function ProjectForm() {
  const { projectSummaryData, setProjectSummaryData } = useContext(
    ProjectSummaryContext
  );

  const navigate = useNavigate();
  //Lefthand form state
  const [formData, setFormData] = useState({
    name: "",
    type: 1,
    budget: "",
    manager: "",
  });

  //Formatted field names for error messages from left hand of form
  const prettyNames = {
    name: "Engagement Name",
    type: "Type",
    budget: "Budgeted Hours",
    manager: "Project Manager",
  };

  //Child components for dynamic "sections"/righthand section of form
  const [sections, setSections] = useState([
    <FormProjectSection key={0} index={0} forwardData={getData} />,
  ]);

  //State of child section components/right hand components
  const [childrenState, setChildrenState] = useState([
    {
      section: "",
      controls: "",
    },
  ]);

  //Wrap helper to pass state change func
  function handleChange(event) {
    return handleFormChange(event, setFormData);
  }

  //Getter function which will be passed to child dynamic form elements to access state from parent
  function getData(data) {
    setChildrenState((prevState) => {
      const newState = [...prevState];
      newState[data[0]] = data[1];
      return newState;
    });
  }

  //Add a section to the project, max = 10 sections
  function addSection(event) {
    event.preventDefault();
    //Make suer max length hasnt been hit
    if (sections.length < 10) {
      //Find the key of the last project section in the form inorder to increment for a new item
      const lastKey = Number(sections[sections.length - 1].key);

      //Add the new section component to the tree
      setSections([
        ...sections,
        <FormProjectSection
          key={lastKey + 1}
          index={lastKey + 1}
          forwardData={getData}
        />,
      ]);
    } else {
      //Too many sections already exist
      toastError("Can't add more sections!");
    }
  }

  //Remove section from the project
  function removeSection(event) {
    event.preventDefault();
    //Make sure there is atleast 2 sections present
    if (sections.length > 1) {
      //Remove last item from child components
      setSections(sections.slice(0, sections.length - 1));

      //Discard state of deleted child
      setChildrenState((prevState) => {
        const newState = [...prevState];
        newState.pop();
        return newState;
      });
    } else {
      //Attempted with < 2 sections
      toastError("Must have atleast one section!");
    }
  }

  //Create a new project via note api for user
  async function handleSubmit(event) {
    event.preventDefault();

    //Helper to make api request to add project
    const response = await addProject(formData, prettyNames, childrenState);

    //Check for error, forward status to user
    if (!response.ok) {
      response.errors.forEach((error) => {
        toastError(error);
      });
    } else {
      //Successful, update context and redirect
      toastSuccess("Project successfully created!");
      const newContext = [...projectSummaryData];
      newContext.push(response.data);

      setProjectSummaryData(newContext);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
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
              <label className="label">Engagement Name *</label>
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
              <label className="label">Type *</label>
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
              <label className="label">Budgeted Hours *</label>
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
              <label className="label">Project Manager *</label>
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
                    <FontAwesomeIcon icon={faPlus} />
                  </span>
                </button>
                <button className="button" onClick={removeSection}>
                  <span className="icon">
                    <FontAwesomeIcon icon={faMinus} />
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
