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
} from "@nextui-org/react";

//Icons
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//Utils
import { DataFields } from "src/utils/validations";

//Dynamic form allowing user to input the sections they are assigned, along with control amounts per section
export default function SectionsForm({ sections, setSections }) {
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
    <Card className="w-2/5 h-fit transition-all rounded-none sm:rounded-xl">
      {/* Header */}
      <CardHeader className="h-[60px] p-4 flex flex-row justify-between">
        <p className="text-xl sm:font-semibold">My Assignments</p>

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
          isDisabled={sections.length >= DataFields.SECTIONS_LIST_MAX}
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
                  />
                </TableCell>
                <TableCell>
                  {/* Control Input Cell */}
                  <ControlInput
                    index={i}
                    forward={saveInput}
                    value={section[1]}
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
                    onClick={() => removeSection(i)}
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
