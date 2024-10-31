/*-------------------Cleaned up 10/29/24-------------------*/

//Children
import SectionInput from "./SectionInput";
import ControlInput from "./ControlInput";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Tooltip,
  Spacer,
} from "@nextui-org/react";

//Icons
import {
  faTrash,
  faPlus,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utils
import { DataFields } from "src/utils/validations";

//Dynamic form allowing user to input the sections they are assigned, along with control amounts per section
export default function SectionsForm({ loading, sections, setSections }) {
  //Add section to list, up to max constant
  function addSection() {
    sections.length < DataFields.SECTIONS_LIST_MAX &&
      setSections((prev) => [...prev, [0, 0]]);
  }

  //Update the array of sections with the section/control number at appropriate index
  function saveInput(data, index, control = false) {
    setSections((prev) => {
      const newSections = [...prev];
      newSections[index][control ? 1 : 0] = data; //Change either the section number or controls #
      return newSections;
    });
  }

  //Remove a section from the array via delete button
  function removeSection(i) {
    sections.length > 1 &&
      setSections((prev) => prev.filter((_, index) => index !== i));
  }

  return (
    <Card className="w-full md:w-[600px] lg:w-2/5 h-fit transition-all rounded-none sm:rounded-xl">
      {/* Header */}
      <CardHeader className="h-[60px] p-4 flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <p className="text-xl sm:font-semibold">My Assignments</p>
          <Tooltip
            delay={250}
            placement="bottom-start"
            content={
              <div className="px-1 py-2 text-default-500">
                <div className="text-small font-bold text-default-700">
                  Huh?
                </div>
                <Spacer y={2} />
                <div className="text-tiny">
                  Your Project will be organized as a table split by Workpaper
                  Section,
                </div>
                <div className="text-tiny">
                  with each Control being one row.
                </div>
                <Spacer y={2} />

                <div className="text-tiny font-bold text-default-700">
                  For Instance:
                </div>

                <div className="text-tiny">
                  If you were assigned Workpaper Section 1, which contains 8
                  Controls
                </div>

                <div className="text-tiny">
                  and Workpaper Section 2, which contains 5 Controls, you would
                  record that here.
                </div>
              </div>
            }
          >
            <FontAwesomeIcon className="py-3 px-2" icon={faCircleInfo} />
          </Tooltip>
        </div>

        {/* Add section */}
        <Button
          variant="flat"
          color={
            sections.length < DataFields.SECTIONS_LIST_MAX
              ? "secondary"
              : "default"
          }
          startContent={<FontAwesomeIcon icon={faPlus} />}
          onPress={() => addSection()}
          isDisabled={
            sections.length >= DataFields.SECTIONS_LIST_MAX || loading
          }
        >
          Add Section
        </Button>
      </CardHeader>
      <Divider />

      <CardBody className="p-4">
        {/* Sections table */}
        <Table>
          <TableHeader>
            <TableColumn>Section</TableColumn>
            <TableColumn>Controls</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody>
            {sections.map((section, i) => (
              // Table row

              <TableRow key={i}>
                {/* Section Input Cell */}
                <TableCell className="w-1/2">
                  <SectionInput
                    index={i}
                    forward={saveInput}
                    value={section[0]}
                    loading={loading}
                  />
                </TableCell>
                <TableCell>
                  {/* Control Input Cell */}
                  <ControlInput
                    index={i}
                    forward={saveInput}
                    value={section[1]}
                    loading={loading}
                  />
                </TableCell>
                <TableCell>
                  {/* Trash can icon, color is red if there is more than 1 row */}
                  <FontAwesomeIcon
                    className={`${
                      i
                        ? "text-danger cursor-pointer"
                        : sections.length > 1
                        ? "text-danger cursor-pointer"
                        : "text-default-200"
                    } transition-all`}
                    size="lg"
                    icon={faTrash}
                    onClick={() => !loading && removeSection(i)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
