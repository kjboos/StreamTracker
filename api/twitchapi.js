import React, { useEffect, useState } from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet, ScrollView, Button } from "react-native";
import { Calendar, CalendarList, Agenda } from "react-native-calendars";
import axios from "axios";

import { itemList } from "../screens/ResultScreen";

const TwitchKalender = () => {
  const [streamEvents, setStreamEvents] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const clientId = "crf1v3ic5vgntpcjf3ieh7sn2cpnt4";
    const clientSecret = "36lirbgnv4z09wg1fe0vrnn86m96g7";
    const followedStreamers = itemList;

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
            console.log(`Fehler beim Abrufen der Schedule-Daten für Streamer ${streamerName}:`, error);
          }
        }
    
        const updatedMarkedDates = {};
    
        scheduleData.forEach(({ streamerName, segments }) => {
          segments.forEach((segment) => {
            const dateString = segment.startTime.toISOString().split("T")[0];
            const markedDate = markedDates[dateString];
    
            if (markedDate) {
              if (!markedDate.customInfo.includes(`Streamer: ${streamerName}`)) {
                markedDate.customInfo.push(`Streamer: ${streamerName}`);
              }
            } else {
              updatedMarkedDates[dateString] = {
                marked: true,
                customInfo: [`Streamer: ${streamerName}`],
              };
            }
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
    
    const fetchData = async () => {
      const accessToken = await fetchAccessToken();
      await Promise.all([
        fetchScheduleData(accessToken),
      ]);
    };

    fetchData();

    const interval = setInterval(fetchData, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderScheduleData = () => {
    if (scheduleData.length === 0) {
      return <Text>Keine geplanten Stream-Zeiten</Text>;
    }

    const selectedScheduleData = scheduleData.filter((data) => {
      const hasScheduledTimes = data.segments.some(
        (segment) =>
          segment.startTime.toISOString().split("T")[0] === selectedDate
      );
      return hasScheduledTimes;
    });

    if (selectedScheduleData.length === 0) {
      return <Text>Keine geplanten Stream-Zeiten an diesem Tag</Text>;
    }

    return (
      <ScrollView>
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
                  <Text style={styles.scheduleTitle}>{segment.title}</Text>
                  <Text style={styles.scheduleTime}>
                    {segment.startTime.toLocaleTimeString()} -{" "}
                    {segment.endTime.toLocaleTimeString()}
                  </Text>
                </View>
              ))}
          </View>
        ))}
        <Button title="Schließen" onPress={handleCloseModal} />
      </ScrollView>
    );
  };

  return (
    <View>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={styles.calendar}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.sectionTitle}>Geplante Stream-Zeiten:</Text>
          {renderScheduleData()}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    fontSize: 18,
    color: "white",
    marginBottom: 10,
  },
  customInfoText: {
    fontSize: 24,
    color: "red",
    textAlign: "center",
  },
  calendar: {
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
  },
  streamerContainer: {
    marginBottom: 20,
  },
  streamerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scheduleItem: {
    marginBottom: 10,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  scheduleTime: {
    fontSize: 14,
    color: "gray",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default TwitchKalender;