import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import { handleSubmitToSupabase } from "@/utils/supbase"; // Assuming this path is correct
import { Toast, ALERT_TYPE } from "react-native-alert-notification";
import Icon from '@expo/vector-icons/Feather'

import Header from "../Header"; // Assuming this path is correct
import { useRouter } from "expo-router";

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

  const router = useRouter()

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
       <View style={styles.header}>
              <Image
                style={styles.image}
                source={require("../../assets/images/logo.jpg")}
              />
            </View>
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcome}>Welcome</Text>
              <TouchableOpacity
                onPress={() => router.push("/events")}
                style={{
                  backgroundColor: "#FFFFFB",
                  elevation: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  padding: 8,
                }}
              >
                <Icon name="calendar" color={"#FF6B6C"} size={25}/>
              </TouchableOpacity>
            </View>
      
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
          <Icon name="calendar" color={"#333"} size={25} />
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
              <Icon name="calendar" color={"#333"}size={25}/>
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
              <Icon name="calendar" color={"#333"} size={25} />
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
                      <Icon name="trash" color={"white"} size={25} />
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
                    <Icon name="calendar" color={"#333"} size={25} />
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
              <Icon name="plus" color={"white"} size={25} />
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
              <Icon name="calendar" color={"#333"} size={25} />
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
              <Icon name="calendar" color={"#333"} size={25} />
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
    marginVertical: 16,
    fontFamily: "Poppins",
  },
  header: {
    width: "100%",
    position: "relative",
    marginTop: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  image: {
    width: 200,
    height: 100,
    alignSelf: "center",
    marginVertical: "auto",
  },
  welcomeContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },
});

export default PersonalDetailsForm;
