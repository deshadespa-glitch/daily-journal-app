// Added Comments For Your Convenience


import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";

// 🔹 DummyPost is a temporary local array used as mock database
// Backend should replace this with API (POST request → save to DB)
import DummyPost from "./DummyPost";

export default function AddScreen({ navigation }) {
  // 🔹 Local UI states for each field
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [mood, setMood] = useState(null);

  // 🔹 Automatically keep current date & time updated
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(
        now.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // 🔹 Pick image using camera → store locally as URI
  // Backend: send this URI file as multipart/form-data to API
  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // 🔹 "Save" handler → builds a new post object
  // For backend: Replace DummyPost.push with API POST request
  const handleSave = () => {
    const newPost = {
      id: DummyPost.length + 1, // Backend should auto-generate ID
      date: new Date().toISOString(), // ISO format date (store in DB)
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      comment, // user input text
      mood, // selected mood (string)
      photo, // photo file URI (needs upload)
    };

    // 🔹 Mock behavior (local only)
    DummyPost.push(newPost);
    console.log("✅ Added New Post:", newPost);
    console.log("📌 Updated DummyPost:", DummyPost);

    // 🔹 Navigation back to Home → triggers refresh to see new post
    navigation.goBack();
  };

  // 🔹 Mood buttons available
  // Backend: this can be stored as a string enum in DB (happy, sad, etc.)
  const moods = [
    { name: "happy", icon: "grin-alt", color: "#FFC697" },
    { name: "smiling", icon: "smile", color: "#F7E5B7" },
    { name: "sad", icon: "sad-tear", color: "#F9C5C7" },
    { name: "angry", icon: "tired", color: "#DDC3E3" },
  ];

  // 🔹 Animations for mood selection (UI only)
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
    <View style={styles.container}>
      {/* 🔹 Header with date/time and close button */}
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {time} , {date}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* 🔹 Comment input (user's text content) */}
      <Text style={styles.label}>Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Write your thoughts..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      {/* 🔹 Photo section (user can capture photo) */}
      <Text style={styles.label}>Photo</Text>
      <TouchableOpacity style={styles.photoBox} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <Text style={styles.photoText}>📸 Take a Photo</Text>
        )}
      </TouchableOpacity>

      {/* 🔹 Mood selection */}
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

      {/* 🔹 Save button → currently pushes to DummyPost, replace with API */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: "#F8F8FF"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "#F8F8FF",
    padding: 10,
    borderRadius: 10,
  },
  dateText: { fontSize: 18, fontWeight: "bold" },
  label: { fontSize: 20, marginVertical: 10, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },
  photoBox: {
    height: 250,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  photoText: { color: "#666" },
  image: { width: "100%", height: "100%", borderRadius: 8 },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    backgroundColor: "#F8F8FF",
    borderRadius: 10,
    paddingVertical: 10,
  },
  moodButton: {
    padding: 5,
  },
  moodCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8FF",
    elevation: 2,
  },
  saveButton: {
    backgroundColor: "#CBD3AD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
  },
  saveText: { color: "#000", fontSize: 18, fontWeight: "bold" },
});
