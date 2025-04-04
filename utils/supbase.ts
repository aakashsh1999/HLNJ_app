import { createClient } from "@supabase/supabase-js";
import { Alert } from "react-native";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handleSubmitToSupabase = async (values) => {
  console.log(supabaseUrl, supabaseKey, "afdafdsf");

  try {
    const { data, error } = await supabase
      .from("user-info") // Replace with your table name
      .insert([
        { user_data: values }, // Assuming you have a 'registration_data' JSONB column
      ]);

    if (error) {
      console.error("Error inserting data:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to submit data. Please try again.",
      });
    } else {
      console.log("Data inserted successfully:", data);
      // Optionally, you can navigate the user or reset the form here
    }
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    Toast.show({
      type: ALERT_TYPE.DANGER,
      title: "Error",
      textBody: "Unexpected Error. Please try again.",
    });
  }
};
