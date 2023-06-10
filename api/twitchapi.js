import React, { useEffect, useState } from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";

import { itemList } from "../screens/ResultScreen";

const TwitchCalendar = () => {
  const [streamEvents, setStreamEvents] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  //console.log(itemList+"API")

  useEffect(() => {

  

    const fetchScheduleData = async () => {
      try {
        const clientId = "cy62mju0oppuucish4wagv05gras6y";
        const followedStreamers = itemList;
    
        // Abrufen eines OAuth-Zugriffstokens (optional)
        const accessTokenResponse = await axios.post(
          "https://id.twitch.tv/oauth2/token",
          null,
          {
            params: {
              client_id: clientId,
              client_secret: "5uor3qihm10ujysix0fy38rg83ohn6",
              grant_type: "client_credentials",
            },
          }
        );
    
        const accessToken = accessTokenResponse.data.access_token;
    
        // Abrufen der geplanten Stream-Zeiten für gefolgten Streamer
        const scheduleData = [];
    
        for (const streamerName of followedStreamers) {
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

          console.log(scheduleDataResponse)
          console.log(typeof scheduleDataResponse);
    
          if (typeof scheduleDataResponse === "object") {
            const startDate = new Date(scheduleDataResponse.segments[0].start_time);
            //const endDate = new Date(scheduleDataResponse.segment.end_time);
            console.log(startDate)
            scheduleData.push({
              streamerName: streamerName,
              startDate: startDate,
             // endDate: endDate,
              scheduleData: scheduleDataResponse,
            });
          }
        }
    
        setScheduleData(scheduleData);
      } catch (error) {
        console.log("Fehler beim Abrufen der Schedule-Daten:", error);
      }
    };



    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////


    // Funktion zum Abrufen der Stream-Zeiten
    const fetchStreamTimes = async () => {
      try {
        const clientId = "cy62mju0oppuucish4wagv05gras6y";
        const followedStreamers = itemList;

        // Abrufen eines OAuth-Zugriffstokens (optional)
        const accessTokenResponse = await axios.post(
          "https://id.twitch.tv/oauth2/token",
          null,
          {
            params: {
              client_id: clientId,
              client_secret: "5uor3qihm10ujysix0fy38rg83ohn6",
              grant_type: "client_credentials",
            },
          }
        );

        const accessToken = accessTokenResponse.data.access_token;

        // Abrufen der Stream-Zeiten fÃ¼r gefolgten Streamer
        const streamEventsData = [];

        for (const streamerName of followedStreamers) {
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

      

          const streamDataResponse = await axios.get(
            `https://api.twitch.tv/helix/streams?user_id=${userId}`,
            {
              headers: {
                "Client-ID": clientId,
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const streamData = streamDataResponse.data.data[0];
          


          if (streamData) {
            const startDate = new Date(streamData.started_at);
            const endDate = new Date(streamData.started_at);
            endDate.setHours(endDate.getHours() + 1);

            streamEventsData.push({
              streamerName: streamerName,
              startDate: startDate,
              endDate: endDate,
                streamData: streamData,
          
            });
            console.log(startDate + streamerName);
          }
        }

        setStreamEvents(streamEventsData);
      } catch (error) {
        console.log("Fehler beim Abrufen der Stream-Zeiten:", error);
      }
    };

    // Definiere eine Funktion zum initialen Abrufen der Stream-Zeiten
    const initialFetchStreamTimes = async () => {
      await Promise.all([fetchStreamTimes(), fetchScheduleData()]);
    };

    // Führe den initialen API-Aufruf aus
    initialFetchStreamTimes();

    // Aktualisiere die Stream-Zeiten alle 5 Minuten
    const interval = setInterval(fetchStreamTimes, 1000);

    // Bereinige das Intervall, wenn die Komponente unmountet wird
    return () => clearInterval(interval);
  }, []);


  const markedDates = {};

  for (const event of streamEvents) {
    const dateString = event.startDate.toISOString().split("T")[0];
    const customInfo = `Streamer: ${
      event.streamerName
    }\nStartzeit: ${event.startDate.toLocaleTimeString()}\nEndzeit: ${event.endDate.toLocaleTimeString()}`;

    markedDates[dateString] = {
      marked: true,
      customInfo: customInfo,
    };
  }
  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <Calendar markedDates={markedDates} onDayPress={handleDayPress} />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={handleCloseModal}>
            <Text style={styles.closeButton}>Schließen</Text>
          </TouchableOpacity>

          <Text style={styles.customInfoText}>
            {markedDates[selectedDate]?.customInfo}
          </Text>
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
});

export default TwitchCalendar;