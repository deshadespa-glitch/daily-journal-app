import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function DeveloperScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Journal</Text>
      </View>

      <Text style={styles.title}>Developer Info</Text>

      <View style={styles.section}>
        <Text style={styles.label}>App Name:</Text>
        <Text style={styles.value}>Daily Journal</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Version:</Text>
        <Text style={styles.value}>1.0.1</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Developer:</Text>
        <Text style={styles.value}>Justine Castro</Text>
        <Text style={styles.Description}>Front-End Developer</Text>

        <Text style={styles.value}>Jill Carandang</Text>
        <Text style={styles.Description}>Quality Assurance Tester</Text>

        <Text style={styles.value}>Francis Tonzo</Text>
        <Text style={styles.Description}>Main Presentor</Text>

        <Text style={styles.value}>Joshua Manuzon</Text>
        <Text style={styles.Description}>Project Manager</Text>

        <Text style={styles.value}>Wenard Ken Santos</Text>
        <Text style={styles.Description}>Back-End Developer</Text>

      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Contacts:</Text>
        <Text style={styles.value}>Emails:</Text>
        <Text style={styles.Description}>deshadespa@gmail.com</Text>
        <Text style={styles.Description}>castrojustinekyle45@gmail.com</Text>

        <Text style={styles.value}>Github:</Text>
        <Text style={styles.Description}>https://github.com/MysticAsahina</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notes:</Text>
        <Text style={styles.value}>
          This app was built using React Native + Firebase to record daily
          moods, journal entries, and images.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F8F8FF",
  },
  header: {
    backgroundColor: "#CBD3AD",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
    marginTop: 50,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  Description:{    
    fontSize: 10,
    color: "#333",
  },
});
