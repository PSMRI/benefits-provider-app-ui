import { SearchIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import {
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  VStack,
} from "@chakra-ui/react";
import Table from "../../../components/common/table/Table";
import { DataType } from "ka-table/enums";
import { ICellTextProps } from "ka-table/props";
import React, { useEffect, useState } from "react";
import Layout from "../../../components/layout/Layout";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate, useParams } from "react-router-dom";

import { viewAllApplicationByBenefitId } from "../../../services/benefits";

const columns = [
  { key: "studentName", title: "Name", dataType: DataType.String },
  { key: "applicationId", title: "Application ID", dataType: DataType.Number },
  { key: "status", title: "Status", dataType: DataType.String },

  {
    key: "actions",
    title: "Actions",
    dataType: DataType.String,
  },
];

const DetailsButton = ({ rowData }: ICellTextProps) => {
  const navigate = useNavigate();
  return (
    <HStack>
      <IconButton
        aria-label="View"
        icon={<ArrowForwardIcon />}
        size="lg"
        onClick={() => {
          navigate(`/application_detail/${rowData?.applicationId}`);
        }}
      />
    </HStack>
  );
};

const ApplicantDetails: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const { id } = useParams<{ id: string }>();
  const [applicationData, setApplicationData] = useState([]);
  useEffect(() => {
    const fetchApplicationData = async () => {
      if (id) {
        try {
          const applicantionDataResponse = await viewAllApplicationByBenefitId(
            id
          );
          const processedData = applicantionDataResponse?.map((item: any) => ({
            studentName: item?.applicant?.studentName || "N/A",
            applicationId: item?.id || "N/A",
            status: item?.status || "N/A",
          }));
          setApplicationData(processedData);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.error("id is undefined");
      }
    };
    fetchApplicationData();
  }, [id]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };
  return (
    <Layout
      _titleBar={{
        title: `Applicantion list: ${id}`,
      }}
      showMenu={true}
      showSearchBar={true}
      showLanguage={false}
    >
      <VStack spacing="50px" p={"20px"} align="stretch">
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
        </HStack>
        <Table
          columns={columns}
          data={applicationData}
          detailsRows={[1]}
          rowKeyField={"applicationId"}
          childComponents={{
            cellText: {
              content: (props: ICellTextProps) => CellTextContent(props),
            },
          }}
        />
      </VStack>
    </Layout>
  );
};

export default ApplicantDetails;

const CellTextContent = (props: ICellTextProps) => {
  if (props.column.key === "actions") {
    return <DetailsButton {...props} />;
  }
  return props.value;
};
