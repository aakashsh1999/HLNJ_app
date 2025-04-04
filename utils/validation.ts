import * as Yup from "yup";

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const familyFormSchema = Yup.object().shape({
  // Personal Information
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  mobile: Yup.string()
    .matches(phoneRegExp, "Mobile number is not valid")
    .required("Mobile number is required"),
  dob: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),

  // Marital Status
  maritalStatus: Yup.string()
    .required("Marital status is required")
    .oneOf(["married", "unmarried"], "Invalid marital status"),

  // Spouse information (conditional)
  spouse: Yup.object().when("maritalStatus", {
    is: "married",
    then: () =>
      Yup.object().shape({
        name: Yup.string().required("Spouse name is required"),
        gender: Yup.string()
          .required("Spouse gender is required")
          .oneOf(["male", "female", "other"], "Invalid gender"),
        age: Yup.number()
          .required("Spouse age is required")
          .positive("Age must be positive")
          .integer("Age must be an integer"),
        dob: Yup.date()
          .required("Spouse date of birth is required")
          .max(new Date(), "Date of birth cannot be in the future"),
        anniversary: Yup.date()
          .required("Anniversary is required")
          .max(new Date(), "Anniversary cannot be in the future"),
      }),
    otherwise: () => Yup.object().optional(),
  }),

  // Children information (conditional)
  hasChildren: Yup.boolean().when("maritalStatus", {
    is: "married",
    then: () => Yup.boolean().required("Please specify if you have children"),
    otherwise: () => Yup.boolean().optional(),
  }),

  children: Yup.array().when(["maritalStatus", "hasChildren"], {
    is: (maritalStatus: string, hasChildren: boolean) =>
      maritalStatus === "married" && hasChildren === true,
    then: () =>
      Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required("Child name is required"),
            gender: Yup.string()
              .required("Child gender is required")
              .oneOf(["male", "female", "other"], "Invalid gender"),
            age: Yup.number()
              .required("Child age is required")
              .positive("Age must be positive")
              .integer("Age must be an integer"),
            dob: Yup.date()
              .required("Child date of birth is required")
              .max(new Date(), "Date of birth cannot be in the future"),
          })
        )
        .min(1, "At least one child must be added"),
    otherwise: () => Yup.array().optional(),
  }),

  // Parents information (conditional)
  includeParents: Yup.boolean().when("maritalStatus", {
    is: "unmarried",
    then: () => Yup.boolean().optional(),
    otherwise: () => Yup.boolean().optional(),
  }),

  parents: Yup.array().when(["maritalStatus", "includeParents"], {
    is: (maritalStatus: string, includeParents: boolean) =>
      maritalStatus === "unmarried" && includeParents === true,
    then: () =>
      Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required("Parent name is required"),
          gender: Yup.string()
            .required("Parent gender is required")
            .oneOf(["male", "female", "other"], "Invalid gender"),
          age: Yup.number()
            .required("Parent age is required")
            .positive("Age must be positive")
            .integer("Age must be an integer"),
          dob: Yup.date()
            .required("Parent date of birth is required")
            .max(new Date(), "Date of birth cannot be in the future"),
        })
      ),
    otherwise: () => Yup.array().optional(),
  }),
});
