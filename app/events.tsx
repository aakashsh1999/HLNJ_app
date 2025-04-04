import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { createClient } from "@supabase/supabase-js";
import BirthdayCalendar from "@/components/card/Calender";
import { SafeAreaView } from "react-native-safe-area-context";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

interface Event {
  name: string;
  type: "birthday" | "anniversary";
}

interface Day {
  date: Date;
  key: string;
  events: Event[];
}

const generateDays = (start: Date, count: number): Day[] => {
  return Array.from({ length: count }).map((_, index) => {
    const date = addDays(start, index);
    return {
      date,
      key: date.toISOString(),
      events: [],
    };
  });
};

const getRecurringDate = (originalDate: Date, targetYear: number): Date => {
  const date = new Date(originalDate);
  date.setFullYear(targetYear);
  return date;
};

export default function HomeScreen() {
  const today = new Date();
  const initialDaysCount = 30;
  const startDate = addDays(today, -5);

  const [days, setDays] = useState<Day[]>(() =>
    generateDays(startDate, initialDaysCount)
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const extractRelevantDates = (user: any) => {
    const dates: {
      date: Date;
      name: string;
      type: "birthday" | "anniversary";
    }[] = [];
    try {
      console.log("ruunninga", user);
      // Add user's birthday
      if (user.dob) {
        dates.push({
          date: new Date(user.dob),
          name: `${user.name}'s Birthday`,
          type: "birthday",
        });
      }

      // Add spouse's birthday
      if (user.spouseDob && user.spouseName) {
        dates.push({
          date: new Date(user.spouseDob),
          name: `${user.spouseName}'s Birthday`,
          type: "birthday",
        });
      }

      // Add father's birthday
      if (user.fatherDob && user.fatherName) {
        dates.push({
          date: new Date(user.fatherDob),
          name: `${user.fatherName}'s Birthday`,
          type: "birthday",
        });
      }

      // Add mother's birthday
      if (user.motherDob && user.motherName) {
        dates.push({
          date: new Date(user.motherDob),
          name: `${user.motherName}'s Birthday`,
          type: "birthday",
        });
      }

      // Add children's birthdays
      if (Array.isArray(user.children)) {
        user.children?.forEach((child: any) => {
          if (child?.dob && child.name) {
            dates.push({
              date: new Date(child?.dob),
              name: `${child.name}'s Birthday`,
              type: "birthday",
            });
          }
        });
      }

      // Add anniversary if married
      if (user.marriageStatus === "Married" && user.anniversary) {
        dates.push({
          date: new Date(user.anniversary),
          name: `${user.name}'s Anniversary`,
          type: "anniversary",
        });
      }

      return dates;
    } catch (er) {
      console.log(er);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("user-info")
        .select("*")
        .range(0, 100);

      if (error) throw error;

      const eventsMap = new Map<string, Event[]>();

      data?.forEach((user) => {
        const allDates = extractRelevantDates(user);
        console.log(allDates, "adsfdsf");

        allDates.forEach(({ date, name, type }) => {
          // Get all years from start date to end of current list
          const years = Array.from(
            new Set(days.map((day) => day.date.getFullYear()))
          );

          years.forEach((year) => {
            const recurringDate = getRecurringDate(date, year);
            const dateKey = recurringDate.toISOString().split("T")[0];

            if (!eventsMap.has(dateKey)) {
              eventsMap.set(dateKey, []);
            }
            eventsMap.get(dateKey)?.push({ name, type });
          });
        });
      });

      setDays((prevDays) =>
        prevDays.map((day) => {
          const dayKey = day.date.toISOString().split("T")[0];
          return {
            ...day,
            events: eventsMap.get(dayKey) || [],
          };
        })
      );
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <BirthdayCalendar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  itemContainer: {
    backgroundColor: "#fff",
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  mainDateText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  yearText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  eventsContainer: {
    gap: 8,
  },
  eventItem: {
    padding: 12,
    borderRadius: 8,
  },
  eventItemText: {
    fontSize: 15,
    fontWeight: "500",
  },
  noEventText: {
    fontSize: 15,
    color: "#9e9e9e",
    fontStyle: "italic",
  },
});
