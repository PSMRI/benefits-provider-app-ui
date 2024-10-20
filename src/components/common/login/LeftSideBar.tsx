import { HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import Logo from "../../../assets/Images/GOM.png";

export default function LeftSideBar() {
  const { t } = useTranslation();
  return (
    <VStack
      flex={1}
      backgroundColor={"#121943"}
      align={"center"}
      justify={"center"}
      h="100%" // Take full height
      overflow="hidden" // Prevent overflows
    >
      <HStack>
        <Image src={Logo} />
        <VStack align={"start"}>
          <Text
            fontSize="24px"
            fontWeight="400"
            color={"white"}
            textAlign="left"
          >
            {t("HEADER_COMPANY_NAME")}
          </Text>
          <Text
            fontSize="16px"
            fontWeight="400"
            color={"#000000"}
            textAlign="left"
            bg={"#D9D9D980"}
          >
            {t("LOGIN_RIGHT_TEXT_H2")}
          </Text>
          <Text
            fontSize="16px"
            fontWeight="400"
            color={"white"}
            textAlign="left"
          >
            {t("LOGIN_RIGHT_TEXT_H3")}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
