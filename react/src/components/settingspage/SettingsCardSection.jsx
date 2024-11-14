/*-------------------Cleaned up 11/10/24-------------------*/

//Children
import { Spacer } from "@nextui-org/react";

//Divider component for sections form layout
export default function SettingsCardSection({ title, children = null }) {
  return (
    <>
      <p className="text-md font-semibold">{title}</p>
      <Spacer y={4} />

      <div className="flex flex-row">
        <Spacer className="hidden sm:flex" x={4} />

        <div className="flex flex-col w-full sm:w-fit">{children}</div>
      </div>
    </>
  );
}
