//Icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

//Children
import { Image } from "@nextui-org/react";

//Generic error page
export default function ErrorElement() {
  return (
    <div className="h-mobile sm:h-screen w-screen px-10 flex flex-col sm:items-center justify-center">
      <p className="text-lg text-danger-300 font-bold mb-2">Oops!</p>
      <div>
        <FontAwesomeIcon
          size="xl"
          className="mb-4 text-danger-300"
          icon={faTriangleExclamation}
        />
      </div>
      <p className="text-lg font-semibold text-slate-600 mb-6">
        Either you made a mistake, or I did. (It was probably me)
      </p>

      <p className="text-sm text-slate-600 font-semibold">I blame him:</p>
      <Image alt="cat" height={250} src="https://i.ibb.co/K20HyxW/smudge.jpg" />
    </div>
  );
}
