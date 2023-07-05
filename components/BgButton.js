import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  StyleSheet,
  Platform,
} from "react-native";
import Colors from "../constants/Colors";
import DefaultText from "./DefaultText";

export default BgButton = (props) => {
  let ButtonComponent = TouchableOpacity;

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
