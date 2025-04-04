import { FamilyForm } from "@/components/types/types";

const BLOB_STORE_URL = process.env.NEXT_PUBLIC_BLOB_STORE_URL;
const BLOB_READ_WRITE_TOKEN = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;

export const saveFormData = async (formData: FamilyForm): Promise<string> => {
  try {
    const response = await fetch(`${BLOB_STORE_URL}/api/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${BLOB_READ_WRITE_TOKEN}`,
      },
      body: JSON.stringify({
        data: formData,
        filename: `family-data-${Date.now()}.json`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save form data");
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error("Error saving form data:", error);
    throw error;
  }
};

export const getFormData = async (url: string): Promise<FamilyForm> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch form data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching form data:", error);
    throw error;
  }
};
