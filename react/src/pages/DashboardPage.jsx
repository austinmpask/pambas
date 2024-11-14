/*-------------------Cleaned up 11/10/24-------------------*/

//Children
import PageWrapper from "src/components/PageWrapper";
import DashCard from "src/components/DashCard";
import FunBackground from "src/components/funbackground/FunBackground";

// Shows a set of cards which contain overview information about current projects
export default function DashboardPage() {
  return (
    <>
      <PageWrapper>
        <div className="invisible sm:visible">
          <FunBackground opacity={0.1} />
        </div>
        <DashCard />
        {/* More dashboard cards could be added here in future */}
      </PageWrapper>
    </>
  );
}
