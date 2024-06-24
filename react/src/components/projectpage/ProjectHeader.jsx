import { faSquarePen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";

import { ProjectSummaryContext } from "src/context/ProjectSummaryContext";

import ProjectGrid from "src/components/projectpage/ProjectGrid";
//Title component/wrapper for labeled pages
export default function ProjectHeader({ projectID }) {
  const { projectSummaryData, setProjectSummaryData } = useContext(
    ProjectSummaryContext
  );

  const [contextSlice, setContextSlice] = useState(undefined);
  const [projectIndex, setProjectIndex] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const titleEditRef = useRef(null);
  const titleInputRef = useRef(null);
  const titleRef = useRef(null);

  const [titleInputState, setTitleInputState] = useState("");

  useEffect(() => {
    //Isolate the relevant project details from the context based on
    //the ID prop for current project
    setContextSlice(
      projectSummaryData.find((project) => {
        return project.id === projectID;
      })
    );

    //Find the index of the project with regard to the project summary context
    setProjectIndex(
      projectSummaryData.findIndex((project) => {
        return project.id === projectID;
      })
    );
  }, [projectSummaryData]);

  useEffect(() => {
    if (loading) {
      setLoading(false);
      console.log(contextSlice);
    }
  }, [contextSlice]);

  function hoverOnHandler() {
    titleEditRef.current.classList.remove("is-hidden");
  }

  function hoverOffHandler() {
    titleEditRef.current.classList.add("is-hidden");
  }

  function openTitleEdit() {
    // titleRef.current.classList.add("is-hidden");
    titleInputRef.current.classList.remove("is-hidden");
    titleInputRef.current.focus();
  }

  function closeTitleEdit() {
    // titleRef.current.classList.remove("is-hidden");
    titleInputRef.current.blur();
    titleInputRef.current.classList.add("is-hidden");
    setTitleInputState("");
  }

  function handleKeys(event) {
    if (event.keyCode === 13 && event.ctrlKey) {
      setLoading(true);
      const newSlice = { ...contextSlice, title: titleInputState };

      const newContext = [...projectSummaryData];
      newContext[projectIndex] = newSlice;

      setProjectSummaryData(newContext);
      closeTitleEdit();
    } else if (event.keyCode === 27) {
      closeTitleEdit();
    }
  }

  return (
    contextSlice && (
      <div className="m-6 page-wrapper">
        <div
          className="project-title-container"
          onMouseEnter={hoverOnHandler}
          onMouseLeave={hoverOffHandler}
          onClick={openTitleEdit}
        >
          <h1 ref={titleRef} className="title project-title">
            {contextSlice.title}
          </h1>

          <input
            ref={titleInputRef}
            className="input is-medium is-hidden"
            type="text"
            placeholder={contextSlice.title}
            value={titleInputState}
            onChange={(e) => setTitleInputState(e.target.value)}
            onKeyDown={handleKeys}
          ></input>
          <span ref={titleEditRef} className="icon is-hidden">
            <FontAwesomeIcon icon={faSquarePen} />
          </span>
        </div>
        <div className="block mb-4">
          <div className="block">
            <span>{contextSlice.projectType}</span>
          </div>
          <div className="block">
            <span>{`${
              contextSlice.budget - contextSlice.billed
            } hours remaining`}</span>
          </div>
          <div className="block">
            <span>{`PM: ${contextSlice.projectManager}`}</span>
          </div>
        </div>

        <div className="m-6 has-background-dark">
          <ProjectGrid
            projectID={projectID}
            checkBoxHeaders={contextSlice.checkBoxHeaders}
          />
        </div>
      </div>
    )
  );
}
