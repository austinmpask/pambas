//Children
import { Button } from "@nextui-org/react";

export default function GHButton() {
  return (
    <a href="https://github.com/austinmpask/pambas" className="opacity-30">
      <Button
        variant="light"
        startContent={
          <img className="w-[20px] h-[20px]" src="github-mark.svg" />
        }
      >
        austinmpask
      </Button>
    </a>
  );
}
