import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { db } from "../../firebase"; // ✅ Make sure this points to your firebase config
import { doc, deleteDoc } from "firebase/firestore";

export default function DetailScreen({ route, navigation }) {
  const { post } = route.params; // { id, date, time, comment, mood }
  const [loading, setLoading] = useState(false);

  const moods = {
    happy: { icon: "grin-alt", color: "#FFC697" },
    smiling: { icon: "smile", color: "#F7E5B7" },
    sad: { icon: "sad-tear", color: "#F9C5C7" },
    angry: { icon: "tired", color: "#DDC3E3" },
  };

  const deletePost = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "journalEntries", post.id); // ✅ Correct collection
      await deleteDoc(docRef);
      Alert.alert("Deleted", "Your journal entry has been deleted.");
      navigation.goBack();
    } catch (error) {
      console.error("🔥 Error deleting document:", error);
      Alert.alert("Error", "Failed to delete the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{post.date || ""}</Text>
        <Text style={styles.dateText}>{post.time || ""}</Text>
      </View>

      {/* Mood Section */}
      <Text style={styles.label}>Mood</Text>
      <View style={styles.moodBox}>
        {moods[post.mood] ? (
          <FontAwesome5
            name={moods[post.mood].icon}
            size={40}
            color={moods[post.mood].color}
          />
        ) : (
          <Text style={styles.postText}>No mood</Text>
        )}
      </View>

      {/* Post Comment */}
      <Text style={styles.label}>Post</Text>
      <View style={styles.postBox}>
        <Text style={styles.postText}>{post.comment}</Text>
      </View>

      {/* Delete Post Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={deletePost}
        disabled={loading}
      >
        <Text style={styles.deleteText}>
          {loading ? "Deleting..." : "Delete Post"}
        </Text>
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
  },
  dateText: { fontSize: 18, fontWeight: "bold" },

  label: { fontSize: 20, marginVertical: 10 },

  moodBox: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 15,
  },

  postBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 15,
    minHeight: 50,
    marginBottom: 15,
  },
  postText: { fontSize: 16, color: "#333" },

  deleteButton: {
    backgroundColor: "#CBD3AD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
  },
  deleteText: { color: "#000", fontSize: 18, fontWeight: "bold" },
});
