//Children
import {
  Card,
  CardHeader,
  CardBody,
  Divider,
  Image,
  Spacer,
  Link,
  Tooltip,
} from "@nextui-org/react";

//Animation
import { motion } from "framer-motion";

export default function WelcomeCard() {
  return (
    <>
      <div className="h-screen sm:py-12 sm:pr-12">
        <Card
          isBlurred
          className="w-full rounded-none sm:rounded-r-3xl sm:rounded-l-none h-full"
        >
          <CardBody className="h-full p-6 flex flex-col justify-center items-center">
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
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 1,
                  ease: [0.22, 0.13, 0.16, 1],
                }}
              >
                <p className="text-4xl text-slate-800 font-semibold sm:font-bold">
                  Pambas
                </p>
              </motion.div>

              <p className="text-base text-slate-400 ">
                The SOC solution you knew you needed
              </p>

              <div>shit here</div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
