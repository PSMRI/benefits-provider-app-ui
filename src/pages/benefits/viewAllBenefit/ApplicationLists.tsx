import { ArrowBackIcon, SearchIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  VStack,
  Text,
  Flex,
} from "@chakra-ui/react";
import Table from "../../../components/common/table/Table";
import { DataType } from "ka-table/enums";
import { ICellTextProps } from "ka-table/props";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";
import PaginationList from "./PaginationList";
import { viewAllApplicationByBenefitId } from "../../../services/benefits";
import DownloadCSV from "../../../components/DownloadCSV";
import { formatDate } from "../../../services/helperService";

const columns = [
  { 
    key: "studentName", 
    title: "Name", 
    dataType: DataType.String, 
    style: { width: "15%", minWidth: 80, whiteSpace: "nowrap" }
  },
  { 
    key: "applicationId", 
    title: "App ID",
    dataType: DataType.Number, 
    style: { width: "5%", minWidth: 10, whiteSpace: "nowrap", textAlign: "center" } 
  },
  { 
    key: "orderId", 
    title: "Order ID", 
    dataType: DataType.String, 
    style: { width: "15%", minWidth: 80, whiteSpace: "nowrap", textAlign: "center" }
  },
  { 
    key: "submittedAt", 
    title: "Submitted At", 
    dataType: DataType.String, 
    style: { width: "10%", minWidth: 50, whiteSpace: "nowrap", textAlign: "center" }
  },
  { 
    key: "lastUpdatedAt", 
    title: "Last Updated At", 
    dataType: DataType.String, 
    style: { width: "10%", minWidth: 50, whiteSpace: "nowrap", textAlign: "center" }
  },
  { 
    key: "status", 
    title: "Status", 
    dataType: DataType.String, 
    style: { width: "10%", minWidth: 30, whiteSpace: "nowrap", textAlign: "center" }
  },
  { 
    key: "actions", 
    title: "Actions", 
    dataType: DataType.String, 
    style: { width: "10%", minWidth: 30, whiteSpace: "nowrap", textAlign: "center" }
  },
];

const DetailsButton = ({ rowData }: ICellTextProps) => {
  const navigate = useNavigate();
  return (
    <Flex justifyContent="center" alignItems="center" width="100%">
      <IconButton
        aria-label="View"
        icon={<ArrowForwardIcon />}
        size="lg"
        onClick={() => {
          navigate(`/application_detail/${rowData?.applicationId}`);
        }}
      />
    </Flex>
  );
};

const ApplicationLists: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const { id } = useParams<{ id: string }>();
  const [applicationData, setApplicationData] = useState<any[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 10;
  const [benefitName, setBenefitName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicationData = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const applicantionDataResponse = await viewAllApplicationByBenefitId(
            id
          );
          console.log("applicantionDataResponse", applicantionDataResponse);
          setBenefitName(applicantionDataResponse?.benefit?.title ?? "");
          if (
            !applicantionDataResponse?.applications ||
            !Array.isArray(applicantionDataResponse?.applications)
          ) {
            console.error("Invalid response format from API");
            setApplicationData([]);
            return;
          }
          const processedData = applicantionDataResponse?.applications?.map(
            (item: any) => ({
              studentName: `${item?.applicationData?.firstName ?? "N/A"} ${
                item?.applicationData?.middleName ?? ""
              } ${item?.applicationData?.lastName ?? ""}`.trim(),
              applicationId: item?.id ?? "-",
              orderId: item?.orderId ?? "-",
              submittedAt: item?.createdAt ?? "-",
              lastUpdatedAt: item?.updatedAt ?? "-",
              status: item?.status ?? "-",
            })
          );
          setApplicationData(processedData);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("id is undefined");
        setIsLoading(false);
      }
    };
    fetchApplicationData();
  }, [id]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPageIndex(0);
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
    setPageIndex(0);
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const filteredData = applicationData?.filter((item) =>
    item?.studentName.toLowerCase().includes(searchTerm)
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.studentName.localeCompare(b.studentName);
    } else if (sortOrder === "desc") {
      return b.studentName.localeCompare(a.studentName);
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  return (
    <Layout
      _titleBar={{
        title: (
          <HStack spacing={4}>
            <ArrowBackIcon
              w={6}
              h={6}
              cursor="pointer"
              onClick={() => navigate(-1)}
              color="white"
              fontWeight="bold"
            />
            <Text fontWeight="bold">Application List For: {benefitName}</Text>
          </HStack>
        ),
      }}
      showMenu={true}
      showSearchBar={true}
      showLanguage={false}
    >
      <VStack spacing="50px" p={"20px"} align="stretch">
        {/* Search and Sort Controls - Only show when applications are available */}
        {!isLoading && sortedData?.length > 0 && (
          <HStack spacing={4}>
            <InputGroup maxWidth="300px" rounded={"full"} size="lg">
              <Input
                placeholder="Search by name.."
                rounded={"full"}
                bg="#E9E7EF"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <InputRightElement>
                <SearchIcon color="gray.500" />
              </InputRightElement>
            </InputGroup>

            <Select
              placeholder="Sort Order"
              onChange={handleSortOrderChange}
              value={sortOrder}
              maxWidth="150px"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
            {id && <DownloadCSV benefitId={id} benefitName={benefitName} />}
          </HStack>
        )}

        {/* Table and Pagination */}
        {isLoading ? (
          <Text fontSize="lg" textAlign="center" color="blue.500">
            Loading...
          </Text>
        ) : sortedData?.length > 0 ? (
          <Table
            columns={columns}
            data={paginatedData}
            rowKeyField={"applicationId"}
            childComponents={{
              cellText: {
                content: (props: ICellTextProps) => CellTextContent(props),
              },
            }}
          />
        ) : (
          <Text fontSize="lg" textAlign="center" color="gray.500">
            No applications available
          </Text>
        )}

        {!isLoading && sortedData?.length > 0 && (
          <PaginationList
            total={sortedData.length}
            pageSize={pageSize}
            currentPage={pageIndex}
            onPageChange={handlePageChange}
          />
        )}
      </VStack>
    </Layout>
  );
};

export default ApplicationLists;

const CellTextContent = (props: ICellTextProps) => {
  if (props.column.key === "actions") {
    return <DetailsButton {...props} />;
  }

  if (props.column.key === "status") {
    const status = props.value?.toLowerCase();
    let color = "gray.500";
    if (status === "pending") color = "orange.500";
    else if (status === "approved") color = "green.500";
    else if (status === "rejected") color = "red.500";
    const titleCaseStatus = status ? status.charAt(0).toUpperCase() + status.slice(1) : "";
    return (
      <Text color={color} fontWeight="bold">
        {titleCaseStatus}
      </Text>
    );
  }

  if (
    props.column.key === "submittedAt" ||
    props.column.key === "lastUpdatedAt"
  ) {
    if (!props.value || props.value === "-") {
      return <Text>-</Text>;
    }
    return (
      <Text
        isTruncated
        whiteSpace="nowrap"
        title={formatDate(props.value, { withTime: true })}
      >
        {formatDate(props.value)}
      </Text>
    );
  }

  return props.value;
};
