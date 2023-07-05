import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import DefaultText from "../components/DefaultText";

export default toDoItem = (props) => {
  return (
    <TouchableOpacity
      onLongPress={() => {
        props.onDelete(props.id);
      }}
      delayLongPress={1000}
      style={styles.itemContainer}
    >
      <DefaultText style={styles.title}>{props.title}</DefaultText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: "center",
    borderWidth: 0.1,
    borderColor: "black",
    borderRadius: 5,
    padding: 10,
    marginVertical: 4,
    width: "100%",
    backgroundColor: "black",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  title: {
    fontSize: 14, // Anpassen der Schriftgröße für den Titel
  },
});
