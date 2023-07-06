import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  useWindowDimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import { SearchBar, Text } from "react-native-elements";

import Colors from "../constants/Colors";
import LayoutStyles from "../constants/LayoutStyles";
import BgButton from "../components/BgButton";
import DefaultText from "../components/DefaultText";
import ToDoItem from "../components/StreamerItem";

export const itemList = [];

const ResultScreen = (props) => {
  const { height } = useWindowDimensions();

  const [searchText, setSearchText] = useState(""); // Zustandsvariable für die Sucheingabe
  const [items, setItems] = useState([]); // Zustandsvariable für die ToDo-Items
  const [streamerSuggestions, setStreamerSuggestions] = useState([]); // Zustandsvariable für die Streamer-Vorschläge
  const [streamers, setStreamers] = useState([]); // Zustandsvariable für die vorgeschlagenen Streamer

  useEffect(() => {
    if (searchText.trim() !== "") {
      fetchStreamerSuggestions(searchText);
    } else {
      setStreamerSuggestions([]);
    }
  }, [searchText]);

  const handleAddItem = () => {
    if (searchText.trim() !== "") {
      const newItem = { id: Math.random().toString(), title: searchText };
      setItems((prevItems) => [...prevItems, newItem]);
      setSearchText("");
      itemList.push(newItem.title);
      setStreamers((prevStreamers) =>
        prevStreamers.filter((streamer) => streamer.login !== searchText)
      );
    }
    console.log(itemList);
  };

  const handleDeleteItem = (title) => {
    setItems((prevItems) => prevItems.filter((item) => item.title !== title));
    itemList.splice(
      itemList.findIndex((item) => item === title),
      1
    ); // Entferne den Titel aus der itemList
    console.log(itemList);
  };

  const fetchStreamerSuggestions = async (text) => {
    try {
      const authorizationToken = await getAuthorizationToken();
      const response = await axios.get(
        `https://api.twitch.tv/helix/search/channels?query=${text}`,
        {
          headers: {
            "Client-ID": "crf1v3ic5vgntpcjf3ieh7sn2cpnt4",
            Authorization: `Bearer ${authorizationToken}`,
          },
        }
      );
      const { data } = response;
      const suggestions = data.data.map((channel) => channel.display_name);
      setStreamerSuggestions(suggestions);
    } catch (error) {
      console.error("Fehler beim Abrufen der Streamer-Vorschläge:", error);
    }
  };

  const getAuthorizationToken = async () => {
    try {
      const response = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        null,
        {
          params: {
            client_id: "crf1v3ic5vgntpcjf3ieh7sn2cpnt4",
            client_secret: "36lirbgnv4z09wg1fe0vrnn86m96g7",
            grant_type: "client_credentials",
          },
        }
      );
      const { data } = response;
      const authorizationToken = data.access_token;
      return authorizationToken;
    } catch (error) {
      console.error("Fehler beim Abrufen des Authorization-Tokens:", error);
      return null;
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      // supportedOrientations={["portrait", "landscape"]}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={dismissKeyboard}
        style={styles.middleContainer}
      >
        <View
          style={styles.contentContainer}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <KeyboardAvoidingView
            style={[styles.topContainer, LayoutStyles.topContainer]}
          >
            <DefaultText style={styles.titleText}>Search Streamer</DefaultText>
            <View style={styles.searchContainer}>
              <SearchBar
                placeholder="Enter streamer name"
                onChangeText={(text) => setSearchText(text)}
                value={searchText}
                containerStyle={styles.searchBarContainer}
                inputContainerStyle={styles.searchBarInputContainer}
              />
              <BgButton title="Add" onClick={handleAddItem} />
            </View>
          </KeyboardAvoidingView>

          <View style={styles.header}>
            <DefaultText style={styles.listText}>Name </DefaultText>

            <DefaultText style={styles.listText}>List</DefaultText>
          </View>

          <View style={styles.scrollViewContainer}>
            <View style={styles.listContainer}></View>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.contentContainerStyle}
            >
              {streamerSuggestions.map((suggestion) => (
                <View key={suggestion}>
                  <TouchableOpacity onPress={() => setSearchText(suggestion)}>
                    <DefaultText key={suggestion} style={styles.smallText}>
                      {suggestion}
                    </DefaultText>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.contentContainerStyle}
            >
              {items.map((item) => (
                <ToDoItem
                  key={item.id}
                  title={item.title}
                  onDelete={() => handleDeleteItem(item.title)}
                />
              ))}
            </ScrollView>
          </View>
          <View style={[styles.bottomContainer, LayoutStyles.bottomContainer]}>
            <BgButton title={"Back"} onClick={props.onCancelModal} />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
    marginLeft: 5,
  },
  searchBarContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchBarInputContainer: {
    backgroundColor: "lightgray",
  },
  scrollViewContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    minHeight: 240,
  },
  scrollView: {
    flex: 1,
    width: "50%",
  },

  middleContainer: {
    flex: 1,
    backgroundColor: Colors.accent,
    justifyContent: "center",
  },

  titleText: {
    fontSize: 35,
  },
  smallText: {
    fontSize: 15,
    marginBottom: 5,
    textAlign: "center",
  },
  listText: {
    fontSize: 20,
    marginBottom: 20,
    textDecorationLine: "underline",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});

export default ResultScreen;