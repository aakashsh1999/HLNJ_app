import React, { useState } from "react";
import { View, Text } from "react-native";
import { TextInput, Menu } from "react-native-paper";
import { useFormikContext } from "formik";

const SelectField = ({ label, name, options }) => {
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TextInput
            label={label}
            value={
              options.find((opt) => opt.value === values[name])?.label || ""
            }
            onFocus={() => setVisible(true)}
            editable={false}
            right={
              <TextInput.Icon
                icon="menu-down"
                onPress={() => setVisible(true)}
              />
            }
            error={touched[name] && errors[name] ? true : false}
          />
        }
      >
        {options.map((option) => (
          <Menu.Item
            key={option.value}
            title={option.label}
            onPress={() => {
              setFieldValue(name, option.value);
              setVisible(false);
            }}
          />
        ))}
      </Menu>

      {touched[name] && errors[name] && (
        <Text style={{ color: "red", fontFamily: "Poppins" }}>
          {errors[name]}
        </Text>
      )}
    </View>
  );
};

export default SelectField;
