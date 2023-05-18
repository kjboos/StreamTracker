import React, { useState } from "react";
import Colors from "../constants/Colors";
import LayoutStyles from "../constants/LayoutStyles";
import {
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Platform,
} from "react-native";

import DefaultText from "../components/DefaultText";
import BgButton from "../components/BgButton";
import ResultScreen from "./ResultScreen";
import TwitchApi from "../api/twitchapi"






export default MainScreen = (props) => {
  const [sliderValue, setSliderValue] = useState(10);
  const [splitNumber, setSplitNumber] = useState(1);
  const [enteredNumber, setEnteredNumber] = useState("");
  const { height } = useWindowDimensions();
  const [showResults, setShowResults] = useState(false);
  const [total, setTotal] = useState(0);
  const [result, setResult] = useState(0);
  const [tip, setTip] = useState(0);

  const inputHandler = (inputText) => {
    setEnteredNumber(inputText);
  };

  const stepperHandler = (isAdd) => {
    if (isAdd) {
      setSplitNumber((splitNumber) => (splitNumber += 1));
    } else if (splitNumber != 1) {
      setSplitNumber((splitNumber) => (splitNumber -= 1));
    }
  };

  const calculateHandler = () => {
    if (/^[+-]?\d+([\.\,]\d+)?$/.test(enteredNumber)) {
      setResult(
        calculateTip(parseFloat(enteredNumber), sliderValue, splitNumber)
      );
      setShowResults(true);
    } else {
      Alert.alert("Invalid Number", "Please enter a valid number.", [
        { text: "OK", style: "cancel" },
      ]);
    }
  };

  const CancelModalHandler = () => {
    setShowResults(false);
  };

  const calculateTip = (amount, tip, split) => {
    let calculateTotal = amount + (tip / 100) * amount;
    let calculatedTip = (tip / 100) * amount;
    let calculatedAmount = calculateTotal / split;
    let roundedAmount = (
      Math.round((calculatedAmount + Number.EPSILON) * 100) / 100
    ).toFixed(2);
    setTotal(calculateTotal.toFixed(2));
    setTip(calculatedTip.toFixed(2));

    return roundedAmount;
  };

  return (
    <View
      style={Platform.select({
        ios: styles.wrapperIOS,
        android: { height: height },
      })}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <View
          style={height > 660 ? styles.screenVertical : styles.screenHorizontal}
          onLayout={props.onLayout}
        >
          <View style={[styles.topContainer, LayoutStyles.topContainer]}>
            <DefaultText style={styles.titleText}> StreamTracker </DefaultText>
            <TextInput
              placeholder="Moneyyy"
              style={styles.input}
              value={enteredNumber}
              onChangeText={inputHandler}
              keyboardType="numeric"
              clearTextOnFocus={true}
            />
          </View>
          <View
            style={
              height > 660
                ? [LayoutStyles.middleContainer, styles.middleContainer]
                : [
                    LayoutStyles.middleContainer,
                    styles.middleContainerHorizontal,
                  ]
            }
          >
          
          <TwitchApi/>
 
          </View>
          <View style={[styles.bottomContainer, LayoutStyles.bottomContainer]}>
            <BgButton
              title="Add Streamer"
              onClick={() => {
                calculateHandler();
              }}
            />
            <ResultScreen
              visible={showResults}
              onCancelModal={CancelModalHandler}
              split={splitNumber}
              tip={tip}
              total={total}
              result={result}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperIOS: {
    height: "100%",
  },

  screenVertical: {
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  screenHorizontal: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: Colors.lightBackground,
  },
  topContainer: {
    backgroundColor: Colors.lightBackground,
  },

  middleContainer: {
    backgroundColor: Colors.textColor,
  },

  middleContainerHorizontal: {
    backgroundColor: Colors.textColor,
    alignItems: "center",
    flex: 2,
  },

  buttonVerticalContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    width: "60%",
  },

  bottomContainer: {
    backgroundColor: Colors.textColor,
  },
  slider: {
    width: "100%",
  },

  SliderContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },

  input: {
    marginTop: 15,
    fontSize: 30,
    color: Colors.primary,
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    width: "50%",
  },

  tipText: {
    textAlign: "center",
  },

  titleText: {
    paddingTop: 20,
    fontSize: 35,
    //width: '100%'
  },


});
