import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

// Mood config for icons + colors
const moodConfig = {
  happy: { icon: "smile-o", color: "#FFC697" },
  smiling: { icon: "meh-o", color: "#F7E5B7" },
  sad: { icon: "frown-o", color: "#F9C5C7" },
  angry: { icon: "exclamation-circle", color: "#DDC3E3" },
};

export default function HomeScreen() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [postsForDay, setPostsForDay] = useState([]);
  const navigation = useNavigation();

  const formatDate = (date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    return isToday
      ? "Today"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const goPrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(selectedDate.getDate() - 1);
    setSelectedDate(prev);
  };

  const goNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(selectedDate.getDate() + 1);
    if (next > today) return;
    setSelectedDate(next);
  };

  useEffect(() => {
    const month = selectedDate.toLocaleString("en-US", { month: "short" });
    const day = selectedDate.getDate();
    const dateString = `${month} ${day}`;

    // ✅ Query posts for the selected day, ordered by creation time
    const q = query(
      collection(db, "journalEntries"),
      where("date", "==", dateString),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id, // ✅ Include Firestore document ID
        ...doc.data(),
      }));
      setPostsForDay(data);
    });

    return unsubscribe;
  }, [selectedDate]);

  const renderPost = ({ item }) => {
    const mood = moodConfig[item.mood] || {};
    return (
      <TouchableOpacity
        style={styles.postContainer}
        onPress={() => navigation.navigate("DetailScreen", { post: item })}
        activeOpacity={0.8}
      >
        <View style={styles.moodBox}>
          <FontAwesome name={mood.icon} size={30} color="black" />
        </View>

        <View
          style={[
            styles.postContent,
            { backgroundColor: mood.color || "#eee" },
          ]}
        >
          {/* ⚙️ Edit Button */}
          <TouchableOpacity
            style={styles.gearIcon}
            onPress={(e) => {
              e.stopPropagation(); // Prevent navigation to DetailScreen
              navigation.navigate("EditScreen", { post: item }); // ✅ Pass full post (with Firestore ID)
            }}
          >
            <FontAwesome name="cog" size={20} color="black" />
          </TouchableOpacity>

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
      {/* Date Navigation */}
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

      {/* Posts */}
      {postsForDay.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nothing Exciting Today, Yet!</Text>
        </View>
      ) : (
        <FlatList
          data={postsForDay}
          keyExtractor={(item) => item.id}
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
    backgroundColor: "#F8F8FF",
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
