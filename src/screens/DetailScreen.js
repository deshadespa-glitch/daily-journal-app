import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function DetailScreen({ route, navigation }) {
  const { post } = route.params; // { id, date, time, comment, mood }
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // Define moods with icons and colors
  const moods = {
    happy: { icon: "grin-alt", color: "#FFC697" },
    smiling: { icon: "smile", color: "#F7E5B7" },
    sad: { icon: "sad-tear", color: "#F9C5C7" },
    angry: { icon: "tired", color: "#DDC3E3" },
  };

  const addComment = () => {
    if (newComment.trim() !== "") {
      setComments([...comments, { id: Date.now(), text: newComment }]);
      setNewComment("");
    }
  };

  const deletePost = () => {
    console.log("Deleting post:", post.id);
    navigation.goBack();
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
      <TouchableOpacity style={styles.deleteButton} onPress={deletePost}>
        <Text style={styles.deleteText}>Delete Post</Text>
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

  commentBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  commentText: { fontSize: 15, color: "#333" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    marginTop: 10,
  },
  commentButton: {
    backgroundColor: "#C8CEEE",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 10,
  },
  commentTextBtn: { color: "#000", fontWeight: "bold" },

  deleteButton: {
    backgroundColor: "#CBD3AD",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: "auto",
  },
  deleteText: { color: "#000", fontSize: 18, fontWeight: "bold" },
});
