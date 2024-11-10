/*-------------------Cleaned up 11/10/24-------------------*/

//Children
import PageWrapper from "src/components/PageWrapper";
import DashCard from "src/components/DashCard";

// Shows a set of cards which contain overview information about current projects
export default function DashboardPage() {
  return (
    <>
      <PageWrapper>
        <DashCard />
        {/* More dashboard cards could be added here in future */}
      </PageWrapper>
    </>
  );
}
