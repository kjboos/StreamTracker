// Importing required dependencies
import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  Linking,
  Image,
} from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import axios from "axios";

import LayoutStyles from "../constants/LayoutStyles";
import { itemList } from "../screens/SearchAndListScreen";
import Colors from "../constants/Colors";
import BgButton from "../components/BgButton";
import DefaultText from "../components/DefaultText";
import dotImage from "../assets/logo/redDot.png";

// TwitchKalender component
const TwitchKalender = () => {
  // State variables
  const [streamEvents, setStreamEvents] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const openTwitchStreamerPage = (streamerName) => {
    const url = `https://www.twitch.tv/${streamerName}`;
    Linking.openURL(url);
  };

  // useEffect hook to fetch data
  useEffect(() => {
    // Twitch API credentials
    const clientId = "crf1v3ic5vgntpcjf3ieh7sn2cpnt4";
    const clientSecret = "36lirbgnv4z09wg1fe0vrnn86m96g7";
    const followedStreamers = itemList;

    // Function to fetch access token
    const fetchAccessToken = async () => {
      try {
        const response = await axios.post(
          "https://id.twitch.tv/oauth2/token",
          null,
          {
            params: {
              client_id: clientId,
              client_secret: clientSecret,
              grant_type: "client_credentials",
            },
          }
        );
        return response.data.access_token;
      } catch (error) {
        console.log("Fehler beim Abrufen des Access Tokens:", error);
      }
    };

    const fetchScheduleData = async (accessToken) => {
      try {
        const scheduleData = [];

        for (const streamerName of followedStreamers) {
          try {
            const userDataResponse = await axios.get(
              `https://api.twitch.tv/helix/users?login=${streamerName}`,
              {
                headers: {
                  "Client-ID": clientId,
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            const userId = userDataResponse.data.data[0].id;

            const scheduleResponse = await axios.get(
              `https://api.twitch.tv/helix/schedule?broadcaster_id=${userId}`,
              {
                headers: {
                  "Client-ID": clientId,
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            const scheduleDataResponse = scheduleResponse.data.data;

            if (typeof scheduleDataResponse === "object") {
              const segments = scheduleDataResponse.segments.map((segment) => ({
                id: segment.id,
                startTime: new Date(segment.start_time),
                endTime: new Date(segment.end_time),
                title: segment.title,
                isRecurring: segment.is_recurring,
              }));

              scheduleData.push({
                streamerName: streamerName,
                segments: segments,
              });
            }
          } catch (error) {
            console.log(
              `Fehler beim Abrufen der Schedule-Daten für Streamer ${streamerName}:`,
              error
            );
          }
        }

        const updatedMarkedDates = {};

        scheduleData.forEach(({ streamerName, segments }) => {
          segments.forEach((segment) => {
            const dateString = segment.startTime.toISOString().split("T")[0];
            const markedDate = markedDates[dateString];

            if (markedDate) {
              if (
                !markedDate.customInfo.includes(`Streamer: ${streamerName}`)
              ) {
                markedDate.customInfo.push(`Streamer: ${streamerName}`);
              }
            } else {
              updatedMarkedDates[dateString] = {
                marked: true,
                customInfo: [`Streamer: ${streamerName}`],
              };
            }
          });
        });

        // Remove marked dates for items that are not in the item list
        Object.keys(markedDates).forEach((dateString) => {
          if (!updatedMarkedDates[dateString]) {
            delete markedDates[dateString];
          }
        });

        setScheduleData(scheduleData);
        setMarkedDates(updatedMarkedDates);
      } catch (error) {
        console.log("Fehler beim Abrufen der Schedule-Daten:", error);
      }
    };

    // Function to fetch data
    const fetchData = async () => {
      const accessToken = await fetchAccessToken();
      await Promise.all([
        //  fetchStreamEvents(accessToken),
        fetchScheduleData(accessToken),
      ]);
    };

    fetchData();

    // Refresh data every second
    const interval = setInterval(fetchData, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Event handler for day press on the calendar
  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
    setModalVisible(true);
  };

  // Event handler for closing the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderScheduleData = () => {
    if (scheduleData.length === 0) {
      return (
        <DefaultText style={styles.infoMessage}>going empty...</DefaultText>
      );
    }

    const selectedScheduleData = scheduleData.filter((data) => {
      const hasScheduledTimes = data.segments.some(
        (segment) =>
          segment.startTime.toISOString().split("T")[0] === selectedDate
      );
      return hasScheduledTimes;
    });

    if (selectedScheduleData.length === 0) {
      return (
        <DefaultText style={styles.infoMessage}>going empty...</DefaultText>
      );
    }

    return (
      <ScrollView style={styles.scrollView}>
        {selectedScheduleData.map((data) => (
          <View key={data.streamerName} style={styles.streamerContainer}>
            <Text style={styles.streamerName}>{data.streamerName}</Text>
            {data.segments
              .filter(
                (segment) =>
                  segment.startTime.toISOString().split("T")[0] === selectedDate
              )
              .map((segment) => (
                <View key={segment.id} style={styles.scheduleItem}>
                  <Text style={styles.scheduleTime}>
                    {segment.startTime.toLocaleTimeString()} -{" "}
                    {segment.endTime.toLocaleTimeString()}
                  </Text>
                  <Text style={styles.scheduleTitle}>{segment.title}</Text>
                  <TouchableOpacity onPress={() => openTwitchStreamerPage(data.streamerName)}>
              <Text style={styles.Link}> <Image
                source={dotImage}
                style={styles.dot}
              />  &gt;&gt;Watch {data.streamerName}&lt;&lt;</Text>
            </TouchableOpacity>
                </View>
              ))}
          </View>
        ))}
      </ScrollView>
    );
  };

  // Render the TwitchKalender component
  return (
    <View>
      <Calendar 
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: "black",
          calendarBackground: "black",
          textSectionTitleColor: "white",
          selectedDayBackgroundColor: "#9147FF",
          selectedDayTextColor: "white",
          todayTextColor: "#9147FF",
          dayTextColor: "white",
          textDisabledColor: "gray",
          dotColor: "#9147FF",
          selectedDotColor: "white",
          arrowColor: "white",
          monthTextColor: "white",
          indicatorColor: "#9147FF",
          textDayFontFamily: "Montserrat-Black",
          textMonthFontFamily: "Montserrat-Black",
          textDayHeaderFontFamily: "Montserrat-Black",
          textDayFontSize: 16,
          textMonthFontSize: 20,
          textDayHeaderFontSize: 14,
        }}
        style={styles.calendar}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.topContainer, LayoutStyles.topContainer]}>
            <DefaultText style={styles.titleText}> Stream Times </DefaultText>
          </View>

          <View style={styles.scrollViewContainer}>{renderScheduleData()}</View>

          <View style={[styles.bottomContainer, LayoutStyles.bottomContainer]}>
            <BgButton title="Back" onClick={handleCloseModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Styles für die Komponente
const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: 20,
    minHeight: 300,
  },

  streamerContainer: {
    marginBottom: 15,
  },
  calendar:{
    borderRadius: 5,
  },

  streamerName: {
    fontFamily: "Montserrat-Black",
    fontSize: 20,
    color: Colors.textColor,
  },

  scheduleTime: {
    fontFamily: "Montserrat-Black",
    color: Colors.textColor,
  },

  scheduleTitle: {
    fontFamily: "Montserrat-Black",
    color: Colors.textColor,
  },
  Link:{
    fontFamily: "Montserrat-Black",
    color: Colors.primary,
    //textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.accent,
    flexDirection: "column",
  },

  titleText: {
    fontSize: 35,
  },

  infoMessage: {
    alignSelf: "center",
  },

  dot: {
    height: 10,
    width: 10,
  }

});

export default TwitchKalender;
