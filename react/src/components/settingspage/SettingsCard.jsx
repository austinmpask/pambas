/*-------------------Cleaned up 11/10/24-------------------*/

//Children
import { Card, CardHeader, CardBody, Divider, Spacer } from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Card template for settings menus
export default function SettingsCard({ title, icon, children, end = false }) {
  return (
    <>
      <Card className="w-full sm:max-w-[550px] rounded-none sm:rounded-xl">
        <CardHeader className="p-4 h-[60px] sm:pr-6 flex flex-row justify-between">
          <p className="text-base font-semibold">{title}</p>
          {icon && (
            <FontAwesomeIcon
              size="lg"
              className="text-default-300"
              icon={icon}
            />
          )}
        </CardHeader>
        <Divider />

        <CardBody className="p-8 overflow-hidden sm:p-6">{children}</CardBody>
      </Card>

      {!end && <Spacer y={4} />}
    </>
  );
}
