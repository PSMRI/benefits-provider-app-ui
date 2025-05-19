import { JSONSchema7 } from "json-schema";

// Define the structure for application form fields
interface ApplicationFormField {
  type: string;
  name: string;
  label: string;
  required: boolean;
  options?: { value: string; label: string }[];
  multiple?: boolean;
}

// Define the structure for document objects
interface Doc {
  doc_data: string;
  doc_datatype: string;
  doc_id: string;
  doc_name: string;
  doc_path: string;
  doc_subtype: string;
  doc_type: string;
  doc_verified: boolean;
  imported_from: string;
  is_uploaded: boolean;
  uploaded_at: string;
  user_id: string;
}

// Define the structure for eligibility items
interface EligItem {
  allowedProofs: string[];
  criteria: { name: string };
  isRequired?: boolean;
}

// Convert application form fields to RJSF schema
export const convertApplicationFormFields = (
  applicationForm: ApplicationFormField[]
) => {
  // Initialize the RJSF schema object
  const rjsfSchema: any = {
    title: "",
    type: "object",
    properties: {},
  };

  // Iterate over each application form field and build its schema
  applicationForm.forEach((field) => {
    // Build the schema for each field
    let fieldSchema: any = {
      type: "string",
      title: field.label,
    };

    // Handle specific field validations
    if (field.name === "bankAccountNumber") {
      fieldSchema.minLength = 9;
      fieldSchema.maxLength = 18;
      fieldSchema.pattern = "^[0-9]+$";
    } else if (field.name === "bankIfscCode") {
      fieldSchema.pattern = "^[A-Z]{4}0[A-Z0-9]{6}$";
      fieldSchema.title = field.label || "Enter valid IFSC code";
    }

    // Handle radio/select fields with options
    if (field.type === "radio" || field.type === "select") {
      fieldSchema.enum = field.options?.map((option) => option.value);
      fieldSchema.enumNames = field.options?.map((option) => option.label);
    }

    // Mark field as required if applicable
    if (field.required) {
      fieldSchema.required = true;
    }

    // Add the field schema to the properties
    rjsfSchema.properties[field.name] = fieldSchema;
  });

  return rjsfSchema;
};

// Helper function to create enum values and names from documents
const createDocumentEnums = (docs: Doc[]): [string[], string[]] => {
  if (!docs || docs.length === 0) return [[], []];

  return docs.reduce(
    ([values, names]: [string[], string[]], doc: Doc): [string[], string[]] => {
      values.push(doc.doc_data);
      names.push(doc.doc_subtype);
      return [values, names];
    },
    [[], []]
  );
};

// Helper function to create a document field schema
const createDocumentFieldSchema = (
  title: string,
  isRequired: boolean,
  enumValues: string[],
  enumNames: string[],
  isProofType?: string
): any => {
  // For income proof documents, ensure we label it clearly as income proof
  if (isProofType === "income") {
    title = title.includes("income proof") ? title : `${title} (Income Proof)`;
  }

  return {
    type: "string",
    title,
    required: isRequired,
    enum: enumValues.length > 0 ? enumValues : [""],
    enumNames: enumNames || [],
    default: enumValues[0] || "",
  };
};

// Helper function to filter documents by proof types
const filterDocsByProofs = (docs: Doc[], proofs: string[]): Doc[] => {
  return docs?.filter((doc: Doc) => proofs.includes(doc.doc_subtype)) || [];
};

// Convert eligibility and document fields to RJSF schema
export const convertDocumentFields = (
  schemaArr: any[],
  userDocs: Doc[]
): JSONSchema7 => {
  // Initialize the RJSF schema object for documents
  const schema: any = {
    type: "object",
    properties: {},
  };

  // Track required fields for the root schema
  const requiredFields: string[] = [];

  // Separate eligibility and required-docs (mandatory/optional)
  const eligibilityArr = schemaArr.filter(
    (item) => item.criteria && item.allowedProofs
  );
  const requiredDocsArr = schemaArr.filter(
    (item) => !item.criteria && item.allowedProofs
  );

  // Build sets for optional-docs and mandatory-docs for quick lookup
  const optionalDocsProofs = new Set<string>();
  const mandatoryDocsProofs = new Set<string>();

  requiredDocsArr.forEach((doc) => {
    if (!Array.isArray(doc.allowedProofs)) return;

    const targetSet =
      doc.isRequired === true ? mandatoryDocsProofs : optionalDocsProofs;
    doc.allowedProofs.forEach((proof: string) => targetSet.add(proof));
  });

  // Group eligibility criteria by their allowedProofs set
  const eligProofGroups: Record<
    string,
    { criteriaNames: string[]; allowedProofs: string[]; eligs: EligItem[] }
  > = {};

  eligibilityArr.forEach((elig) => {
    const { allowedProofs, criteria } = elig;
    if (!Array.isArray(allowedProofs) || !criteria?.name) return;

    // Use sorted allowedProofs as key for grouping
    const key = JSON.stringify([...allowedProofs].sort());
    if (!eligProofGroups[key]) {
      eligProofGroups[key] = { criteriaNames: [], allowedProofs, eligs: [] };
    }
    eligProofGroups[key].criteriaNames.push(criteria.name);
    eligProofGroups[key].eligs.push(elig);
  });

  // Debug: log the eligibility proof groups
  console.log("eligProofGroups", eligProofGroups);

  // Render grouped eligibility fields
  Object.values(eligProofGroups).forEach((group) => {
    const { criteriaNames, allowedProofs, eligs } = group;

    // Check if all allowedProofs are present as either optional-doc or mandatory-doc
    const allPresent = allowedProofs.every(
      (proof: string) =>
        optionalDocsProofs.has(proof) || mandatoryDocsProofs.has(proof)
    );

    // Find matching documents for these proofs
    const matchingDocs = filterDocsByProofs(userDocs, allowedProofs);
    const [enumValues, enumNames] = createDocumentEnums(matchingDocs);

    // Use / as separator for allowedProofs in the label
    const allowedProofsLabel = allowedProofs.join(" / ");

    // If all allowedProofs are present in required-docs, render as required single select
    if (allPresent && criteriaNames.length > 0) {
      // If only one criterion in the group, use its name as the field name
      // If multiple, join names, and always use _doc suffix for document select fields
      const fieldName =
        (criteriaNames.length === 1
          ? criteriaNames[0]
          : criteriaNames.join("_")) + "_doc";

      const fieldLabel = `Choose document for ${criteriaNames.join(
        ", "
      )} (${allowedProofsLabel})`;

      console.log("fieldLabel", fieldLabel);

      schema.properties![fieldName] = createDocumentFieldSchema(
        fieldLabel,
        true,
        enumValues,
        enumNames
      );

      requiredFields.push(fieldName);
    } else {
      // Fallback: for each eligibility criterion
      eligs.forEach((elig) => {
        const { allowedProofs, criteria } = elig;

        if (allowedProofs.length > 1) {
          // Render a single select for all allowedProofs for this criterion
          const matchingDocs = filterDocsByProofs(userDocs, allowedProofs);
          const [enumValues, enumNames] = createDocumentEnums(matchingDocs);
          const allowedProofsLabel = allowedProofs.join(" / ");

          schema.properties![`${criteria.name}_doc`] =
            createDocumentFieldSchema(
              `Choose document for ${criteria.name} (${allowedProofsLabel})`,
              true,
              enumValues,
              enumNames
            );

          requiredFields.push(`${criteria.name}_doc`);
        } else {
          // Only one allowedProof, render as before
          allowedProofs.forEach((proof: string) => {
            const proofDocs = filterDocsByProofs(userDocs, [proof]);
            const [proofEnumValues, proofEnumNames] =
              createDocumentEnums(proofDocs);

            schema.properties![`${criteria.name}_${proof}_doc`] =
              createDocumentFieldSchema(
                `Choose document for ${criteria.name} (${proof})`,
                true,
                proofEnumValues,
                proofEnumNames
              );

            requiredFields.push(`${criteria.name}_${proof}_doc`);
          });
        }
      });
    }
  });

  // Add required-docs (mandatory/optional) that are not already handled
  const sortedRequiredDocsArr = [...requiredDocsArr].sort(
    (a, b) => Number(b.isRequired) - Number(a.isRequired)
  );

  sortedRequiredDocsArr.forEach((doc) => {
    if (!Array.isArray(doc.allowedProofs)) return;

    doc.allowedProofs.forEach((proof: string) => {
      // Check if this proof should be shown as a separate document field
      let showAsSeparateDocField = Object.values(eligProofGroups).some(
        (group) =>
          group.allowedProofs.length > 1 && group.allowedProofs.includes(proof)
      );

      // If not mandatory, or not in eligibility, skip if already handled
      if (!showAsSeparateDocField) {
        const alreadyHandled = Object.values(eligProofGroups).some((group) =>
          group.allowedProofs.includes(proof)
        );
        if (alreadyHandled) return;
      }

      // Prepare select options from userDocs for this proof
      const proofDocs = filterDocsByProofs(userDocs, [proof]);
      const [enumValues, enumNames] = createDocumentEnums(proofDocs);

      schema.properties![proof] = createDocumentFieldSchema(
        `Choose ${proof}`,
        !!doc.isRequired,
        enumValues,
        enumNames
      );

      if (doc.isRequired) requiredFields.push(proof);
    });
  });

  // Set the required fields at the root of the schema
  schema.required = requiredFields;

  return schema;
};
