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
  Image,
} from "react-native";

import DefaultText from "../components/DefaultText";
import BgButton from "../components/BgButton";
import ResultScreen from "./SearchAndListScreen";
import TwitchApi from "../api/twitchapi";
import logoImage from "../assets/logo/images.png";

export default MainScreen = (props) => {
  const { height } = useWindowDimensions();
  const [change, SetChange] = useState(false);

  const CancelModalHandler = () => {
    SetChange(false);
  };

  const ChangeHandler = () => {
    SetChange(true);
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
          style={height > 500 ? styles.screenVertical : styles.screenHorizontal}
          onLayout={props.onLayout}
        >
          <View style={[styles.topContainer, LayoutStyles.topContainer]}>
            <DefaultText
              style={height > 500 ? styles.titleText : styles.titleTextVertical}
            >
              {" "}
              StreamTracker <Image
                source={logoImage}
                style={styles.logo}
              />{" "}
            </DefaultText>
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
            <TwitchApi />
          </View>
          <View style={[LayoutStyles.bottomContainer]}>
            <BgButton title="Add Streamer" onClick={ChangeHandler} />
            <ResultScreen visible={change} onCancelModal={CancelModalHandler} />
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
    backgroundColor: Colors.accent,
  },

  middleContainer: {
    backgroundColor: Colors.accent,
  },

  middleContainerHorizontal: {
    backgroundColor: Colors.accent,
    alignItems: "center",
    flex: 4,
    width: "100%",
  },

  titleText: {
    fontSize: 35,
  },
  titleTextVertical: {
    fontSize: 20,
  },

  logo: {},
});
