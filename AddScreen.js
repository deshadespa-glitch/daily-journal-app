import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { db } from "../../firebase"; // ✅ Firestore only
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function AddScreen({ navigation }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null); // ✅ New state for photo

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
      setDate(
        now.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // ✅ Pick image from gallery
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow photo access.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
  if (!comment.trim() && !mood && !image) {
    Alert.alert("Error", "Please add a comment, mood, or photo before saving.");
    return;
  }

  setLoading(true);

  try {
    const now = new Date();

    const newPost = {
      date: now.toLocaleDateString("en-US", { month: "short", day: "numeric" }), // "Sep 3"
      time: now.toLocaleTimeString([], { 
      hour: "2-digit", 
      minute: "2-digit", 
      hour12: true  // ✅ force 12-hour format
    }),
      dateKey: now.toISOString().split("T")[0], // "2025-09-03" ✅ reliable!
      comment,
      mood,
      image: image || null,
      createdAt: Timestamp.fromDate(now),
    };

    await addDoc(collection(db, "journalEntries"), newPost);
    console.log("✅ Added New Post:", newPost);

    Alert.alert("Success", "Your entry has been saved!");

    // ✅ Reset form back to defaults
    setComment("");
    setMood(null);
    setImage(null);

    // ✅ Redirect to HomeScreen
    navigation.navigate("Home");

  } catch (error) {
    console.error("❌ Error saving post:", error);
    Alert.alert("Error", "Failed to save your entry.");
  }

  setLoading(false);
};

  const moods = [
    { name: "happy", icon: "grin-alt", color: "#FFC697" },
    { name: "smiling", icon: "smile", color: "#F7E5B7" },
    { name: "sad", icon: "sad-tear", color: "#F9C5C7" },
    { name: "angry", icon: "angry", color: "#DDC3E3" },
  ];

  const borderAnims = useRef(
    moods.reduce((acc, m) => {
      acc[m.name] = new Animated.Value(2);
      return acc;
    }, {})
  ).current;

  useEffect(() => {
    moods.forEach((m) => {
      Animated.timing(borderAnims[m.name], {
        toValue: mood === m.name ? 12 : 2,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  }, [mood]);

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {time} , {date}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      <Text style={styles.label}>Mood</Text>
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <TouchableOpacity
            key={m.name}
            onPress={() => setMood(m.name)}
            style={styles.moodButton}
          >
            <Animated.View
              style={[
                styles.moodCircle,
                {
                  borderColor: m.color,
                  borderWidth: borderAnims[m.name],
                },
              ]}
            >
              <FontAwesome5 name={m.icon} size={28} color="black" />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ✅ Image Upload Section */}
      <Text style={styles.label}>Photo</Text>
      {image && (
        <Image source={{ uri: image }} style={styles.previewImage} />
      )}
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>
          {image ? "Change Photo" : "Add Photo"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.5 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>{loading ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flex: 1 },
  container: { padding: 20, backgroundColor: "#F7F4EA" }, // ✅ Cream background
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#F7F4EA", // ✅ Consistent cream header
    padding: 10,
    borderRadius: 10,
    marginTop: 50,
  },
  dateText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  label: { fontSize: 20, marginVertical: 10, fontWeight: "bold", color: "#A8BBA3" }, // ✅ Sage green for labels
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    backgroundColor: "#F7F4EA",
    borderRadius: 10,
    paddingVertical: 10,
  },
  moodButton: { padding: 5 },
  moodCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7F4EA",
    elevation: 2,
  },
  previewImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  photoButton: {
    backgroundColor: "#EBD9D1", // ✅ Soft blush for photo button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  photoButtonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  saveButton: {
    backgroundColor: "#A8BBA3", // ✅ Sage green for save button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
  },
  saveText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
