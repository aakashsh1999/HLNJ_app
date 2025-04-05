import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from '@expo/vector-icons/Feather'

const DatePickerComponent = ({ initialDate, onDateSelected, title }) => {
  const [date, setDate] = useState(initialDate);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const toggleDatePicker = () => {
    setDatePickerVisible(!datePickerVisible);
  };

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    setDatePickerVisible(false);
    onDateSelected(selectedDate); // Pass the selected date back to the parent
  };

  return (
    <View>
      {title && (
        <Text
          style={{
            fontSize: 14,
            marginBottom: 10,
            color: "gray",
            fontFamily: "Poppins",
          }}
        >
          {title}
        </Text>
      )}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 8,
          padding: 10,
          borderWidth: 1,
          borderColor: "#D3D3D3",
        }}
      >
        {date ? (
          <Text>{date?.toLocaleDateString()}</Text>
        ) : (
          <Text>No Date Selected</Text>
        )}
        <TouchableOpacity onPress={toggleDatePicker}>
          <Icon name='calendar' color={"black"} />
        </TouchableOpacity>
        <DateTimePickerModal
          date={date}
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={() => setDatePickerVisible(false)}
        />
      </View>
    </View>
  );
};

export default DatePickerComponent;
