import {
  Button,
  Checkbox,
  FormControl,
  HStack,
  Image,
  Input,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/Images/GOM.png";
import TH3 from "../../components/common/typography/TH3";
import TT2 from "../../components/common/typography/TT2";
import TT3 from "../../components/common/typography/TT3";
import Layout from "../../components/layout/Layout";
export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <Layout showMenu={false} showSearchBar={false} showLanguage={true}>
      <HStack w="full" h="2xl" spacing={8} align="stretch">
        <VStack
          flex={1}
          backgroundColor={"#121943"}
          align={"center"}
          justify={"center"}
        >
          <HStack>
            <Image src={Logo} />
            <VStack align={"start"}>
              <TH3 color={"white"} textAlign="left">
                {t("HEADER_COMPANY_NAME")}
              </TH3>
              <TT2 color={"white"} textAlign="left">
                {t("LOGIN_RIGHT_TEXT_H2")}
              </TT2>
              <TT2 color={"white"} textAlign="left">
                {t("LOGIN_RIGHT_TEXT_H3")}
              </TT2>
            </VStack>
          </HStack>
        </VStack>

        <VStack p={8} flex={1} align={"center"} justify={"center"} w={"full"}>
          <Stack spacing={4} w={"full"}>
            <TH3 textAlign={"left"}>{t("LOGIN_TITLE")}</TH3>
            <FormControl id="email">
              <TT2>{t("LOGIN_ENAIL_ID")}</TT2>
              <Input type="email" w={"full"} />
            </FormControl>

            <Stack spacing={6}>
              <Stack
                direction={{ base: "column", sm: "column" }}
                align={"start"}
                justify={"space-between"}
              >
                <TT2>{t("LOGIN_TERMS")}</TT2>
                <TT2>{t("LOGIN_TERMS_ACCEPT")}</TT2>
                <Checkbox>
                  <TT2>{t("LOGIN_AGREE")}</TT2>
                </Checkbox>
              </Stack>
              <Button
                colorScheme={"blue"}
                variant={"solid"}
                borderRadius={"100px"}
                onClick={() => {
                  // localStorage.setItem("token", "true");
                  navigate("/otp");
                }}
              >
                <TT3>{t("LOGIN_LOGIN")}</TT3>
              </Button>
              <Button
                colorScheme={"blue"}
                variant={"outline"}
                borderRadius={"100px"}
                onClick={() => {
                  // localStorage.setItem("token", "true");
                  navigate("/user/register");
                }}
              >
                <TT3>{t("LOGIN_REGISTER")}</TT3>
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </HStack>
    </Layout>
  );
}
