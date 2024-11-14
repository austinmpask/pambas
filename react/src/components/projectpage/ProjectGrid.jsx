//Children
import ProjectSection from "src/components/projectpage/ProjectSection";
import FancyLoader from "src/components/FancyLoader";

//Grid interface displaying all of the user's projects
export default function ProjectGrid({ contextSlice, projectDetails }) {
  return (
    <div className="bottom-split-mobile sm:bottom-split-desktop sm:mt-[320px] lg:mt-0 sm:border-t-2 sm:border-slate-300 sm:shadow-inner lg:shadow-none lg:border-0 sm:overflow-scroll scrollbar-hidden lg:h-auto flex flex-grow flex-col items-center">
      {projectDetails ? (
        projectDetails.sections.map((section, index) => {
          return (
            <ProjectSection
              contextSlice={contextSlice}
              sectionData={section}
              index={index}
              key={index}
            />
          );
        })
      ) : (
        <div className="h-mobile w-full flex flex-col items-center justify-center">
          <FancyLoader size={40} />
        </div>
      )}
    </div>
  );
}
