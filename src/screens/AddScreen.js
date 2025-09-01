import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { db } from "../../firebase"; // ✅ Firestore only
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function AddScreen({ navigation }) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [comment, setComment] = useState("");
  const [mood, setMood] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleSave = async () => {
    if (!comment.trim() && !mood) {
      Alert.alert("Error", "Please add a comment or mood before saving.");
      return;
    }

    setLoading(true);

    try {
      const newPost = {
        date: date,
        time: time,
        comment,
        mood,
        createdAt: Timestamp.now(), // ✅ Firestore timestamp
      };

      await addDoc(collection(db, "journalEntries"), newPost);
      console.log("✅ Added New Post:", newPost);

      Alert.alert("Success", "Your entry has been saved!");
      navigation.goBack();
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
    { name: "angry", icon: "tired", color: "#DDC3E3" },
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
    <View style={styles.container}>
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

      <TouchableOpacity
        style={[styles.saveButton, loading && { opacity: 0.5 }]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>{loading ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F8F8FF" },
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
  moodButton: { padding: 5 },
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
