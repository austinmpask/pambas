/*-------------------Cleaned up 10/29/24-------------------*/

//Children
import { Select, SelectItem } from "@nextui-org/react";

//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

//Utils
import { DataFields } from "src/utils/validations";

//Select field on the new project form for specifying a section
export default function SectionInput({ loading, index, forward, value }) {
  //Make array of 1 - n for amount of sections allowed in format for nextui to easily map components
  const sections = [...Array(DataFields.SECTIONS_LIST_MAX)].map((_, i) => ({
    value: i + 1,
    label: `Section ${i + 1}`,
  }));
  return (
    <div className="flex flex-row items-center w-full">
      <FontAwesomeIcon className="mr-3 text-default-600" icon={faThumbtack} />
      <Select
        aria-label="Section Dropdown"
        label="Section #"
        items={sections}
        selectedKeys={value && new Set([String(value - 1)])} //This makes a warning but necessary for now
        isDisabled={loading}
        onSelectionChange={(data) => {
          forward(Number(Array.from(new Set(data))[0]) + 1, index); //Update the parent's array with the new section at appropriate index
        }}
      >
        {/* List out sections 1-n */}
        {sections.map((section, i) => (
          <SelectItem key={i}>{section.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
