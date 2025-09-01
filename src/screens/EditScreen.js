import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import DummyPost from "./DummyPost"; // ⛔ Currently local dummy data, replace with Firebase

export default function EditScreen({ route, navigation }) {
  const { post } = route.params;
  const [comment, setComment] = useState(post.comment);
  const [mood, setMood] = useState(post.mood);

  // Mood icons + colors
  const moods = [
    { name: "happy", icon: "grin-alt", color: "#FFC697" },
    { name: "smiling", icon: "smile", color: "#F7E5B7" },
    { name: "sad", icon: "sad-tear", color: "#F9C5C7" },
    { name: "angry", icon: "tired", color: "#DDC3E3" },
  ];

  // Animated border widths for donut effect
  const borderAnims = useRef(
    moods.reduce((acc, m) => {
      acc[m.name] = new Animated.Value(post.mood === m.name ? 12 : 2);
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

  // ✅ Save updated post (Currently updates DummyPost locally)
  const handleSave = async () => {
    // 🔽 Backend Dev: Replace this block with Firebase Update query
    // Example: update Firestore document by post.id with new { comment, mood }
    const index = DummyPost.findIndex((p) => p.id === post.id);
    if (index !== -1) {
      DummyPost[index] = { ...DummyPost[index], comment, mood };
      console.log("✏️ Updated Post:", DummyPost[index]);
      console.log("📌 All Posts:", DummyPost);
    }

    // 🔽 After Firebase update succeeds, navigate back
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {post.time} ,{" "}
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Comment */}
      <Text style={styles.label}>Comment</Text>
      <TextInput
        style={styles.input}
        placeholder="Edit your thoughts..."
        value={comment}
        onChangeText={setComment}
        multiline
      />

      {/* Mood */}
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
              <FontAwesome5 name={m.icon} size={28} color={m.color} />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Save */}
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
    backgroundColor: "#F8F8FF", // circle white so icons pop
    elevation: 2, // shadow for Android
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
