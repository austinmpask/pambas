/*-------------------Cleaned up 10/28/24-------------------*/

//Children
import { NavbarItem, Tooltip, Chip } from "@nextui-org/react";

// Visual warning for if using non-prod version
export default function DevEnvLabel() {
  return (
    <NavbarItem>
      <Tooltip
        delay={250}
        content={
          <div className="px-1 py-2">
            <div className="text-small font-bold">Development Version</div>
            <div className="text-tiny">
              You are using the Development Version of Pambas
            </div>
            <div className="text-tiny">
              Information stored here is separate from the Production
              Application
            </div>
          </div>
        }
      >
        <Chip variant="flat" size="sm" color="danger">
          <p className="font-semibold">DEV</p>
        </Chip>
      </Tooltip>
    </NavbarItem>
  );
}
