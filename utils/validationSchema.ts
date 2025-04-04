import * as Yup from "yup";

export const familyHeadSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),

  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),

  mobileNumber: Yup.string()
    .required("Mobile number is required")
    .matches(/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"),

  alternateMobileNumber: Yup.string()
    .matches(/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number")
    .nullable(),

  address: Yup.object().shape({
    houseNumber: Yup.string().required("House number is required"),
    street: Yup.string().required("Street is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postalCode: Yup.string().required("Postal code is required"),
    country: Yup.string().required("Country is required"),
  }),

  occasions: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Occasion name is required"),
      date: Yup.string().required("Date is required"),
      description: Yup.string(),
    })
  ),
});

export const familyMemberSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),

  relationshipToHead: Yup.string().required("Relationship is required"),

  dateOfBirth: Yup.date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),

  gender: Yup.string()
    .required("Gender is required")
    .oneOf(["Male", "Female", "Other"], "Invalid gender selection"),

  occasions: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Occasion name is required"),
      date: Yup.string().required("Date is required"),
      description: Yup.string(),
    })
  ),
});

export const occasionSchema = Yup.object().shape({
  name: Yup.string()
    .required("Occasion name is required")
    .min(2, "Name must be at least 2 characters"),

  date: Yup.string().required("Date is required"),

  description: Yup.string(),
});
