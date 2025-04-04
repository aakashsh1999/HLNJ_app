import React from "react";
import { View, Text, TextInput } from "react-native";
import { useField } from "formik";

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const hasError = meta.touched && meta.error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...field}
        {...props}
        style={[styles.input, hasError && styles.errorInput]}
        placeholder={props.placeholder}
        editable={!props.disabled}
        onChangeText={field.onChange(props.name)}
        onBlur={field.onBlur(props.name)}
      />
      {hasError && <Text style={styles.errorText}>{meta.error}</Text>}
    </View>
  );
};

const styles = {
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333", // Added a default text color
    fontFamily: "Poppins",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    color: "#333", // Added a default text color
    fontFamily: "Poppins",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "Poppins",

    marginTop: 2,
  },
};

export default FormField;
