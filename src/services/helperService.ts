import _ from "lodash";

export const decodeBase64ToJson = (input: string) => {
  try {
    // Step 1: Base64 decode
    const base64Decoded = atob(input);

    // Step 2: URL decode
    const jsonString = decodeURIComponent(base64Decoded);

    // Step 3: Parse JSON
    const jsonData = JSON.parse(jsonString);

    return jsonData;
  } catch (error) {
    console.error("Error decoding and parsing JSON:", error);
    return null;
  }
};

export const isDateString = (value: any): boolean => {
  if (!_.isString(value)) return false;

  const date = new Date(value);
  return !isNaN(date.getTime()) && value.includes("GMT");
};

export const formatDate = (
  value: string,
  options: { withTime?: boolean } = {}
) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return "-";
  const shortDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (options.withTime) {
    const time = date
      .toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
    return `${shortDate}, ${time}`;
  }
  return shortDate;
};

export const convertKeysToTitleCase = (
  obj: Record<string, any>
): Record<string, any> => {
  if (!obj || typeof obj !== "object") return obj;

  const customKeyMappings: Record<string, string> = {
    issuedby: "Attested By",
    issuerauthority: "Attestor Authority",
    issueddate: "Date of Attestation",
    issued_date: "Date of Attestation",
  };

  const toTitleCase = (str: string): string =>
    str
      .replace(/_/g, " ") // Replace underscores with spaces
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const normalizedKey = key.toLowerCase();
    const titleCaseKey =
      customKeyMappings[normalizedKey] ||
      customKeyMappings[key] ||
      toTitleCase(key);
    acc[titleCaseKey] = value;
    return acc;
  }, {} as Record<string, any>);
};

export const formatTitle = (
  documentSubmissionReason: string[] = [],
  documentName: string
) => {
  if (documentSubmissionReason.length === 0) return "";
  const label = documentName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (str) => str.toUpperCase());
  if (documentSubmissionReason.length === 1)
    return `Document for ${documentSubmissionReason[0]} (${label})`;
  return `Document for ${documentSubmissionReason
    .slice(0, -1)
    .join(", ")} and ${documentSubmissionReason.at(-1)} (${label})`;
};
