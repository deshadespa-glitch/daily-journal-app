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
import { Calendar } from "react-native-calendars"; // ✅ Calendar

// Mood config
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
  const [showCalendar, setShowCalendar] = useState(false); // ✅ toggle calendar
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

  // 🔥 Firestore query updates whenever selectedDate changes
  useEffect(() => {
    const month = selectedDate.toLocaleString("en-US", { month: "short" });
    const day = selectedDate.getDate();
    const dateString = `${month} ${day}`;

    const q = query(
      collection(db, "journalEntries"),
      where("date", "==", dateString),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
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
              e.stopPropagation();
              navigation.navigate("EditScreen", { post: item });
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
      {/* Date Header with Calendar Toggle */}
      <View style={styles.dateNavigator}>
        <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)}>
          <FontAwesome name="calendar" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </View>

      {/* Calendar */}
      {showCalendar && (
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(new Date(day.dateString));
            setShowCalendar(false); // hide after selection
          }}
          markedDates={{
            [selectedDate.toISOString().split("T")[0]]: {
              selected: true,
              selectedColor: "#CBD3AD",
            },
          }}
        />
      )}

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
  container: { flex: 1, padding: 10, backgroundColor: "#F8F8FF" },
  dateNavigator: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  dateText: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
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
  gearIcon: { position: "absolute", top: 8, right: 8, zIndex: 1 },
  postTime: { fontWeight: "bold", marginBottom: 4 },
  postComment: { marginBottom: 6 },
  postImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 4,
  },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#666", textAlign: "center" },
  listContent: { paddingBottom: 20 },
});
