import { generateUUID } from "../utils/dataJSON/helper/helper";

import axios from "axios";
const apiUrl = import.meta.env.VITE_PROVIDER_BASE_URL;
const initAPI = import.meta.env.VITE_APPLICATION_API;
const schemaAPI = import.meta.env.VITE_SCHEMA_API;

interface BenefitRequestInfo {
  apiId: string;
  ver?: string | null;
  ts?: string | null;
  action?: string | null;
  did?: string | null;
  key?: string | null;
  msgId: string;
  authToken: string;
  userInfo: {
    id: number;
    uuid: string;
    userName: string;
    name: string;
    mobileNumber: string;
    emailId: string;
    type: string;
    active: boolean;
    tenantId: string;
  };
}

interface SponsorData {
  id: string;
  benefitSponsor: string;
  sponsorEntity: string;
  sponsorShare: string;
  type: string;
}

interface Benefit {
  benefitName: string;
  benefitProvider: string;
  benefitDescription: string;
  sponsors: SponsorData[];
  status: string;
}
interface BenefitAmountCategory {
  beneficiaryCaste: string;
  beneficiaryType: string;
  beneficiaryCategory: string;
  beneficiaryAmount: number;
}
interface TermsAndCondition {
  academicYear?: boolean;
  failYear?: boolean;
  deadlineDate?: string;
  extendDeadlineDate: string;
  validDate: string;
  renewableApplicable: boolean;
}
interface BenefitPayload {
  RequestInfo: BenefitRequestInfo;
  Benefit: Benefit;
}

interface BenefitAmountCategoryPayload {
  RequestInfo: BenefitRequestInfo;
  Benefit: Benefit;
  BenefitAmountCategory: BenefitAmountCategory[];
}
interface BenefitTermsAndCondition {
  RequestInfo: BenefitRequestInfo;
  Benefit: Benefit;
  TermsAndCondition: TermsAndCondition;
}

interface ViewAllBenefits {
  name: string | null;
  valid_till: string | null;
  created_start: string | null;
  created_end: string | null;
  status: string;
  page_no: number;
  page_size: number;
  sort_by: string;
  sort_order: string;
}
interface PrefillData {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  class: string;
  annualIncome: string;
  caste: string;
  disabled: string;
  state: string;
  student: string;
  identityProof: string | null;
}
export const createBenefitForm = async (payload: BenefitPayload) => {
  try {
    const response = await axios.post(`${apiUrl}/benefits/v1/_create`, payload);
    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
export const updateForm = async (
  payload:
    | BenefitPayload
    | BenefitAmountCategoryPayload
    | BenefitTermsAndCondition
) => {
  try {
    const response = await axios.post(`${apiUrl}/benefits/v1/_update`, payload);
    console.log(response.data);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const viewAllBenefitsData = async (payload: ViewAllBenefits) => {
  try {
    const response = await axios.post(`${apiUrl}/benefits/v1/_search`, payload);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const viewAllApplicationByBenefitId = async (id: string) => {
  try {
    const payload = {
      benefitId: id,
    };
    const response = await axios.post(
      `${apiUrl}/benefits/v1/getApplicationsByBenefitId`,
      payload
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const viewApplicationByApplicationId = async (id: string) => {
  try {
    const payload = {
      applicationId: id,
    };
    const response = await axios.post(
      `${apiUrl}/application/v1/getByApplicationId`,
      payload
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const submitForm = async (payload: PrefillData) => {
  try {
    const response = await axios.post(
      `${initAPI}/api/application-init`,
      payload
    );
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};
export const getSchema = async (id: string) => {
  const payload = {
    context: {
      domain: "onest:financial-support",
      action: "select",
      timestamp: "2023-08-02T07:21:58.448Z",
      ttl: "PT10M",
      version: "1.1.0",
      bap_id: import.meta.env.VITE_BAP_ID,
      bap_uri: import.meta.env.VITE_BAP_URI,
      bpp_id: import.meta.env.VITE_BPP_ID,
      bpp_uri: import.meta.env.VITE_BPP_URI,
      transaction_id: generateUUID(),
      message_id: generateUUID(),
    },
    message: {
      order: {
        items: [
          {
            id: id,
          },
        ],
        provider: {
          id: id,
        },
      },
    },
  };
  try {
    const response = await axios.post(`${schemaAPI}/api/select`, payload);
    return response?.data;
  } catch (error) {
    console.log(error);
  }
};

export const getBenefitList = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_CATALOG_PROVIDER_API_URL}/benefits?populate=*`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${
            import.meta.env.VITE_CATALOG_PROVIDER_TOKEN
          }`,
        },
      }
    );

    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching benefits:", error);
  }
};
