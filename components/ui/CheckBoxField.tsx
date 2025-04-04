import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useField } from "formik";
import { Checkbox } from "react-native-paper";

interface CheckboxFieldProps {
  label: string;
  name: string;
  disabled?: boolean;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, ...props }) => {
  const [field, meta, helpers] = useField({ ...props, type: "checkbox" });
  const hasError = meta.touched && meta.error;

  return (
    <View
      style={{ flexDirection: "row", alignItems: "center", marginVertical: 8 }}
    >
      <Checkbox
        status={field.value ? "checked" : "unchecked"}
        onPress={() => helpers.setValue(!field.value)}
        disabled={props.disabled}
      />
      <TouchableOpacity
        onPress={() => helpers.setValue(!field.value)}
        disabled={props.disabled}
      >
        <Text style={{ fontSize: 14, fontWeight: "500" }}>{label}</Text>
      </TouchableOpacity>
      {hasError && (
        <Text style={{ color: "red", fontSize: 12, fontFamily: "Poppins" }}>
          {meta.error}
        </Text>
      )}
    </View>
  );
};

export default CheckboxField;
