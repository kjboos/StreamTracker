import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
} from "react-native";
import ToDoItem from "./components/ToDoItem";
import ToDoInput from "./components/ToDoInput";

export default function App() {
  const [items, setItems] = useState([]);
  const [itemsChecked, setItemsChecked] = useState([]);

  const addHandler = (title) => {
    setItems([...items, { id: Math.random().toString(), text: title }]);
    setItemsChecked([...itemsChecked, false]);
    //setCurrentInput("");
  };

  const deleteHandler = (id) => {
    setItems((items) => {
      return items.filter((item) => item.id !== id);
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <ToDoInput onAdd={addHandler} />
        <ScrollView
          style={styles.ScrollView}
          contentContainerStyle={styles.contentContainerStyle}
        >
          {items.map((item, index) => (
            <ToDoItem
              key={item.id}
              title={item.text}
              onDelete={deleteHandler}
              id={item.id}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },

  ScrollView: {
    height: 400,
    marginTop: 30,
    width: "100%",
  },

  contentContainerStyle: {
    width: "100%",
    alignItems: "center",
  },
});
