export type Relationship =
  | "Father"
  | "Mother"
  | "Guardian"
  | "Spouse"
  | "Child"
  | "Parent"
  | "Sibling"
  | "Other";

export type Gender = "Male" | "Female" | "Other";

export type OccasionType =
  | "Birthday"
  | "Anniversary"
  | "Wedding Anniversary"
  | "Graduation"
  | "Religious Festival"
  | "Other";

export interface AddressDetails {
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface FamilyHead {
  name: string;
  relationship: Relationship;
  email: string;
  mobileNumber: string;
  alternateMobileNumber?: string;
  address: AddressDetails;
  occasions: {
    name: string;
    date: string;
    description: string; // Added description field
  }[];
}

export interface FamilyMember {
  id: string; // For uniquely identifying each member
  name: string;
  relationshipToHead: Relationship;
  dateOfBirth: Date | null;
  age: number | null;
  gender: Gender;

  occasions: {
    name: string;
    date: string;
    description: string; // Added description field
  }[];
}

export interface Child {
  id: string; // For uniquely identifying each child
  name: string;
  dateOfBirth: Date | null;
  age: number | null;
  gender: Gender;
  school?: string;
  grade?: string;
}

export interface Occasion {
  id: string; // For uniquely identifying each occasion
  type: OccasionType;
  personName: string;
  date: Date | null;
  description?: string;
}

export interface AdditionalInfo {
  details: string;
}

export interface FamilyForm {
  familyHead: FamilyHead;
  familyMembers: FamilyMember[];
  children: Child[];
  occasions: Occasion[];
  additionalInfo?: AdditionalInfo;
}
