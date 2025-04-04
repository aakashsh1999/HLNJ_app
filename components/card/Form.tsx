// import React, { useState } from "react";
// import {
//   ScrollView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
// } from "react-native";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { ActivityIndicator, MD2Colors } from "react-native-paper";
// import { Picker } from "@react-native-picker/picker";
// import moment from "moment"; // Still needed for date formatting
// import { handleSubmitToSupabase } from "@/utils/supbase";
// import { Toast, ALERT_TYPE } from "react-native-alert-notification";
// import {
//   Calendar,
//   CalendarCheck,
//   PlusCircleIcon,
//   PlusIcon,
//   TrashIcon,
// } from "lucide-react-native";
// import Header from "../Header";

// // calculateAge function is REMOVED

// // --- Validation Schema: Updated to remove all Age fields ---
// const validationSchema = Yup.object().shape({
//   name: Yup.string().required("Name is required"),
//   email: Yup.string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   number: Yup.string()
//     .matches(/^[0-9]+$/, "Must be only digits")
//     .min(10, "Must be at least 10 digits")
//     .max(15, "Must be at most 15 digits")
//     .required("Phone number is required"),
//   dob: Yup.date()
//     .max(new Date(), "Date of Birth cannot be in the future")
//     .typeError("Invalid date format")
//     .required("Date of Birth is required"),
//   marriageStatus: Yup.string().required("Marriage Status is required"),

//   // --- Spouse Details (No Spouse Age) ---
//   spouseName: Yup.string().when("marriageStatus", {
//     is: "Married",
//     then: (schema) => schema.required("Spouse Name is required"),
//     otherwise: (schema) => schema.nullable(),
//   }),
//   spouseDob: Yup.date().when("marriageStatus", {
//     is: "Married",
//     then: (schema) =>
//       schema
//         .max(new Date(), "Spouse DOB cannot be in the future")
//         .typeError("Invalid date format")
//         .required("Spouse Date of Birth is required"),
//     otherwise: (schema) => schema.nullable(),
//   }),
//   anniversary: Yup.date().when("marriageStatus", {
//     is: "Married",
//     then: (schema) =>
//       schema
//         .max(new Date(), "Anniversary cannot be in the future")
//         .typeError("Invalid date format")
//         .required("Anniversary Date is required"),
//     otherwise: (schema) => schema.nullable(),
//   }),
//   spouseGender: Yup.string().when("marriageStatus", {
//     is: "Married",
//     then: (schema) => schema.required("Spouse Gender is required"),
//     otherwise: (schema) => schema.nullable(),
//   }),
//   // spouseAge validation REMOVED

//   // --- Children Details (No Child Age) ---
//   children: Yup.array()
//     .of(
//       Yup.object().shape({
//         name: Yup.string().required("Child Name is required"),
//         dob: Yup.date()
//           .max(new Date(), "Child DOB cannot be in the future")
//           .typeError("Invalid date format")
//           .required("Child Date of Birth is required"),
//         // age validation REMOVED
//         gender: Yup.string().required("Child Gender is required"),
//       })
//     )
//     .nullable(),

//   // --- Parent Details (No Parent Age) ---
//   fatherName: Yup.string().nullable(),
//   fatherDob: Yup.date()
//     .max(new Date(), "Father's DOB cannot be in the future")
//     .typeError("Invalid date format")
//     .nullable(),
//   // fatherAge validation REMOVED
//   fatherGender: Yup.string().nullable(),
//   motherName: Yup.string().nullable(),
//   motherDob: Yup.date()
//     .max(new Date(), "Mother's DOB cannot be in the future")
//     .typeError("Invalid date format")
//     .nullable(),
//   // motherAge validation REMOVED
//   motherGender: Yup.string().nullable(),
// });

// const PersonalDetailsForm = () => {
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [selectedDateField, setSelectedDateField] = useState("");

//   const [loading, setIsLoading] = useState(false);

//   const formik = useFormik({
//     // --- Initial Values: Updated (removed age fields implicitly) ---
//     initialValues: {
//       name: "",
//       email: "",
//       number: "",
//       dob: null,
//       marriageStatus: "",
//       spouseName: "",
//       spouseDob: null,
//       anniversary: null,
//       spouseGender: "",
//       // spouseAge REMOVED
//       children: [],
//       fatherName: "",
//       fatherDob: null,
//       fatherGender: "",
//       // fatherAge REMOVED
//       motherName: "",
//       motherDob: null,
//       motherGender: "",
//       // motherAge REMOVED
//     },
//     validationSchema: validationSchema, // Use the schema without age fields
//     onSubmit: (values, { resetForm }) => {
//       setIsLoading(true);
//       console.log("Form Submitted:", JSON.stringify(values, null, 2));
//       handleSubmitToSupabase(values);

//       Toast.show({
//         type: ALERT_TYPE.SUCCESS,
//         title: "Success",
//         textBody: "Form Submitted Successfully",
//       });
//       setIsLoading(false);
//       resetForm({
//         name: "",
//         email: "",
//         number: "",
//         dob: null,
//         marriageStatus: "",
//         spouseName: "",
//         spouseDob: null,
//         anniversary: null,
//         spouseGender: "",
//         children: [],
//         fatherName: "",
//         fatherDob: null,
//         fatherGender: "",
//         motherName: "",
//         motherDob: null,
//         motherGender: "",
//       });
//     },
//   });

//   const {
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     values,
//     errors,
//     touched,
//     setFieldValue,
//     setFieldTouched,
//   } = formik;

//   const showDatePicker = (fieldName) => {
//     console.log(`showDatePicker called for: ${fieldName}`);
//     // Log the value before showing if needed for debugging specific DOB fields
//     if (fieldName === "spouseDob") {
//       // Example debug log
//       console.log(`[Before Show Picker] values.spouseDob:`, values.spouseDob);
//     }
//     setSelectedDateField(fieldName);
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//     setSelectedDateField("");
//   };

//   // --- handleConfirm: SIMPLIFIED - Only sets the selected date field ---
//   const handleConfirm = (date) => {
//     const formattedDate = moment(date).toDate(); // Store as Date object
//     console.log(
//       `handleConfirm: Setting ${selectedDateField} to`,
//       formattedDate
//     );
//     // Set ONLY the date field that was selected
//     setFieldValue(selectedDateField, formattedDate);
//     setFieldTouched(selectedDateField, true, false); // Mark as touched
//     hideDatePicker(); // Hide the picker
//   };

//   // Helper to render error messages (no changes needed here)
//   const renderError = (field) => {
//     const fieldParts = field.split(/[\[\].]+/).filter(Boolean);
//     let isTouched = touched;
//     let error = errors;
//     for (const part of fieldParts) {
//       if (isTouched && typeof isTouched === "object")
//         isTouched = isTouched[part];
//       else {
//         isTouched = false;
//         break;
//       }
//       if (error && typeof error === "object") error = error[part];
//       else {
//         error = undefined;
//         break;
//       }
//     }
//     if (isTouched && typeof error === "string") {
//       return <Text style={styles.error}>{error}</Text>;
//     }
//     return null;
//   };

//   // Helper function to get a valid date for the picker's initial display
//   // (Handles null values and prevents the 'Invariant Violation' error)
//   const getPickerInitialDate = () => {
//     const fieldName = selectedDateField;
//     if (!fieldName) return new Date();
//     const currentValue = values[fieldName];
//     if (currentValue instanceof Date && !isNaN(currentValue.getTime())) {
//       return currentValue;
//     }
//     return new Date(); // Default to now if value is null or invalid
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       keyboardShouldPersistTaps="handled"
//       showsVerticalScrollIndicator={false}
//     >
//       <Header
//         title="Member Registration Form"
//         subtitle="Please fill out the form with your family details and yearly occasions"
//       />
//       <View>
//         {/* --- Basic Info --- */}
//         <Text style={styles.label}>Name*</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={handleChange("name")}
//           onBlur={handleBlur("name")}
//           value={values.name}
//           placeholder="Enter your name"
//         />
//         {renderError("name")}

//         <Text style={styles.label}>Email*</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={handleChange("email")}
//           onBlur={handleBlur("email")}
//           value={values.email}
//           keyboardType="email-address"
//           autoCapitalize="none"
//           placeholder="Enter your email"
//         />
//         {renderError("email")}

//         <Text style={styles.label}>Phone Number*</Text>
//         <TextInput
//           style={styles.input}
//           onChangeText={handleChange("number")}
//           onBlur={handleBlur("number")}
//           value={values.number}
//           keyboardType="phone-pad"
//           placeholder="Enter your phone number"
//         />
//         {renderError("number")}

//         <Text style={styles.label}>Date of Birth*</Text>
//         <TouchableOpacity
//           style={styles.datePickerButton}
//           onPress={() => showDatePicker("dob")}
//         >
//           <Text style={styles.datePickerButtonText}>
//             {values.dob
//               ? moment(values.dob).format("DD-MM-YYYY")
//               : "Select Date of Birth"}
//           </Text>
//         </TouchableOpacity>
//         {renderError("dob")}

//         <Text style={styles.label}>Marriage Status*</Text>
//         <View style={styles.pickerContainer}>
//           <Picker
//             selectedValue={values.marriageStatus}
//             onValueChange={(itemValue) => {
//               setFieldValue("marriageStatus", itemValue);
//               // Clear spouse/parent fields when status changes
//               if (itemValue === "Unmarried") {
//                 setFieldValue("spouseName", "");
//                 setFieldValue("spouseDob", null);
//                 setFieldValue("spouseGender", "");
//                 setFieldValue("anniversary", null);
//                 setFieldValue("children", []);
//               } else if (itemValue === "Married") {
//                 setFieldValue("fatherName", "");
//                 setFieldValue("fatherDob", null);
//                 setFieldValue("fatherGender", "");
//                 setFieldValue("motherName", "");
//                 setFieldValue("motherDob", null);
//                 setFieldValue("motherGender", "");
//               }
//             }}
//             onBlur={handleBlur("marriageStatus")}
//           >
//             <Picker.Item
//               label="-- Select Status --"
//               value=""
//               style={{
//                 color: "gray",
//               }}
//             />
//             <Picker.Item label="Married" value="Married" />
//             <Picker.Item label="Unmarried" value="Unmarried" />
//           </Picker>
//         </View>
//         {renderError("marriageStatus")}

//         {/* --- Married Section (No Spouse Age) --- */}
//         {values.marriageStatus === "Married" && (
//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Spouse & Family Details</Text>

//             <Text style={styles.label}>Spouse Name*</Text>
//             <TextInput
//               style={styles.input}
//               onChangeText={handleChange("spouseName")}
//               onBlur={handleBlur("spouseName")}
//               value={values.spouseName}
//               placeholder="Enter your spouse's name"
//             />
//             {renderError("spouseName")}

//             <Text style={styles.label}>Spouse Date of Birth*</Text>
//             <TouchableOpacity
//               style={styles.datePickerButton}
//               onPress={() => showDatePicker("spouseDob")}
//             >
//               <Text style={styles.datePickerButtonText}>
//                 {values.spouseDob
//                   ? moment(values.spouseDob).format("DD-MM-YYYY")
//                   : "Select Spouse DOB"}
//               </Text>
//               <Calendar color={"#333"} width={25} height={25} />
//             </TouchableOpacity>
//             {renderError("spouseDob")}

//             {/* Spouse Age Text Input REMOVED */}

//             <Text style={styles.label}>Anniversary Date*</Text>
//             <TouchableOpacity
//               style={styles.datePickerButton}
//               onPress={() => showDatePicker("anniversary")}
//             >
//               {" "}
//               {/* Corrected onPress */}
//               <Text style={styles.datePickerButtonText}>
//                 {values.anniversary
//                   ? moment(values.anniversary).format("DD-MM-YYYY")
//                   : "Select Anniversary"}
//               </Text>
//               <Calendar color={"#333"} width={25} height={25} />
//             </TouchableOpacity>
//             {renderError("anniversary")}

//             <Text style={styles.label}>Spouse Gender*</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={values.spouseGender}
//                 onValueChange={handleChange("spouseGender")}
//                 onBlur={handleBlur("spouseGender")}
//                 style={{
//                   fontFamily: "Poppins",
//                 }}
//               >
//                 <Picker.Item
//                   label="-- Select Gender --"
//                   value=""
//                   style={{
//                     color: "gray",
//                     fontFamily: "Poppins",
//                   }}
//                 />
//                 <Picker.Item label="Male" value="Male" />
//                 <Picker.Item label="Female" value="Female" />
//                 <Picker.Item label="Other" value="Other" />
//               </Picker>
//             </View>
//             {renderError("spouseGender")}

//             {/* --- Children Section (No Child Age) --- */}
//             <Text style={styles.subLabel}>Children Details</Text>
//             {values.children &&
//               values.children.map((child, index) => (
//                 <View key={index} style={styles.childContainer}>
//                   <View
//                     style={{
//                       flexDirection: "row",
//                       alignItems: "center",
//                       justifyContent: "space-between",
//                     }}
//                   >
//                     <Text style={styles.subLabel}>Child {index + 1}:</Text>
//                     <TouchableOpacity
//                       style={[styles.removeButton, { marginTop: 15 }]}
//                       onPress={() => {
//                         const updatedChildren = [...values.children];
//                         updatedChildren.splice(index, 1);
//                         setFieldValue("children", updatedChildren);
//                       }}
//                     >
//                       <TrashIcon color={"white"} width={20} height={20} />
//                     </TouchableOpacity>
//                   </View>

//                   <Text style={styles.label}>Name*</Text>
//                   <TextInput
//                     style={styles.input}
//                     onChangeText={handleChange(`children[${index}].name`)}
//                     onBlur={handleBlur(`children[${index}].name`)}
//                     value={child.name || ""}
//                     placeholder="Enter your child's name"
//                   />
//                   {renderError(`children[${index}].name`)}

//                   <Text style={styles.label}>Date of Birth*</Text>
//                   <TouchableOpacity
//                     style={styles.datePickerButton}
//                     onPress={() => showDatePicker(`children[${index}].dob`)}
//                   >
//                     <Text style={styles.datePickerButtonText}>
//                       {child.dob
//                         ? moment(child.dob).format("DD-MM-YYYY")
//                         : "Select Child DOB"}
//                     </Text>
//                     <Calendar color={"#333"} width={25} height={25} />
//                   </TouchableOpacity>
//                   {renderError(`children[${index}].dob`)}

//                   {/* Child Age Text Input REMOVED */}

//                   <Text style={styles.label}>Gender*</Text>
//                   <View style={styles.pickerContainer}>
//                     <Picker
//                       selectedValue={child.gender || ""}
//                       onValueChange={handleChange(`children[${index}].gender`)}
//                       onBlur={handleBlur(`children[${index}].gender`)}
//                     >
//                       <Picker.Item label="-- Select Gender --" value="" />
//                       <Picker.Item label="Male" value="Male" />
//                       <Picker.Item label="Female" value="Female" />
//                       <Picker.Item label="Other" value="Other" />
//                     </Picker>
//                   </View>
//                   {renderError(`children[${index}].gender`)}
//                 </View>
//               ))}
//             <TouchableOpacity
//               style={styles.addButton}
//               onPress={() =>
//                 setFieldValue("children", [
//                   ...(values.children || []),
//                   { name: "", dob: null, gender: "" }, // REMOVED age: ""
//                 ])
//               }
//             >
//               <PlusIcon color={"white"} width={24} height={24} />
//             </TouchableOpacity>
//           </View>
//         )}

//         {/* --- Unmarried Section (No Parent Age) --- */}
//         {values.marriageStatus === "Unmarried" && (
//           <View style={styles.sectionContainer}>
//             <Text style={styles.sectionTitle}>Parent Details </Text>
//             <Text style={styles.label}>Father's Name</Text>
//             <TextInput
//               style={styles.input}
//               onChangeText={handleChange("fatherName")}
//               onBlur={handleBlur("fatherName")}
//               value={values.fatherName}
//               placeholder="Enter your father's name"
//             />
//             {renderError("fatherName")}
//             <Text style={styles.label}>Father's Date of Birth</Text>
//             <TouchableOpacity
//               style={styles.datePickerButton}
//               onPress={() => showDatePicker("fatherDob")}
//             >
//               <Text style={styles.datePickerButtonText}>
//                 {values.fatherDob
//                   ? moment(values.fatherDob).format("DD-MM-YYYY")
//                   : "Select Father DOB"}
//               </Text>
//               <Calendar color={"#333"} width={25} height={25} />
//             </TouchableOpacity>
//             {renderError("fatherDob")}

//             {/* Father Age Text Input REMOVED */}

//             <Text style={styles.label}>Father's Gender</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={values.fatherGender}
//                 onValueChange={handleChange("fatherGender")}
//                 onBlur={handleBlur("fatherGender")}
//               >
//                 <Picker.Item label="-- Select Gender --" value="" />
//                 <Picker.Item label="Male" value="Male" />
//                 <Picker.Item label="Female" value="Female" />
//                 <Picker.Item label="Other" value="Other" />
//               </Picker>
//             </View>
//             {renderError("fatherGender")}

//             <Text style={styles.label}>Mother's Name</Text>
//             <TextInput
//               style={styles.input}
//               onChangeText={handleChange("motherName")}
//               onBlur={handleBlur("motherName")}
//               value={values.motherName}
//               placeholder="Enter your mother's name"
//             />
//             {renderError("motherName")}
//             <Text style={styles.label}>Mother's Date of Birth</Text>
//             <TouchableOpacity
//               style={styles.datePickerButton}
//               onPress={() => showDatePicker("motherDob")}
//             >
//               <Text style={styles.datePickerButtonText}>
//                 {values.motherDob
//                   ? moment(values.motherDob).format("DD-MM-YYYY")
//                   : "Select Mother DOB"}
//               </Text>
//               <Calendar color={"#333"} width={25} height={25} />
//             </TouchableOpacity>
//             {renderError("motherDob")}

//             {/* Mother Age Text Input REMOVED */}

//             <Text style={styles.label}>Mother's Gender</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={values.motherGender}
//                 onValueChange={handleChange("motherGender")}
//                 onBlur={handleBlur("motherGender")}
//               >
//                 <Picker.Item label="-- Select Gender --" value="" />
//                 <Picker.Item label="Male" value="Male" />
//                 <Picker.Item label="Female" value="Female" />
//                 <Picker.Item label="Other" value="Other" />
//               </Picker>
//             </View>
//             {renderError("motherGender")}
//           </View>
//         )}

//         {/* --- Submit Button --- */}
//         <TouchableOpacity
//           style={styles.submitButton}
//           onPress={() => handleSubmit()}
//         >
//           {loading === true ? (
//             <ActivityIndicator animating={true} color={MD2Colors.white} />
//           ) : (
//             <Text style={styles.buttonText}>Submit</Text>
//           )}
//         </TouchableOpacity>

//         {/* --- Date Time Picker Modal --- */}
//         {isDatePickerVisible && (
//           <DateTimePickerModal
//             isVisible={isDatePickerVisible}
//             mode="date"
//             date={getPickerInitialDate()} // Use helper to prevent invariant error
//             maximumDate={new Date()}
//             onConfirm={handleConfirm} // Use simplified handler
//             onCancel={hideDatePicker}
//           />
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// // --- Styles (Keep the existing styles) ---
// const styles = StyleSheet.create({
//   // ... styles remain the same
//   container: {
//     flex: 1,
//     paddingTop: 0,
//     // padding: 16,
//     backgroundColor: "white", // Slightly lighter background
//   },
//   label: {
//     fontSize: 15, // Slightly smaller label
//     fontWeight: "600", // Medium weight
//     marginTop: 12, // Consistent spacing
//     marginBottom: 4,
//     color: "#495057", // Darker grey
//     fontFamily: "Poppins",
//   },
//   input: {
//     height: 45, // Slightly taller input
//     borderColor: "#ced4da", // Lighter border
//     borderWidth: 1,
//     borderRadius: 8, // More rounded corners
//     paddingHorizontal: 12, // More horizontal padding
//     backgroundColor: "#fff",
//     fontSize: 16, // Larger font size in input
//     color: "#212529", // Dark text color
//     fontFamily: "Poppins",
//   },
//   error: {
//     color: "#dc3545", // Bootstrap danger color
//     fontSize: 13, // Smaller error text
//     marginTop: 2,
//     marginBottom: 5, // Less margin bottom for errors
//     fontFamily: "Poppins",
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#ced4da",
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     justifyContent: "center", // Center picker text vertically on Android
//     height: Platform.OS === "ios" ? undefined : 45, // Set height for Android consistency
//     fontFamily: "Poppins",
//   },
//   datePickerButton: {
//     height: 45,
//     borderColor: "#ced4da",
//     borderWidth: 1,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     justifyContent: "space-between", // Vertically center text
//     backgroundColor: "#fff",
//     alignItems: "center",
//     marginTop: 5, // Align with input spacing
//     marginBottom: 10,
//     fontFamily: "Poppins",
//     flexDirection: "row",
//   },
//   datePickerButtonText: {
//     fontSize: 16,
//     color: "#495057", // Match placeholder text color if needed
//     fontFamily: "Poppins",
//   },
//   submitButton: {
//     backgroundColor: "#EBC553", // Bootstrap primary color
//     paddingVertical: 14, // More vertical padding
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 25, // More space before submit
//     marginBottom: 30, // Space at the bottom
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 17, // Slightly larger button text
//     fontWeight: "600",
//     fontFamily: "Poppins",
//   },
//   sectionContainer: {
//     marginTop: 20,
//     marginBottom: 15,
//     padding: 15,
//     borderColor: "#e9ecef",
//     borderWidth: 1,
//     borderRadius: 8,
//     backgroundColor: "#ffffff", // White background for sections
//   },
//   sectionTitle: {
//     fontSize: 18,
//     color: "#343a40",
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#dee2e6",
//     paddingBottom: 8,
//     fontFamily: "Poppins",
//     fontWeight: "bold",
//   },
//   childContainer: {
//     marginTop: 10, // More space between children
//     padding: 15, // More padding inside child box
//     borderColor: "#dee2e6", // Lighter border for child container
//     borderWidth: 1,
//     borderRadius: 8,
//     backgroundColor: "#f8f9fa", // Slightly different background for child section
//   },
//   subLabel: {
//     fontSize: 18, // Larger sub-label (e.g., "Child 1")
//     marginTop: 16,
//     fontFamily: "Poppins",
//     color: "#495057",
//     fontWeight: "bold",
//   },
//   addButton: {
//     backgroundColor: "#2B7FFF", // Bootstrap success color
//     padding: 12, // Adjust padding
//     width: 100,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 15, // Consistent spacing
//   },
//   removeButton: {
//     backgroundColor: "#dc3545", // Bootstrap danger color
//     padding: 10, // Smaller padding for remove
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10, // Consistent spacing
//   },
//   welcome: {
//     fontSize: 40,
//     fontFamily: "Poppins",
//   },
// });

// export default PersonalDetailsForm;

import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { handleSubmitToSupabase } from "@/utils/supbase"; // Assuming this path is correct
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import { Calendar, PlusIcon, TrashIcon } from "lucide-react-native";
import Header from "../Header"; // Assuming this path is correct

// --- Validation Schema: Updated - Only Name and Number are required ---
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"), // Kept required
  email: Yup.string().email("Invalid email format").nullable(), // Removed required, made nullable
  number: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be at least 10 digits")
    .max(15, "Must be at most 15 digits")
    .required("Phone number is required"), // Kept required
  dob: Yup.date()
    .max(new Date(), "Date of Birth cannot be in the future")
    .typeError("Invalid date format")
    .nullable(), // Removed required, made nullable
  marriageStatus: Yup.string().nullable(), // Removed required, made nullable

  // --- Spouse Details (All optional) ---
  spouseName: Yup.string().nullable(), // Removed conditional required
  spouseDob: Yup.date()
    .max(new Date(), "Spouse DOB cannot be in the future")
    .typeError("Invalid date format")
    .nullable(), // Removed conditional required
  anniversary: Yup.date()
    .max(new Date(), "Anniversary cannot be in the future")
    .typeError("Invalid date format")
    .nullable(), // Removed conditional required
  spouseGender: Yup.string().nullable(), // Removed conditional required

  // --- Children Details (All optional) ---
  children: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().nullable(), // Removed required
        dob: Yup.date()
          .max(new Date(), "Child DOB cannot be in the future")
          .typeError("Invalid date format")
          .nullable(), // Removed required
        gender: Yup.string().nullable(), // Removed required
      })
    )
    .nullable(),

  // --- Parent Details (Already optional) ---
  fatherName: Yup.string().nullable(),
  fatherDob: Yup.date()
    .max(new Date(), "Father's DOB cannot be in the future")
    .typeError("Invalid date format")
    .nullable(),
  fatherGender: Yup.string().nullable(),
  motherName: Yup.string().nullable(),
  motherDob: Yup.date()
    .max(new Date(), "Mother's DOB cannot be in the future")
    .typeError("Invalid date format")
    .nullable(),
  motherGender: Yup.string().nullable(),
});

const PersonalDetailsForm = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDateField, setSelectedDateField] = useState("");
  const [loading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      number: "",
      dob: null,
      marriageStatus: "",
      spouseName: "",
      spouseDob: null,
      anniversary: null,
      spouseGender: "",
      children: [],
      fatherName: "",
      fatherDob: null,
      fatherGender: "",
      motherName: "",
      motherDob: null,
      motherGender: "",
    },
    validationSchema: validationSchema, // Use the updated schema
    onSubmit: async (values, { resetForm }) => {
      // Make onSubmit async if handleSubmitToSupabase is async
      setIsLoading(true);
      console.log("Form Submitted:", JSON.stringify(values, null, 2));
      try {
        // Assuming handleSubmitToSupabase returns a promise
        await handleSubmitToSupabase(values);
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Form Submitted Successfully",
        });
        resetForm({
          // Reset to initial empty state
          values: {
            name: "",
            email: "",
            number: "",
            dob: null,
            marriageStatus: "",
            spouseName: "",
            spouseDob: null,
            anniversary: null,
            spouseGender: "",
            children: [],
            fatherName: "",
            fatherDob: null,
            fatherGender: "",
            motherName: "",
            motherDob: null,
            motherGender: "",
          },
        });
      } catch (error) {
        console.error("Submission Error:", error);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Failed to submit form. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    touched,
    setFieldValue,
    setFieldTouched, // Keep setFieldTouched
  } = formik;

  const showDatePicker = (fieldName) => {
    setSelectedDateField(fieldName);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setSelectedDateField("");
  };

  const handleConfirm = (date) => {
    const formattedDate = moment(date).toDate(); // Store as Date object
    setFieldValue(selectedDateField, formattedDate);
    // Mark the field as touched *after* setting the value
    // Use setFieldTouched directly from Formik context
    setFieldTouched(selectedDateField, true, false);
    hideDatePicker();
  };

  // Helper to render error messages
  const renderError = (field) => {
    // Improved error lookup for nested fields (like children)
    const fieldParts = field.split(/[\[\].]+/).filter(Boolean);
    let currentTouched = touched;
    let currentError = errors;

    for (const part of fieldParts) {
      if (
        currentTouched &&
        typeof currentTouched === "object" &&
        part in currentTouched
      ) {
        currentTouched = currentTouched[part];
      } else {
        currentTouched = false; // Mark as not touched if path is broken
        break;
      }
      if (
        currentError &&
        typeof currentError === "object" &&
        part in currentError
      ) {
        currentError = currentError[part];
      } else {
        currentError = undefined; // Mark as no error if path is broken
        break;
      }
    }

    // Check if the final level is touched and has a string error
    if (currentTouched && typeof currentError === "string") {
      return <Text style={styles.error}>{currentError}</Text>;
    }
    return null;
  };

  const getPickerInitialDate = () => {
    const fieldName = selectedDateField;
    if (!fieldName) return new Date();

    // Handle nested fields like children[index].dob
    const fieldParts = fieldName.split(/[\[\].]+/).filter(Boolean);
    let currentValue = values;
    try {
      for (const part of fieldParts) {
        if (currentValue === null || typeof currentValue === "undefined") {
          currentValue = null;
          break;
        }
        currentValue = currentValue[part];
      }
    } catch (e) {
      console.error("Error accessing nested date value:", e);
      currentValue = null;
    }

    if (currentValue instanceof Date && !isNaN(currentValue.getTime())) {
      return currentValue;
    }
    return new Date(); // Default to now if value is null or invalid
  };

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Member Registration Form"
        subtitle="Please fill out the form with your family details and yearly occasions"
      />
      <View style={styles.formContent}>
        {/* --- Basic Info --- */}
        {/* Name (Required) */}
        <Text style={styles.label}>Name*</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChange("name")}
          onBlur={handleBlur("name")}
          value={values.name}
          placeholder="Enter your name"
        />
        {renderError("name")}

        <Text style={styles.label}>Phone Number*</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChange("number")}
          onBlur={handleBlur("number")}
          value={values.number}
          keyboardType="phone-pad"
          placeholder="Enter your phone number"
        />
        {renderError("number")}

        {/* Email  */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          value={values.email}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email "
        />
        {renderError("email")}

        {/* Phone Number (Required) */}

        {/* Date of Birth  */}
        <Text style={styles.label}>Date of Birth</Text>
        <TouchableOpacity
          style={styles.datePickerButton}
          onPress={() => showDatePicker("dob")}
        >
          <Text style={styles.datePickerButtonText}>
            {values.dob
              ? moment(values.dob).format("DD-MM-YYYY")
              : "Select Date of Birth "}
          </Text>
          <Calendar color={"#333"} width={25} height={25} />
        </TouchableOpacity>
        {renderError("dob")}

        {/* Marriage Status  */}
        <Text style={styles.label}>Marriage Status</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={values.marriageStatus}
            onValueChange={(itemValue) => {
              setFieldValue("marriageStatus", itemValue);
              // Keep the logic to clear dependent fields if needed
              if (itemValue !== "Married") {
                setFieldValue("spouseName", "");
                setFieldValue("spouseDob", null);
                setFieldValue("spouseGender", "");
                setFieldValue("anniversary", null);
                setFieldValue("children", []);
              }
              if (itemValue !== "Unmarried") {
                setFieldValue("fatherName", "");
                setFieldValue("fatherDob", null);
                setFieldValue("fatherGender", "");
                setFieldValue("motherName", "");
                setFieldValue("motherDob", null);
                setFieldValue("motherGender", "");
              }
            }}
            onBlur={handleBlur("marriageStatus")}
          >
            <Picker.Item
              label="-- Select Status  --"
              value=""
              style={{ color: "gray" }}
            />
            <Picker.Item label="Married" value="Married" />
            <Picker.Item label="Unmarried" value="Unmarried" />
          </Picker>
        </View>
        {renderError("marriageStatus")}

        {/* --- Married Section (All optional) --- */}
        {values.marriageStatus === "Married" && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Spouse & Family Details</Text>

            <Text style={styles.label}>Spouse Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("spouseName")}
              onBlur={handleBlur("spouseName")}
              value={values.spouseName}
              placeholder="Enter spouse's name"
            />
            {renderError("spouseName")}

            <Text style={styles.label}>Spouse Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => showDatePicker("spouseDob")}
            >
              <Text style={styles.datePickerButtonText}>
                {values.spouseDob
                  ? moment(values.spouseDob).format("DD-MM-YYYY")
                  : "Select Spouse DOB"}
              </Text>
              <Calendar color={"#333"} width={25} height={25} />
            </TouchableOpacity>
            {renderError("spouseDob")}

            <Text style={styles.label}>Anniversary Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => showDatePicker("anniversary")}
            >
              <Text style={styles.datePickerButtonText}>
                {values.anniversary
                  ? moment(values.anniversary).format("DD-MM-YYYY")
                  : "Select Anniversary"}
              </Text>
              <Calendar color={"#333"} width={25} height={25} />
            </TouchableOpacity>
            {renderError("anniversary")}

            <Text style={styles.label}>Spouse Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={values.spouseGender}
                onValueChange={handleChange("spouseGender")}
                onBlur={handleBlur("spouseGender")}
              >
                <Picker.Item
                  label="-- Select Gender --"
                  value=""
                  style={{ color: "gray" }}
                />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            {renderError("spouseGender")}

            {/* --- Children Section (All optional) --- */}
            <Text style={styles.subLabel}>Children Details</Text>
            {values.children &&
              values.children.map((child, index) => (
                <View key={index} style={styles.childContainer}>
                  <View style={styles.childHeader}>
                    <Text style={styles.childTitle}>Child {index + 1}</Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => {
                        const updatedChildren = [...values.children];
                        updatedChildren.splice(index, 1);
                        setFieldValue("children", updatedChildren);
                      }}
                    >
                      <TrashIcon color={"white"} width={18} height={18} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange(`children[${index}].name`)}
                    onBlur={handleBlur(`children[${index}].name`)}
                    value={child.name || ""}
                    placeholder="Enter child's name"
                  />
                  {renderError(`children[${index}].name`)}

                  <Text style={styles.label}>Date of Birth</Text>
                  <TouchableOpacity
                    style={styles.datePickerButton}
                    onPress={() => showDatePicker(`children[${index}].dob`)}
                  >
                    <Text style={styles.datePickerButtonText}>
                      {child.dob
                        ? moment(child.dob).format("DD-MM-YYYY")
                        : "Select Child DOB"}
                    </Text>
                    <Calendar color={"#333"} width={25} height={25} />
                  </TouchableOpacity>
                  {renderError(`children[${index}].dob`)}

                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={child.gender || ""}
                      onValueChange={handleChange(`children[${index}].gender`)}
                      onBlur={handleBlur(`children[${index}].gender`)}
                    >
                      <Picker.Item
                        label="-- Select Gender --"
                        value=""
                        style={{ color: "gray" }}
                      />
                      <Picker.Item label="Male" value="Male" />
                      <Picker.Item label="Female" value="Female" />
                      <Picker.Item label="Other" value="Other" />
                    </Picker>
                  </View>
                  {renderError(`children[${index}].gender`)}
                </View>
              ))}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                setFieldValue("children", [
                  ...(values.children || []),
                  { name: "", dob: null, gender: "" },
                ])
              }
            >
              <PlusIcon color={"white"} width={20} height={20} />
              <Text style={styles.addButtonText}>Add Child</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* --- Unmarried Section (All optional) --- */}
        {values.marriageStatus === "Unmarried" && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Parent Details </Text>

            <Text style={styles.label}>Father's Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("fatherName")}
              onBlur={handleBlur("fatherName")}
              value={values.fatherName}
              placeholder="Enter father's name"
            />
            {renderError("fatherName")}

            <Text style={styles.label}>Father's Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => showDatePicker("fatherDob")}
            >
              <Text style={styles.datePickerButtonText}>
                {values.fatherDob
                  ? moment(values.fatherDob).format("DD-MM-YYYY")
                  : "Select Father DOB"}
              </Text>
              <Calendar color={"#333"} width={25} height={25} />
            </TouchableOpacity>
            {renderError("fatherDob")}

            <Text style={styles.label}>Father's Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={values.fatherGender}
                onValueChange={handleChange("fatherGender")}
                onBlur={handleBlur("fatherGender")}
              >
                <Picker.Item
                  label="-- Select Gender --"
                  value=""
                  style={{ color: "gray" }}
                />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            {renderError("fatherGender")}

            <Text style={styles.label}>Mother's Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange("motherName")}
              onBlur={handleBlur("motherName")}
              value={values.motherName}
              placeholder="Enter mother's name"
            />
            {renderError("motherName")}

            <Text style={styles.label}>Mother's Date of Birth</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => showDatePicker("motherDob")}
            >
              <Text style={styles.datePickerButtonText}>
                {values.motherDob
                  ? moment(values.motherDob).format("DD-MM-YYYY")
                  : "Select Mother DOB"}
              </Text>
              <Calendar color={"#333"} width={25} height={25} />
            </TouchableOpacity>
            {renderError("motherDob")}

            <Text style={styles.label}>Mother's Gender</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={values.motherGender}
                onValueChange={handleChange("motherGender")}
                onBlur={handleBlur("motherGender")}
              >
                <Picker.Item
                  label="-- Select Gender --"
                  value=""
                  style={{ color: "gray" }}
                />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>
            {renderError("motherGender")}
          </View>
        )}

        {/* --- Submit Button --- */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.buttonDisabled]} // Add disabled style
          onPress={() => handleSubmit()}
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <ActivityIndicator animating={true} color={MD2Colors.grey800} /> // Darker color when disabled
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>

        {/* --- Date Time Picker Modal --- */}
        {/* Ensure Modal is outside the main View if causing layout issues, but usually fine inside */}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={getPickerInitialDate()}
          maximumDate={new Date()} // Cannot select future dates
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          // Optional: Add styling or props for appearance if needed
        />
      </View>
    </ScrollView>
  );
};

// --- Styles ---
// Added formContent padding and slightly adjusted styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    padding: 16,
    backgroundColor: "white",
  },
  formContent: {
    // padding: 20, // Add padding around the form elements
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
    color: "#495057",
    fontFamily: "Poppins", // Ensure you have this font linked
  },
  input: {
    height: 48, // Slightly taller
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15, // More padding
    backgroundColor: "#fff",
    fontSize: 16,
    color: "#212529",
    fontFamily: "Poppins",
  },
  error: {
    color: "#dc3545",
    fontSize: 13,
    marginTop: 4,
    marginBottom: 6,
    fontFamily: "Poppins",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    backgroundColor: "#fff",
    justifyContent: "center",
    height: 48, // Match input height
    marginTop: 5,
    marginBottom: 10,
    paddingHorizontal: 5, // Add some horizontal padding for picker text
  },
  datePickerButton: {
    height: 48, // Match input height
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: "space-between",
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
    flexDirection: "row",
  },
  datePickerButtonText: {
    fontSize: 16,
    color: "#495057",
    fontFamily: "Poppins",
    flex: 1, // Allow text to take available space
    marginRight: 10, // Space before icon
  },
  submitButton: {
    backgroundColor: "#EBC553",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
    marginBottom: 40, // More space at the bottom
  },
  buttonDisabled: {
    backgroundColor: "#e9ecef", // Lighter color when disabled
  },
  buttonText: {
    color: "#343a40", // Darker text for better contrast on yellow
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  sectionContainer: {
    marginTop: 25, // Increase spacing
    marginBottom: 15,
    padding: 20, // Increase padding
    borderColor: "#dee2e6",
    borderWidth: 1,
    borderRadius: 10, // Slightly more rounded
    backgroundColor: "#ffffff",
  },
  sectionTitle: {
    fontSize: 19, // Slightly larger
    fontWeight: "bold",
    color: "#343a40",
    marginBottom: 18, // More space below title
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
    paddingBottom: 10,
    fontFamily: "Poppins",
  },
  childContainer: {
    marginTop: 15,
    marginBottom: 10,
    padding: 15,
    borderColor: "#e9ecef", // Lighter border
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#f8f9fa", // Subtle background difference
  },
  childHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10, // Space below header
  },
  childTitle: {
    fontSize: 17,
    fontWeight: "600", // Bold title for child section
    color: "#495057",
    fontFamily: "Poppins",
  },
  subLabel: {
    // Re-styled for "Children Details"
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    fontFamily: "Poppins",
    color: "#495057",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#0d6efd", // Bootstrap blue
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row", // Icon and text side-by-side
    marginTop: 15,
    alignSelf: "flex-start", // Don't stretch full width
  },
  addButtonText: {
    color: "#fff",
    marginLeft: 8, // Space between icon and text
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "Poppins",
  },
  removeButton: {
    backgroundColor: "#dc3545",
    padding: 8, // Slightly smaller padding
    borderRadius: 6, // Slightly smaller radius
    alignItems: "center",
    justifyContent: "center",
    // No margin needed as it's positioned by childHeader
  },
  // Welcome style - keep if used elsewhere
  welcome: {
    fontSize: 40,
    fontFamily: "Poppins",
  },
});

export default PersonalDetailsForm;
