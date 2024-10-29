// src/components/KeyMetrics.tsx
import { HStack, Select, Text, VStack } from "@chakra-ui/react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import CommonCard from "../../components/common/card/CommonCard";
import StatBox from "../../components/common/widget/StatBox"; // Reusing StatBox
import { financialData } from "../../components/common/widget/StatData";
import Chart from "react-apexcharts";
interface ApplicationOverview {
  [key: string]: {
    id: number;
    count: number;
    label: string;
  };
}
interface ApplicationData {
  id: number;
  number: number;
  label: string;
}
interface FinancialData {
  id: number;
  count: number;
  label: string;
  sponsorCount: number;
}
interface PopularBenefitData {
  id: number;
  totalDisbursed: string;
  title: string;
  totalApplications: number;
}

interface MatricsData {
  application_overview: ApplicationOverview;
  top_3_benefits?: Array<{
    id: number;
    title: string;
    totalApplications: number;
    totalDisbursed: number;
  }>;
}
// Pie chart data
const pieChartOptions = {
  labels: financialData.map((e) => e.label),
  colors: ["#06164B", "#DDE1FF"],
  dataLabels: {
    enabled: true,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "left",
  },
  plotOptions: { pie: { startAngle: 45 } },
};
const pieChartSeries = financialData.map((e) => e.count);
interface KeyMetricsProps {
  matricsData: MatricsData;
  applicationData: ApplicationData[];
  financialData: FinancialData[];
  popularBenefit: PopularBenefitData[];
}

const KeyMetrics: React.FC<KeyMetricsProps> = ({
  matricsData,
  applicationData,
}) => {
  const { t } = useTranslation();

  return (
    <VStack spacing="60px" align="stretch">
      <HStack justify="space-between">
        {/* Key Metrics Heading */}
        <Text fontSize="36px" fontWeight="400" color="#06164B">
          {t("DASHBOARD_KEY_METRICS_TITLE")}
        </Text>

        {/* October 2024 Dropdown */}
        <Select
          w="175px"
          placeholder="October 2024"
          borderColor="gray.300"
          bg="white"
          _hover={{ borderColor: "gray.400" }}
          _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
        />
      </HStack>

      <HStack align="stretch" spacing={"60px"}>
        <VStack spacing={"60px"} align="start">
          <Text fontSize="22px" fontWeight="400" color={"#2F3036"}>
            {t("DASHBOARD_APPLICANT_OVERVIEW_TITLE")}
          </Text>
          <VStack spacing={4}>
            {applicationData?.map((item) => (
              <StatBox key={item.id} number={item.number} label={item.label} />
            ))}
          </VStack>
        </VStack>
        <VStack spacing={"60px"} align="start">
          <Text fontSize="22px" fontWeight="400" color={"#2F3036"}>
            {t("DASHBOARD_FINANCIAL_OVERVIEW_TITLE")}
          </Text>
          <VStack bg="#F8F8F8" p="5" align="stretch" flex="1">
            <Text fontSize="16px" fontWeight="400">
              Total Budget:{" "}
              <b>
                ₹ {financialData.reduce((acc, curr) => acc + curr.count, 0)}
              </b>
            </Text>
            <Text fontSize="16px" fontWeight="400">
              {"Number of Sponsors: "}
              <b>
                {financialData.reduce(
                  (acc, curr) => acc + curr.sponsorCount,
                  0
                )}
              </b>
            </Text>
            <Chart
              options={pieChartOptions as any}
              series={pieChartSeries}
              type="pie"
              width="300"
            />
          </VStack>
        </VStack>
        <VStack spacing={"60px"} align="start">
          <Text fontSize="22px" fontWeight="400" color={"#2F3036"}>
            {t("DASHBOARD_POPULAR_BENEFITS_TITLE")}
          </Text>
          <VStack spacing={"35px"} align="stretch">
            {matricsData?.top_3_benefits?.map((item, index) => (
              <CommonCard key={item?.id || index} {...(item || {})} />
            ))}
          </VStack>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default memo(KeyMetrics);
