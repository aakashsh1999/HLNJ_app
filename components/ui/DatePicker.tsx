import React, { useState } from "react";
import { View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput } from "react-native-paper";
import { useFormikContext } from "formik";

const DatePicker = ({ label, name }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const [show, setShow] = useState(false);
  const [date, setDate] = useState(
    values[name] ? new Date(values[name]) : new Date()
  );

  const onChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setFieldValue(name, selectedDate.toISOString().split("T")[0]); // Save as YYYY-MM-DD
    }
  };

  return (
    <View>
      <TextInput
        label={label}
        value={values[name]}
        onFocus={() => setShow(true)}
        editable={false}
        right={<TextInput.Icon icon="calendar" onPress={() => setShow(true)} />}
        error={touched[name] && errors[name] ? true : false}
      />
      {touched[name] && errors[name] && (
        <Text style={{ color: "red", fontFamily: "Poppins" }}>
          {errors[name]}
        </Text>
      )}

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePicker;
