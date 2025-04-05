import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { format, isToday } from "date-fns";
import { BirthdayEvent } from "../utils/index";
import UUID from "react-native-uuid";
import { Card } from "react-native-paper";
import Icon from '@expo/vector-icons/Feather'

interface CalendarDayProps {
  date: Date;
  events: BirthdayEvent[];
  isToday: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, events }) => {
  const dayName = format(day, "EEEE");
  const dayMonth = format(day, "MMM");
  const date = format(day, "d");
  const year = format(day, "yyyy");

  return (
    <Card
      style={[styles.container, isToday(day) && { backgroundColor: "#E6F7FF" }]}
    >
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins",
                color: "#333",
                fontSize: 30,
              }}
            >
              {date}
            </Text>

            <Text style={styles.dayMonthYear}>{dayMonth}</Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                fontFamily: "Poppins",
              }}
            >
              {dayName}
            </Text>

            {isToday(day) && <Text style={styles.todayLabel}>Today</Text>}
          </View>
        </View>
      </View>

      {events.anniversaries.length === 0 && events.birthdays.length === 0 && (
        <Text style={styles.noEventsText}>No events today</Text>
      )}

      {/* #C6005C */}
      {events.birthdays.length > 0 ? (
        <View style={styles.eventsContainer}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: "Poppins",
                textTransform: "uppercase",
              }}
            >
              Birthdays
            </Text>
          </View>
          {events.birthdays.map((name, index) => (
            <View key={`${index}-${UUID.v4()}`} style={styles.eventItem}>
              <View style={styles.eventDetails}>
                <Icon name="gift" color={"#fff"} size={20}/>

                <Text style={styles.eventName}>{name}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}

      {events.anniversaries.length > 0 ? (
        <View style={[styles.eventsContainer, { marginTop: 10 }]}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontFamily: "Poppins",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Anniversaries
            </Text>
          </View>
          {events.anniversaries.map((name, index) => (
            <View
              key={`${index}-${UUID.v4()}`}
              style={[styles.eventItem, { backgroundColor: "#C6005C" }]}
            >
              <View style={styles.eventDetails}>
                <Icon name="heart" color={"#fff"} size={20} />

                <Text style={styles.eventName}>{name}</Text>
              </View>
            </View>
          ))}
        </View>
      ) : null}


    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#F5F5F5",
    marginVertical: 12,
    borderRadius: 20,
    marginHorizontal: 20,
  },
  todayContainer: {
    backgroundColor: "#E6F7FF",
    borderLeftWidth: 4,
    borderLeftColor: "#1E90FF",
    paddingLeft: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: "row",

    justifyContent: "space-between",
    width: "100%",
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  todayBox: {
    backgroundColor: "#1E90FF",
  },
  defaultBox: {
    backgroundColor: "#F0F0F0",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  monthText: {
    fontSize: 10,
    color: "#666",
    fontFamily: "Poppins",
  },
  dayName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  dayMonthYear: {
    fontSize: 20,
    color: "#666",
    fontFamily: "Poppins",
  },
  todayLabel: {
    backgroundColor: "#1E90FF",
    color: "#FFF",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    marginTop: 6,
    fontWeight: "600",
    fontFamily: "Poppins",
  },
  eventsContainer: {
    marginLeft: 40,
  },
  eventItem: {
    flexDirection: "row",
    padding: 6,
    backgroundColor: "#31A46E",
    borderRadius: 14,
    marginBottom: 12,
    borderColor: "#E5E5E5",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: "#D1D1D1",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  eventDetails: {
    flex: 1,
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    fontFamily: "Poppins",
  },
  eventInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  eventRelation: {
    fontSize: 12,
    color: "#666",
  },
  dot: {
    fontSize: 12,
    color: "#666",
    marginHorizontal: 6,
    fontFamily: "Poppins",
  },
  eventDate: {
    fontSize: 12,
    color: "#666",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  anniversaryBox: {
    backgroundColor: "#F8D7DA",
  },
  birthdayBox: {
    backgroundColor: "#F9E2EC",
  },
  noEvents: {
    paddingVertical: 8,
  },
  noEventsText: {
    fontSize: 16,

    color: "#999",
    fontFamily: "Poppins",
  },
});

export default CalendarDay;
