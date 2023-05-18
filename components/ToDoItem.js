import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default toDoItem = (props) => {
  return (
    <TouchableOpacity
      onLongPress={() => {
        props.onDelete(props.id);
      }}
      delayLongPress={1000}
      style={styles.itemContainer}
    >
      <Text>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: "center",
    borderWidth: 0.1,
    borderColor: "black",
    borderRadius: 5,
    padding: 15,
    marginVertical: 5,
    width: "100%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
});
