// Added Comments For Your Convenience


import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; 

// 🔹 TEMP: Using dummyPosts (replace with Firebase fetch later)
import dummyPosts from "./DummyPost";

// 🔹 Define mood icons/colors (used for styling post backgrounds)
const moodConfig = {
  Happy: { icon: "smile-o", color: "#FFC697" },
  Smiling: { icon: "meh-o", color: "#F7E5B7" },
  Sad: { icon: "frown-o", color: "#F9C5C7" },
  Angry: { icon: "exclamation-circle", color: "#DDC3E3" },
};

export default function HomeScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today); // 🔹 Track current date being viewed
  const navigation = useNavigation();

  // 🔹 Format header date text ("Today", "Aug 30, 2025", etc.)
  const formatDate = (date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    if (isToday) return "Today";

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // 🔹 Navigate backward 1 day
  const goPrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prev);
  };

  // 🔹 Navigate forward 1 day (capped at today)
  const goNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + 1);
    if (next > today) return; // 🚫 prevent future days
    setSelectedDate(next);
  };

  // 🔹 Filter posts by date (replace with Firebase query later)
  const postsForDay = dummyPosts.filter(
    (post) =>
      new Date(post.date).toDateString() === selectedDate.toDateString()
  );

  // 🔹 Render each post
  const renderPost = ({ item }) => {
    const mood = moodConfig[item.mood] || {};
    return (
      <TouchableOpacity
        style={styles.postContainer}
        // 👉 Navigate to DetailScreen, passing full post object
        onPress={() => navigation.navigate("DetailScreen", { post: item })}
        activeOpacity={0.8}
      >
        {/* Left: Mood Icon */}
        <View style={styles.moodBox}>
          <FontAwesome name={mood.icon} size={30} color="black" />
        </View>

        {/* Right: Post Content */}
        <View
          style={[
            styles.postContent,
            { backgroundColor: mood.color || "#eee" },
          ]}
        >
          {/* ⚙️ Gear Icon → Navigate to EditScreen */}
          <TouchableOpacity
            style={styles.gearIcon}
            onPress={(e) => {
              e.stopPropagation(); // prevent DetailScreen from opening
              navigation.navigate("EditScreen", { post: item });
            }}
          >
            <FontAwesome name="cog" size={20} color="black" />
          </TouchableOpacity>

          {/* Time + Comment + (optional) Photo */}
          <Text style={styles.postTime}>{item.time}</Text>
          <Text style={styles.postComment}>{item.comment}</Text>
          {item.photo && (
            <Image
              source={{ uri: item.photo }}
              style={styles.postImage}
              resizeMode="cover"
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Date Navigator (Prev ⬅️ Today ➡️ Next) */}
      <View style={styles.dateNavigator}>
        <TouchableOpacity onPress={goPrevDay} style={styles.navBtn}>
          <FontAwesome name="chevron-left" size={22} color="black" />
        </TouchableOpacity>

        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>

        <TouchableOpacity
          onPress={goNextDay}
          style={styles.navBtn}
          disabled={selectedDate.toDateString() === today.toDateString()}
        >
          <FontAwesome
            name="chevron-right"
            size={22}
            color={
              selectedDate.toDateString() === today.toDateString()
                ? "gray"
                : "black"
            }
          />
        </TouchableOpacity>
      </View>

      {/* 🔹 Post List OR Empty State */}
      {postsForDay.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            Nothing Exciting Today, Yet!
          </Text>
        </View>
      ) : (
        <FlatList
          data={postsForDay}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10, 
    marginVertical: 10,
    backgroundColor: "#F8F8FF" 
  },
  dateNavigator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 30,
  },
  navBtn: { paddingHorizontal: 10 },
  dateText: { fontSize: 18, fontWeight: "bold" },

  postContainer: {
    flexDirection: "row",
    marginVertical: 8,
    alignItems: "flex-start",
  },
  moodBox: { width: "10%", justifyContent: "center", alignItems: "center" },
  postContent: {
    width: "90%",
    borderRadius: 12,
    padding: 10,
    position: "relative",
  },
  gearIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  postTime: { fontWeight: "bold", marginBottom: 4 },
  postComment: { marginBottom: 6 },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 4,
  },

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },

  listContent: { paddingBottom: 20 },
});
