import React, { useState } from "react";
import { Text, StyleSheet, TextInput, Button, View, Image } from "react-native";

export default ToDoInput = (props) => {

  const [items, setItems] = useState([]);

  const [currentInput, setCurrentInput] = useState("");

  const inputChangeHandler = (enteredText) => {
    setCurrentInput(enteredText);
  };

  const addHandler = () => {
    props.onAdd(currentInput);
    setCurrentInput("");
  };

  return (
    <View>
      <View style={styles.myComp}>
        <Text style={styles.text}>
          ToDo
          <Image
            style={styles.image}
            source={{
              uri: "https://www.stempel-malter.de/wp-content/uploads/2018/02/holz_motivstempel_abgehakt.png",
            }}
          />
        </Text>

        <TextInput
          style={styles.input}
          placeholder="new toDo"
          onChangeText={inputChangeHandler}
          value={currentInput}
        />
        <Button title="Add" onPress={addHandler} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  myComp: {
    marginTop: 70,
    alignItems: "center",
    justifyContent: "center",
    width: 360,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  text: {
    fontSize: 80,
    color: "black",
    fontWeight: "bold",
  },
  input: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    width: 232,
    textAlign: "center",
    fontSize: 15,
  },
});
