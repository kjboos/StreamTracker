import React from "react";
import { Text, StyleSheet } from "react-native";
import Colors from "../constants/Colors";

export default DefaultText = (props) => {
  return <Text style={[styles.body, props.style]}> {props.children} </Text>;
};

const styles = StyleSheet.create({
  body: {
    fontSize: 30,
    fontFamily: "Montserrat-Black",
    fontWeight: "bold",
    color: Colors.textColor,
  },
});
