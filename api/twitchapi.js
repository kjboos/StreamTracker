import React, { useEffect, useState } from "react";
import { View, Modal, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import axios from "axios";

import { itemList } from "../screens/ResultScreen";

const TwitchKalender = () => {
  const [streamEvents, setStreamEvents] = useState([]); // Zustand für Stream-Ereignisse
  const [scheduleData, setScheduleData] = useState([]); // Zustand für geplante Stream-Zeiten
  const [selectedDate, setSelectedDate] = useState(null); // Zustand für ausgewähltes Datum
  const [modalVisible, setModalVisible] = useState(false); // Zustand für Sichtbarkeit des Modals

  useEffect(() => {
    // Funktion zum Abrufen der geplanten Stream-Zeiten
    const fetchScheduleData = async () => {
      try {
        const clientId = "cy62mju0oppuucish4wagv05gras6y";
        const followedStreamers = itemList;

        // Access Token vom Twitch API erhalten
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

        const scheduleData = [];

        // Schleife über alle abonnierten Streamer
        for (const streamerName of followedStreamers) {
          // Benutzerdaten des Streamers abrufen
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

          // Stream-Zeiten des Streamers abrufen
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

          // Wenn Stream-Zeiten vorhanden sind, werden sie zum scheduleData-Array hinzugefügt
          if (typeof scheduleDataResponse === "object") {
            const startDate = new Date(scheduleDataResponse.segments[0].start_time);

            scheduleData.push({
              streamerName: streamerName,
              startDate: startDate,
              scheduleData: scheduleDataResponse,
            });
          }
        }

        setScheduleData(scheduleData);
      } catch (error) {
        console.log("Fehler beim Abrufen der Schedule-Daten:", error);
      }
    };

    // Funktion zum Abrufen der aktuellen Stream-Zeiten
    const fetchStreamTimes = async () => {
      try {
        const clientId = "cy62mju0oppuucish4wagv05gras6y";
        const followedStreamers = itemList;

        // Access Token vom Twitch API erhalten
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

        const streamEventsData = [];

        // Schleife über alle abonnierten Streamer
        for (const streamerName of followedStreamers) {
          // Benutzerdaten des Streamers abrufen
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

          // Aktuelle Stream-Daten des Streamers abrufen
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

          // Wenn ein Stream stattfindet, wird er zum streamEvents-Array hinzugefügt
          if (streamData) {
            const startDate = new Date(streamData.started_at);

            streamEventsData.push({
              streamerName: streamerName,
              startDate: startDate,
              streamData: streamData,
            });
          }
        }

        setStreamEvents(streamEventsData);
      } catch (error) {
        console.log("Fehler beim Abrufen der Stream-Zeiten:", error);
      }
    };

    // Funktion zum initialen Abrufen von Stream-Zeiten und geplanten Stream-Zeiten
    const initialFetchStreamTimes = async () => {
      await Promise.all([fetchStreamTimes(), fetchScheduleData()]);
    };

    initialFetchStreamTimes();

    // Interval für regelmäßiges Aktualisieren der Stream-Zeiten
    const interval = setInterval(initialFetchStreamTimes, 1000);

    return () => clearInterval(interval);
  }, []);

  const markedDates = {};

  // Markierte Daten für den Kalender generieren
  for (const event of streamEvents) {
    const dateString = event.startDate.toISOString().split("T")[0];
    const customInfo = `Streamer: ${event.streamerName}\nStreamt seit: ${event.startDate.toLocaleTimeString()}\n`;

    if (!markedDates[dateString]) {
      markedDates[dateString] = {
        marked: true,
        customInfo: [customInfo],
      };
    } else {
      markedDates[dateString].customInfo.push(customInfo);
    }
  }

  // Funktion zum Behandeln des Klicks auf einen Tag im Kalender
  const handleDayPress = (date) => {
    setSelectedDate(date.dateString);
    setModalVisible(true);
  };

  // Funktion zum Schließen des Modals
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  // Funktion zum Rendern der geplanten Stream-Zeiten
  const renderScheduleData = () => {
    if (scheduleData.length === 0) {
      return <Text>Keine geplanten Stream-Zeiten</Text>;
    }

    return scheduleData.map((data) => (
      <View key={data.startDate.getTime()} style={styles.scheduleItem}>
        <Text style={styles.streamerName}>{data.streamerName}</Text>
        <Text style={styles.scheduleTime}>
          {data.startDate.toLocaleTimeString()}
        </Text>
      </View>
    ));
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
            {markedDates[selectedDate]?.customInfo.map((info, index) => (
              <Text key={index}>{info}</Text>
            ))}
          </Text>

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
});

export default TwitchKalender;