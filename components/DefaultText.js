import React from "react";
import { Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

// Komponente für den Standardtext mit anpassbaren Stilen
const DefaultText = (props) => {
  return <Text style={[styles.body, props.style]}> {props.children} </Text>;
};

const styles = StyleSheet.create({
  // Stildefinitionen für den Standardtext
  body: {
    fontSize: 30,
    fontFamily: "Montserrat-Black", // Verwendete Schriftart
    fontWeight: "bold", // Fettdruck
    color: Colors.textColor, // Textfarbe basierend auf der Konstante Colors.textColor
  },
});

export default DefaultText;
