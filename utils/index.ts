import { FamilyMember, Child, Occasion } from "./types";

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: Date | null): number | null => {
  if (!dateOfBirth) return null;

  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const m = today.getMonth() - dateOfBirth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return age;
};

// List of countries for dropdown
export const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

// List of relationships
export const relationships = [
  "Father",
  "Mother",
  "Guardian",
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Other",
];

// List of occasion types
export const occasionTypes = [
  "Birthday",
  "Anniversary",
  "Wedding Anniversary",
  "Graduation",
  "Religious Festival",
  "Other",
];

// Format date for display
export const formatDate = (date: Date | null): string => {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// import { supabase, User, MOCK_USERS } from "./supabase";
import { addYears, isBefore, isAfter, addDays, subDays } from "date-fns";
import { createClient } from "@supabase/supabase-js";

export async function fetchUsers(): Promise<User[]> {
  try {
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY2;
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Otherwise, fetch from real Supabase
    const { data, error } = await supabase.from("user-info").select("*");
    console.log(data, "adfsadsdfs");
    if (error) {
      console.error("Error fetching users:", error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // Fallback to mock data in case of any error
    // return MOCK_USERS;
  }
}

export type BirthdayEvent = {
  id: string;
  userId: string;
  name: string;
  relation: string;
  date: Date;
  originalDate: Date; // The original birth date
  age: number;
};

export function generateBirthdayEvents(
  users: User[],
  startDate: Date,
  endDate: Date
): BirthdayEvent[] {
  const events: BirthdayEvent[] = [];

  users.forEach((user) => {
    // Process user's own birthday
    if (user.dob) {
      addBirthdayEvent(
        events,
        user.id,
        user.name,
        "Self",
        user.dob,
        startDate,
        endDate
      );
    }

    // Process father's birthday
    if (user.fatherDob && user.fatherName) {
      addBirthdayEvent(
        events,
        user.id,
        user.fatherName,
        "Father",
        user.fatherDob,
        startDate,
        endDate,
        undefined
      );
    }

    // Process mother's birthday
    if (user.motherDob && user.motherName) {
      addBirthdayEvent(
        events,
        user.id,
        user.motherName,
        "Mother",
        user.motherDob,
        startDate,
        endDate,
        undefined
      );
    }

    // Process spouse's birthday
    if (user.spouseDob && user.spouseName) {
      addBirthdayEvent(
        events,
        user.id,
        user.spouseName,
        "Spouse",
        user.spouseDob,
        startDate,
        endDate,
        undefined
      );
    }

    // Process anniversary
    if (user.anniversary && user.marriageStatus === "Married") {
      addAnniversaryEvent(
        events,
        user.id,
        user.name,
        user.spouseName || "",
        user.anniversary,
        startDate,
        endDate
      );
    }
  });

  return events;
}

function addBirthdayEvent(
  events: BirthdayEvent[],
  userId: string,
  name: string,
  relation: string,
  dobString: string,
  startDate: Date,
  endDate: Date,
  avatarUrl?: string
) {
  // Parse the date of birth
  const dobDate = new Date(dobString);

  // Create a date object for comparison that has the year of the startDate
  let nextBirthday = new Date(dobDate);
  nextBirthday.setFullYear(startDate.getFullYear());

  // If the birthday has already passed this year, look at next year
  if (isBefore(nextBirthday, startDate)) {
    nextBirthday.setFullYear(startDate.getFullYear() + 1);
  }

  // Generate birthdays that fall within our range
  while (isBefore(nextBirthday, endDate)) {
    const age = nextBirthday.getFullYear() - dobDate.getFullYear();

    events.push({
      id: `${userId}-${relation}-${nextBirthday.getFullYear()}`,
      userId: userId,
      name: name,
      relation: relation,
      date: new Date(nextBirthday),
      originalDate: new Date(dobDate),
      age,
    });

    // Move to next year's birthday
    nextBirthday = addYears(nextBirthday, 1);
  }
}

function addAnniversaryEvent(
  events: BirthdayEvent[],
  userId: string,
  userName: string,
  spouseName: string,
  anniversaryString: string,
  startDate: Date,
  endDate: Date,
  avatarUrl?: string
) {
  // Parse the anniversary date
  const anniversaryDate = new Date(anniversaryString);

  // Create a date object for comparison that has the year of the startDate
  let nextAnniversary = new Date(anniversaryDate);
  nextAnniversary.setFullYear(startDate.getFullYear());

  // If the anniversary has already passed this year, look at next year
  if (isBefore(nextAnniversary, startDate)) {
    nextAnniversary.setFullYear(startDate.getFullYear() + 1);
  }

  // Generate anniversaries that fall within our range
  while (isBefore(nextAnniversary, endDate)) {
    const years = nextAnniversary.getFullYear() - anniversaryDate.getFullYear();

    events.push({
      id: `${userId}-anniversary-${nextAnniversary.getFullYear()}`,
      userId: userId,
      name: userName + (spouseName ? ` & ${spouseName}` : ""),
      relation: `${years}${getOrdinalSuffix(years)} Anniversary`,
      date: new Date(nextAnniversary),
      originalDate: new Date(anniversaryDate),
      age: years,
    });

    // Move to next year's anniversary
    nextAnniversary = addYears(nextAnniversary, 1);
  }
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10,
    k = num % 100;
  if (j == 1 && k != 11) {
    return "st";
  }
  if (j == 2 && k != 12) {
    return "nd";
  }
  if (j == 3 && k != 13) {
    return "rd";
  }
  return "th";
}

export function getDateRangeWithBuffer(
  currentDate: Date = new Date(),
  pastDays: number = 5,
  futureDays: number = 60
): { startDate: Date; endDate: Date } {
  return {
    startDate: subDays(currentDate, pastDays),
    endDate: addDays(currentDate, futureDays),
  };
}

export function extractDates(persons) {
  let birthdays = {};
  let anniversaries = {};

  persons.forEach((person) => {
    if (person.user_data.dob) {
      const date = person.user_data.dob.slice(5, 10);
      if (!birthdays[date]) birthdays[date] = [];
      birthdays[date].push(person.user_data.name);
    }

    if (person.user_data.spouseDob) {
      const date = person.user_data.spouseDob.slice(5, 10);
      if (!birthdays[date]) birthdays[date] = [];
      birthdays[date].push(person.user_data.spouseName);
    }

    if (person.user_data.anniversary) {
      const date = person.user_data.anniversary.slice(5, 10);
      if (!anniversaries[date]) anniversaries[date] = [];
      anniversaries[date].push(person.user_data.name);
    }

    if (person.user_data.fatherDob) {
      const date = person.user_data.fatherDob.slice(5, 10);
      if (!birthdays[date]) birthdays[date] = [];
      birthdays[date].push(person.user_data.fatherName || "Father");
    }

    if (person.user_data.motherDob) {
      const date = person.user_data.motherDob.slice(5, 10);
      if (!birthdays[date]) birthdays[date] = [];
      birthdays[date].push(person.user_data.motherName || "Mother");
    }

    if (Array.isArray(person.user_data.children)) {
      person.user_data.children.forEach((child) => {
        if (child.dob) {
          const date = child.dob.slice(5, 10);
          if (!birthdays[date]) birthdays[date] = [];
          birthdays[date].push(child.name || "Child");
        }
      });
    }
  });

  return { birthdays, anniversaries };
}

export function convertToCSVOption2(data: any): string {
  console.log("data", data);
  const flatRow: any = {
    name: data.name || "",
    email: data.email || "",
    number: data.number || "",
    dob: data.dob || "",
    fatherName: data.father?.name || "",
    fatherDob: data.father?.dob || "",
    fatherGender: data.father?.gender || "",
    motherName: data.mother?.name || "",
    motherDob: data.mother?.dob || "",
    motherGender: data.mother?.gender || "",
    spouseName: data.spouse?.name || "",
    spouseDob: data.spouse?.dob || "",
    spouseGender: data.spouse?.gender || "",
    anniversary: data.anniversary || "",
    marriageStatus: data.marriageStatus || "",
  };

  // Flatten children
  (data.children || []).forEach((child: any, index: number) => {
    flatRow[`child${index + 1}_name`] = child.name || "";
    flatRow[`child${index + 1}_dob`] = child.dob || "";
    flatRow[`child${index + 1}_gender`] = child.gender || "";
  });

  const headers = Object.keys(flatRow);
  const values = headers.map((key) => `"${flatRow[key]}"`);

  return `${headers.join(",")}\n${values.join(",")}`;
}
