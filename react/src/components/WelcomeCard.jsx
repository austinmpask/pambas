//Children
import {
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Divider,
  Image,
  Spacer,
  Link,
  Tooltip,
  Button,
} from "@nextui-org/react";
import GHButton from "./GHButton";

//Animation
import { motion } from "framer-motion";

export default function WelcomeCard() {
  return (
    <>
      <div className="lg:h-screen lg:py-12 lg:pr-12">
        <Card
          isBlurred
          className="w-full rounded-none lg:rounded-r-3xl lg:rounded-l-none h-svh lg:h-full"
        >
          <CardBody className="p-6 flex flex-col justify-center items-center">
            <div className="flex flex-col items-center gap-10">
              <motion.div
                className="w-[80px] h-[80px]"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{
                  delay: 0.1,
                  duration: 0.7,
                  ease: [0.22, 0.13, 0.16, 1],
                }}
              >
                <Image
                  alt="Logo"
                  height={80}
                  radius="none"
                  src="/rings.png"
                  width={80}
                />
              </motion.div>

              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 1,
                  ease: [0.22, 0.13, 0.16, 1],
                }}
              >
                <p className="text-5xl logo-font text-slate-800">Pambas</p>
                <p className="text-center text-lg text-slate-400">
                  The Intuitive Project Management Solution for SOC Auditors
                </p>
              </motion.div>
            </div>
          </CardBody>
          <CardFooter className="flex flex-row items-center justify-center">
            <GHButton />
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
