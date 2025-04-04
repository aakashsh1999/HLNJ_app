import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

interface NavigationButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  isSubmitDisabled?: boolean;
  isLastStep?: boolean;
  isFirstStep?: boolean;
}

const NavigationButtons = ({
  onPrevious,
  onNext,
  onSubmit,
  isPreviousDisabled = false,
  isNextDisabled = false,
  isSubmitDisabled = false,
  isLastStep = false,
  isFirstStep = false,
}: NavigationButtonsProps) => {
  return (
    <View style={styles.container}>
      {!isFirstStep ? (
        <TouchableOpacity
          onPress={onPrevious}
          disabled={isPreviousDisabled}
          style={[
            styles.button,
            styles.previousButton,
            isPreviousDisabled && styles.disabledButton,
          ]}
        >
          <ArrowLeft
            size={16}
            color={isPreviousDisabled ? "#A0A0A0" : "#333"}
          />
          <Text
            style={[
              styles.buttonText,
              isPreviousDisabled && styles.disabledText,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {isLastStep ? (
        <TouchableOpacity
          onPress={onSubmit}
          disabled={isSubmitDisabled}
          style={[
            styles.button,
            styles.submitButton,
            isSubmitDisabled && styles.disabledButton,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              styles.submitText,
              isSubmitDisabled && styles.disabledText,
            ]}
          >
            Submit
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onNext}
          disabled={isNextDisabled}
          style={[
            styles.button,
            styles.nextButton,
            isNextDisabled && styles.disabledButton,
          ]}
        >
          <Text
            style={[styles.buttonText, isNextDisabled && styles.disabledText]}
          >
            Next
          </Text>
          <ArrowRight size={16} color={isNextDisabled ? "#A0A0A0" : "#FFF"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  previousButton: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CCC",
  },
  nextButton: {
    backgroundColor: "#007AFF",
  },
  submitButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    marginHorizontal: 5,
  },
  submitText: {
    color: "#FFF",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#A0A0A0",
  },
  placeholder: {
    width: 100,
  },
});

export default NavigationButtons;
