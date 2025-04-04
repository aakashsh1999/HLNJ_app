import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import React from "react";

import { CalendarCheck } from "lucide-react-native";

import PersonalDetailsForm from "@/components/card/Form";

function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.image}
          source={require("../assets/images/logo.jpg")}
        />
      </View>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcome}>Welcome</Text>
        <TouchableOpacity
          onPress={() => router.push("/events")}
          style={{
            backgroundColor: "#FFFFFB",
            elevation: 8,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "50%",
            padding: 8,
          }}
        >
          <CalendarCheck color={"#FF6B6C"} width={30} height={30} />
        </TouchableOpacity>
      </View>

      <PersonalDetailsForm />
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  welcome: {
    fontSize: 40,
    marginVertical: 16,
    marginHorizontal: 24,
    fontFamily: "Poppins",
  },
  header: {
    width: "100%",
    position: "relative",
    marginTop: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 30,
    fontFamily: "Poppins",
  },
  formContainer: {
    maxHeight: "80%",
    paddingBottom: 20,
  },
  image: {
    width: 200,
    height: 100,
    alignSelf: "center",
    marginVertical: "auto",
  },
  welcomeContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingRight: 16,
  },
});
