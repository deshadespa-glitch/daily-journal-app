import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // ✅ Firestore config

export default function EditScreen({ route, navigation }) {
  const { post } = route.params; // { id, comment, mood, date, time, image }
  const [comment, setComment] = useState(post.comment);
  const [mood, setMood] = useState(post.mood);
  const [image, setImage] = useState(post.image || null); // ✅ Add image state
  const [loading, setLoading] = useState(false);

  // Mood icons + colors
  const moods = [
    { name: "happy", icon: "grin-alt", color: "#FFC697" },
    { name: "smiling", icon: "smile", color: "#F7E5B7" },
    { name: "sad", icon: "sad-tear", color: "#F9C5C7" },
    { name: "angry", icon: "angry", color: "#DDC3E3" },
  ];

  const formatDate = (date) => {
    if (!date) return "";
    if (date.toDate) {
      // Firestore Timestamp
      return date.toDate();
    }
    return new Date(date); // string or JS Date
  };

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

  // ✅ Pick new image
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
    try {
      if (!post.id) {
        console.error("❌ No document ID found");
        return;
      }

      setLoading(true);

      const docRef = doc(db, "journalEntries", post.id);
      await updateDoc(docRef, {
        comment: comment,
        mood: mood,
        image: image || null, // ✅ Update image too
        updatedAt: new Date(),
      });

      console.log("✅ Post updated in Firestore:", { comment, mood, image });
      navigation.goBack();
    } catch (error) {
      console.error("🔥 Error updating document:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {post.time},{" "}
          {post.createdAt
            ? post.createdAt.toDate().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : post.date}
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

      {/* ✅ Image Section */}
      <Text style={styles.label}>Photo</Text>
      {image && <Image source={{ uri: image }} style={styles.previewImage} />}
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>
          {image ? "Change Photo" : "Add Photo"}
        </Text>
      </TouchableOpacity>

      {/* Save */}
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
  },
  dateText: { fontSize: 18, fontWeight: "bold", color: "#333" },
  label: {
    fontSize: 20,
    marginVertical: 10,
    fontWeight: "bold",
    color: "#A8BBA3",
  }, // ✅ Sage green for labels
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
