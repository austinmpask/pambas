//Children
import { Card, CardHeader, CardBody, Divider, Spacer } from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Card template for settings menus
export default function SettingsCard({ title, icon, children, end = false }) {
  return (
    <>
      <Card className="w-full sm:max-w-[600px] rounded-none sm:rounded-xl">
        <CardHeader className="p-4 h-[60px] sm:pr-6 flex flex-row justify-between">
          <p className="text-xl sm:font-semibold">{title}</p>
          {icon && (
            <FontAwesomeIcon
              size="lg"
              className="text-default-400"
              icon={icon}
            />
          )}
        </CardHeader>
        <Divider />

        <CardBody className="p-8 sm:p-6">{children}</CardBody>
      </Card>

      {!end && <Spacer y={4} />}
    </>
  );
}
