import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface FormCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FormCard = ({ title, description, children }: FormCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {title && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
        )}
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 30,
    backgroundColor: "white",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E88E5",
    fontFamily: "Poppins",
  },
  description: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
    fontFamily: "Poppins",
  },
});

export default FormCard;
