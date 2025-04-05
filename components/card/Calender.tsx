import React, { useEffect, useState, useRef, useCallback } from "react";
import { format, eachDayOfInterval, subDays, addDays } from "date-fns";
import {
  fetchUsers,
  extractDates,
  convertToCSVOption2,
} from "./../../utils/index";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Button } from "react-native-paper";
import CalendarDay from "../CalenderDay";
import { router, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import Icon from '@expo/vector-icons/Feather'


const formatDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    return format(new Date(dateStr), "dd MMMM yyyy");
  } catch (e) {
    return "";
  }
};

const BirthdayCalendar: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState({});
  const today = new Date();
  const startDate = subDays(today, 5); // 5 days before today
  const [days, setDays] = useState(
    eachDayOfInterval({ start: startDate, end: today })
  );

  function loadMoreDays() {
    const lastDate = days[days.length - 1];
    const newDays = eachDayOfInterval({
      start: addDays(lastDate, 1),
      end: addDays(lastDate, 30),
    });
    setDays([...days, ...newDays]);
  }

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const userData = await fetchUsers();
        const exportedDates = extractDates(userData);
        setEvents(exportedDates);
        setUsers(userData);

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load users:", err);
        setError("Failed to load user data. Please try again later.");
        setIsLoading(false);
      }
    };

    loadUsers();
  }, []);

  function getEventsForDate(date) {
    const formattedDate = format(date, "MM-dd");
    return {
      birthdays: events.birthdays[formattedDate] || [],
      anniversaries: events.anniversaries[formattedDate] || [],
    };
  }

  const router = useRouter();

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Icon name="gift" size={48} color={"#ff0000"} />
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>
          Oops! Something went wrong
        </Text>
        <Text style={{ color: "gray", marginVertical: 8 }}>{error}</Text>
        <Button onPress={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </View>
    );
  }

  const renderItem = ({ item: day }) => {
    const events = getEventsForDate(day);
    return <CalendarDay day={day} events={events} />;
  };

  const generateAndShareExcel = async (data) => {
    try {
      if (!data || data.length === 0) {
        Toast.show({
          type: ALERT_TYPE.WARNING,
          title: "No Data",
          textBody: "Data not found to export!",
        });
        return;
      }
      // Format data into flat records with children expanded
      const formatted = data.map((entry) => {
        const user = entry.user_data;
        const record = {
          Name: user.name || "",
          Email: user.email || "",
          "Phone Number": user.number || "",
          "Date of Birth": formatDate(user.dob) || "",
          "Father's Name": user.fatherName || "",
          "Father's Date of Birth": formatDate(user.fatherDob) || "",
          "Father's Gender": user.fatherGender || "",
          "Mother's Name": user.motherName || "",
          "Mother's Date of Birth": formatDate(user.motherDob) || "",
          "Mother's Gender": user.motherGender || "",
          "Spouse's Name": user.spouseName || "",
          "Spouse's Date of Birth": formatDate(user.spouseDob) || "",
          "Spouse's Gender": user.spouseGender || "",
          Anniversary: formatDate(user.anniversary) || "",
          Marriage_Status: user.marriageStatus || "",
        };

        if (user.children && user.children.length > 0) {
          user.children.forEach((child, idx) => {
            record[`Child${idx + 1}_Name`] = child.name || "";
            record[`Child${idx + 1}_Dob`] = formatDate(child.dob) || "";
            record[`Child${idx + 1}_Gender`] = child.gender || "";
          });
        }

        return record;
      });

      const ws = XLSX.utils.json_to_sheet(formatted);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users");

      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
      const dateString = format(new Date(), "dd-MM-yyyy");
      const uri = `${FileSystem.cacheDirectory}user_data_${dateString}.xlsx`;
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(uri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Download Excel File",
        UTI: "com.microsoft.excel.xlsx",
      });
    } catch (error) {
      console.error("Error generating Excel:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Something went wrong while exporting the file.",
      });
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: "row", gap: 16 }}>
      <View style={{ flex: 1 }}>
        <View style={{ position: "relative" }}>
          <View
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#fff",
              paddingVertical: 16,
              paddingHorizontal: 16,
              zIndex: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => router.push("/")}
                style={{ marginRight: 10 }}
              >
                <Icon name="arrow-left" color={"black"} size={30} />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  fontFamily: "Poppins",
                }}
              >
                Event's Calendar
              </Text>
            </View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#EBC553",
                elevation: 8,
                justifyContent: "center",
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 16,
                marginTop: 10,
                marginRight: 4,
              }}
              disabled={isLoading}
              onPress={() => generateAndShareExcel(users)}
            >
              <Icon name="download"
                color={"#343a40"}
                size={24}
                style={{ marginRight: 10 }}
              />
              <Text style={{ color: "#343a40" }}>Export Data</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: "50%",
              }}
            >
              <View
                style={{
                  borderRadius: 50,
                  borderWidth: 4,
                  borderColor: "#00f",
                  width: 48,
                  height: 48,
                  borderTopWidth: 4,
                }}
              />
            </View>
          ) : (
            <FlatList
              data={days}
              keyExtractor={(item, index) => index.toString()}
              onEndReached={loadMoreDays}
              onEndReachedThreshold={0.5}
              renderItem={renderItem}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default BirthdayCalendar;

const styles = StyleSheet.create({
  monthContainer: {
    padding: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dayContainer: {
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 8,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
  },
  eventText: {
    fontSize: 14,
  },
});
