import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/Images/Frame.png";

export default function LeftSideBar() {
  const { t } = useTranslation();
  return (
    <VStack
      flex={1}
      backgroundColor={"#121943"}
      align={"center"}
      justify={"center"}
      h="100vh"
      overflow="hidden"
    >
      <HStack>
        <Image src={Logo} />
        <VStack align={"start"}></VStack>
      </HStack>
    </VStack>
  );
}
