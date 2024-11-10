/*-------------------Cleaned up 11/10/24-------------------*/

//Children
import GridBackground from "src/components/GridBackground";

//Include background on pages
export default function PageWrapper({
  children,
  noGrid = false,
  margin = false,
}) {
  return (
    <>
      {!noGrid && <GridBackground />}
      {margin ? <div className="mt-8">{children}</div> : <>{children}</>}
    </>
  );
}
