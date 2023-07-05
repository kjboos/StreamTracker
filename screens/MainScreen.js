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
  const { height } = useWindowDimensions();
  const [change, SetChange] = useState(false)


 
  const CancelModalHandler = () => {
    SetChange(false);
  };


  const ChangeHandler =() =>{
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
            <DefaultText style={styles.titleText}> StreamTracker </DefaultText>
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
              onClick={ChangeHandler}
              
            />
            <ResultScreen
              visible={change}
              onCancelModal={CancelModalHandler}
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
    backgroundColor: Colors.accent,
  },

  middleContainer: {
    backgroundColor: Colors.accent,
  },

  middleContainerHorizontal: {
    backgroundColor: Colors.textColor,
    alignItems: "center",
    flex: 4,
    width: "100%"
  
  },

  buttonVerticalContainer: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    width: "60%",
    
    
    
  },

  bottomContainer: {
    backgroundColor: Colors.accent,
    
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
    fontFamily: "Montserrat-Black",
    textAlign: "center",
    width: "50%",
  },

  tipText: {
    textAlign: "center",
  },

  titleText: {
    paddingTop: 20,
    fontSize: 35,
    color: Colors.textColor
  
  
  },


});
