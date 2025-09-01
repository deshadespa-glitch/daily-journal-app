// Comments Here For Your Convenience

import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  FlatList 
} from "react-native";

export default function DetailScreen({ route, navigation }) {
  const { post } = route.params; // gets { id, date, time, comment, mood, photo }
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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
        <Text style={styles.dateText}>
          {post.date ? new Date(post.date).toDateString() : ""}
        </Text>
        <Text style={styles.dateText}>{post.time || ""}</Text>
      </View>

      {/* Post Comment (PostLabel) */}
      <Text style={styles.label}>Post</Text>
      <View style={styles.postBox}>
        <Text style={styles.postText}>{post.comment}</Text>
      </View>

      {/* Photo */}
      {post.photo ? (
        <View style={styles.photoBox}>
          <Image source={{ uri: post.photo }} style={styles.image} />
        </View>
      ) : (
        <View style={styles.photoBox}>
          <Text style={styles.photoText}>No Photo</Text>
        </View>
      )}

      {/* Comment Section */}
      <Text style={styles.label}>Comments</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentBox}>
            <Text style={styles.commentText}>• {item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#666", marginVertical: 5 }}>
            No comments yet.
          </Text>
        }
      />

      {/* Add Comment */}
      <TextInput
        style={styles.input}
        placeholder="Write a comment..."
        value={newComment}
        onChangeText={setNewComment}
      />
      <TouchableOpacity style={styles.commentButton} onPress={addComment}>
        <Text style={styles.commentTextBtn}>Post Comment</Text>
      </TouchableOpacity>

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

  postBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 15,
    minHeight: 80,
    marginBottom: 15,
  },
  postText: { fontSize: 16, color: "#333" },

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
