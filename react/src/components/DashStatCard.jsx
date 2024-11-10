import { Card, CardBody, Skeleton } from "@nextui-org/react";
import { Colors } from "src/utils/validations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function DashStatCard({ stat, icon, label, color }) {
  //   const colorOption = stat < 0 ? "danger" : "success";
  return (
    <Card
      isPressable
      disableRipple
      className={`drop-shadow-xl rounded-3xl h-[180px] w-[180px] ${
        color && "bg-" + color
      }`}
    >
      <CardBody
        className={`rounded-3xl relative p-5 ${
          color ? "text-" + color + "Shadow" : Colors.text.dark
        }`}
      >
        <div className="flex h-full w-full flex-col align-start justify-between">
          <Skeleton
            disableAnimation
            isLoaded={stat !== undefined}
            className="rounded-lg"
          >
            <p className="font-bold text-7xl">{stat < 0 ? stat * -1 : stat}</p>
          </Skeleton>
          <Skeleton
            disableAnimation
            isLoaded={stat !== undefined}
            className="rounded-lg"
          >
            <p className="text-lg font-semibold">{label}</p>
          </Skeleton>
        </div>
        <FontAwesomeIcon
          className={`${
            color ? "text-" + color + "Shadow" : Colors.text.dark
          } absolute top-0 right-0 p-4`}
          size="xl"
          icon={icon}
        />
      </CardBody>
    </Card>
  );
}
