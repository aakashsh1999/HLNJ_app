import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";

const EventCard = ({ event }) => {
  return (
    <TouchableOpacity key={event.id} style={styles.card} activeOpacity={0.7}>
      <View style={styles.row}>
        <Clock size={20} color="#4F46E5" /> {/* Indigo-600 */}
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{event.title}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB", // Gray-200
    borderRadius: 8,
    marginBottom: 8,
    transition: "border-color 0.2s", // Not supported in RN, but can use Animated API if needed
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827", // Gray-900
  },
  time: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4F46E5", // Indigo-600
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280", // Gray-500
  },
});

export default EventCard;
