import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, useWindowDimensions,TextInput,ScrollView } from "react-native";
import axios from "axios";
import { SearchBar } from "react-native-elements";


import Colors from "../constants/Colors";
import LayoutStyles from "../constants/LayoutStyles";
import BgButton from "../components/BgButton";
import DefaultText from "../components/DefaultText";

import ToDoItem from "../components/ToDoItem";


export const itemList = [];

export default ResultScreen = (props) => {
  const { height } = useWindowDimensions();

  const [searchText, setSearchText] = useState(""); // Zustandsvariable für die Sucheingabe

  const [items, setItems] = useState([]); // Zustandsvariable für die ToDo-Items

  const [streamers, setStreamers] = useState([]);



  const handleSearch = () => {
    // Implementiere hier die Suchfunktion
    // Verwende den Wert von searchText für die Suchlogik
  };


  const handleAddItem = () => {
    if (searchText.trim() !== "") {
      const newItem = { id: Math.random().toString(), title: searchText };
      setItems((prevItems) => [...prevItems, newItem]);
      setSearchText("");
      itemList.push(newItem.title);
    }
    console.log(itemList)
  };
 
  const handleDeleteItem = (title) => {
    setItems((prevItems) => prevItems.filter((item) => item.title !== title));
    itemList.splice(itemList.findIndex((item) => item === title), 1); // Entferne den Titel aus der itemList
    console.log(itemList);
  };



  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      supportedOrientations={["portrait", "landscape"]}
    >
      <View
        style={height > 500 ? styles.screenVertical : styles.screenHorizontal}
      >
        <View style={LayoutStyles.topContainer}>
          <DefaultText style={styles.resultTitleText}>
            Search Streamer
          </DefaultText>

          <View style={styles.searchContainer}>
          <SearchBar
              placeholder="Enter streamer name"
              onChangeText={(text) => setSearchText(text)}
              value={searchText}
              containerStyle={styles.searchBarContainer}
              inputContainerStyle={styles.searchBarInputContainer}
            />
            <BgButton title="Search" onClick={handleAddItem} /> 
  
          </View>

        </View>
        <View
          style={
            height > 660
              ? [LayoutStyles.middleContainer, styles.middleContainer]
              : [LayoutStyles.middleContainer, styles.middleContainerHorizontal]
          }
        >
           <ScrollView
          style={styles.ScrollView}
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
      
    </Modal>
  
  );
};




const styles = StyleSheet.create({

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderBottomColor: Colors.primary,
    borderBottomWidth: 2,
    fontSize: 18,
    marginVertical: 10,
    marginRight: 10,
    textAlign: "center",
  },

  ScrollView: {
    height: 400,
    marginTop: 30,
    width: "100%",
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

  resultTitleText: {
    fontSize: 35,
  },

  resultText: {
    marginTop: 15,
    fontSize: 30,
    color: Colors.primary,
    textAlign: "center",
    width: "50%",
  },

  summaryText: {
    marginTop: 15,
    fontSize: 30,
    textAlign: "center",

  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBarContainer: {
    flex: 1,
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchBarInputContainer: {
    backgroundColor: Colors.primary,
  }
});