import React from "react";
import {
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  Platform,
} from "react-native";
import Colors from "../constants/Colors";
import DefaultText from "./DefaultText";

// BgButton-Komponente
export default BgButton = (props) => {
  let ButtonComponent = TouchableOpacity;

  // Überprüfen der Plattform und Version für den richtigen Button-Komponenten-Typ
  if (Platform.OS === "android" && Platform.Version >= 21) {
    ButtonComponent = TouchableNativeFeedback;
  }

  return (
    <TouchableOpacity onPress={props.onClick}>
      <View style={styles.button}>
        <DefaultText style={styles.buttonText}> {props.title} </DefaultText>
      </View>
    </TouchableOpacity>
  );
};

// Styles für die Komponente
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.lightBackground,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 8,
    minWidth: 50,
    maxWidth: 300,
    width: "100%",
  },

  buttonText: {
    color: Colors.textColor,
  },
});
