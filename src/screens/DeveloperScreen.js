import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function DeveloperScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Developer Info</Text>

      <View style={styles.section}>
        <Text style={styles.label}>App Name:</Text>
        <Text style={styles.value}>Daily Journal</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Version:</Text>
        <Text style={styles.value}>1.0.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Developer:</Text>
        <Text style={styles.value}>Justine Castro</Text>
        <Text style={styles.value}>Jill Carandang</Text>
        <Text style={styles.value}>Francis Tonzo</Text>
        <Text style={styles.value}>Joshua Manuzon</Text>
        <Text style={styles.value}>Wenard Ken Santos</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Contact:</Text>
        <Text style={styles.value}>deshadespa@gmail.com</Text>
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
});
