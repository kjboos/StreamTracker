import React, { useState } from "react";
import Colors from "../constants/Colors";
import LayoutStyles from "../constants/LayoutStyles";
import {
  StyleSheet,
  View,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Image,
} from "react-native";

import DefaultText from "../components/DefaultText";
import BgButton from "../components/BgButton";
import ResultScreen from "./SearchAndListScreen";
import TwitchApi from "../api/twitchapi";
import logoImage from "../assets/logo/images.png";

const MainScreen = (props) => {
  const { height } = useWindowDimensions();
  const [change, SetChange] = useState(false);

  // Handler-Funktion, um das Modalfenster zu schließen
  const CancelModalHandler = () => {
    SetChange(false);
  };

  // Handler-Funktion, um das Modalfenster zu öffnen
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
          {/* Oberer Container */}
          <View style={[styles.topContainer, LayoutStyles.topContainer]}>
            <DefaultText
              style={height > 500 ? styles.titleText : styles.titleTextVertical}
            >
              StreamTracker
              <Image
                source={logoImage}
                style={styles.logo}
              />
            </DefaultText>
          </View>

          {/* Mittlerer Container */}
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
            {/* TwitchApi-Komponente */}
            <TwitchApi />
          </View>

          {/* Unterer Container */}
          <View style={[LayoutStyles.bottomContainer]}>
            {/* Button zum Hinzufügen eines Streamers */}
            <BgButton title="Add Streamer" onClick={ChangeHandler} />

            {/* Modalfenster */}
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

export default MainScreen;
