//React
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

//Toasts
import { ToastContainer } from "react-toastify";
import { toastError } from "src/styles/toasts";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

//Utils
import toastRequest from "src/utils/toastRequest";
import { Validators, DataFields } from "src/utils/validations";

//Form
import { useForm } from "react-hook-form";
import FormField from "src/components/forms/components/FormField";
import SubmitAlt from "src/components/forms/components/SubmitAlt";

//Contexts
import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

//Children
import FormProjectSection from "src/components/forms/project/FormProjectSection";

//Form for setting up a new project
export default function ProjectForm() {
  const { setProjectSummaryData } = useContext(ProjectSummaryContext);

  const navigate = useNavigate();

  //State for visuals/form disabled
  const [loading, setLoading] = useState(false);

  //Lefthand form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  //Getter function which will be passed to child dynamic form elements to access state from parent
  function getData(data) {
    setChildrenState((prevState) => {
      const newState = [...prevState];
      newState[data[0]] = data[1];
      return newState;
    });
  }

  //Add a section to the project
  function addSection(event) {
    event.preventDefault();
    //Make suer max length hasnt been hit
    if (sections.length < DataFields.SECTIONS_LIST_MAX) {
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
    if (sections.length > DataFields.SECTIONS_LIST_MIN) {
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
  async function createProject(data) {
    const payload = { ...data, sections: childrenState };
    console.log(payload);
    await toastRequest({
      method: "POST",
      route: "/project",
      data: payload,
      setLoading,
      successCB: (message) => {
        //Update summary context
        setProjectSummaryData((prev) => {
          const newContext = [...prev];
          newContext.push(message);
          return newContext;
        });

        //Redirect
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      },
    });
  }

  return (
    <section className="section">
      <ToastContainer />
      <form onSubmit={handleSubmit((data) => createProject(data))}>
        <div className="columns">
          <div className="column">
            <div className="card p-6">
              <h2 className="title is-4 has-text-weight-bold mb-5">
                Project Information
              </h2>
              <div className="m-4">
                <FormField
                  field="name"
                  error={errors.name?.message}
                  label={DataFields.PROJECT_TITLE_LABEL}
                  validations={Validators.ProjectName}
                  loading={loading}
                  size="ff-med"
                  register={register}
                />

                <FormField
                  field="manager"
                  error={errors.manager?.message}
                  label="Project Manager"
                  validations={Validators.Manager}
                  loading={loading}
                  size="ff-med"
                  register={register}
                />

                <FormField
                  field="type"
                  error={errors.type?.message}
                  label={DataFields.PROJECT_TYPE_LABEL}
                  validations={Validators.ProjectType}
                  loading={loading}
                  register={register}
                />

                <FormField
                  field="budget"
                  error={errors.budget?.message}
                  label={DataFields.BUDGET_LABEL}
                  validations={Validators.Budget}
                  loading={loading}
                  type="number"
                  register={register}
                />

                <SubmitAlt
                  submitLabel="Create Project"
                  altLabel="Nevermind"
                  altAction={() => navigate("/dashboard")}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          <div className="column">
            <div className="card p-6">
              <h2 className="title is-4 has-text-weight-bold mb-5">Sections</h2>

              <div className="m-4">
                <div className="columns">
                  <div className="column">
                    <label className="label">Section #</label>
                  </div>

                  <div className="column">
                    <label className="label"># of Controls</label>
                  </div>
                </div>
                {sections}

                <div>
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
        </div>
      </form>
    </section>
  );
}
