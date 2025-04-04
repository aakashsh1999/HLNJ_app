import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface FormStepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const FormStepIndicator = ({
  steps,
  currentStep,
  onStepClick,
}: FormStepIndicatorProps) => {
  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <TouchableOpacity
            style={styles.stepContainer}
            onPress={() => {
              if (index < currentStep && onStepClick) {
                onStepClick(index);
              }
            }}
            disabled={index >= currentStep}
          >
            <View
              style={[
                styles.circle,
                index < currentStep
                  ? styles.completedStep
                  : index === currentStep
                  ? styles.activeStep
                  : styles.inactiveStep,
              ]}
            >
              <Text
                style={
                  index < currentStep
                    ? styles.completedText
                    : styles.inactiveText
                }
              >
                {index + 1}
              </Text>
            </View>
            <Text
              style={[
                styles.stepText,
                index <= currentStep ? styles.activeText : styles.inactiveText,
              ]}
            >
              {step}
            </Text>
          </TouchableOpacity>

          {index < steps.length - 1 && (
            <View
              style={[
                styles.connector,
                index < currentStep
                  ? styles.completedLine
                  : styles.inactiveLine,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  stepContainer: {
    alignItems: "center",
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  completedStep: {
    backgroundColor: "#007AFF",
  },
  activeStep: {
    backgroundColor: "#FFF",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  inactiveStep: {
    backgroundColor: "#E0E0E0",
  },
  completedText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  inactiveText: {
    color: "#A0A0A0",
  },
  activeText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 12,
    textAlign: "center",
  },
  connector: {
    flex: 1,
    height: 2,
    marginBottom: 16,
    marginRight: 10,
  },
  completedLine: {
    backgroundColor: "#007AFF",
  },
  inactiveLine: {
    backgroundColor: "#E0E0E0",
  },
});

export default FormStepIndicator;
