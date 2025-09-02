import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { db } from "../../firebase"; // ✅ Firestore config
import { doc, deleteDoc } from "firebase/firestore";

export default function DetailScreen({ route, navigation }) {
  const { post } = route.params; // { id, date, time, comment, mood, image }
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
      const docRef = doc(db, "journalEntries", post.id);
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
    <ScrollView contentContainerStyle={styles.container}>
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
        <Text style={styles.postText}>{post.comment || "No comment"}</Text>
      </View>

      {/* ✅ Display Photo if available */}
      {post.image ? (
        <>
          <Text style={styles.label}>Photo</Text>
          <Image source={{ uri: post.image }} style={styles.postImage} />
        </>
      ) : null}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#F7F4EA", // ✅ cream background
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateText: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#333" 
  },

  label: { 
    fontSize: 20, 
    marginVertical: 10, 
    fontWeight: "bold", 
    color: "#A8BBA3" // ✅ sage green label
  },

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
  postText: { 
    fontSize: 16, 
    color: "#333" 
  },

  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },

  deleteButton: {
    backgroundColor: "#A8BBA3", // ✅ sage green delete button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
  },
  deleteText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
});
