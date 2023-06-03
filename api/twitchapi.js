import React, { useEffect, useState } from 'react';
import { View, Modal, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';


import { itemList } from '../screens/ResultScreen';

const TwitchCalendar = () => {
  const [streamEvents, setStreamEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  

  //console.log(itemList+"API")

  useEffect(() => {
    // Funktion zum Abrufen der Stream-Zeiten
    const getStreamTimes = async () => {
      try {
        const clientId = 'cy62mju0oppuucish4wagv05gras6y';
        const followedStreamers = itemList;
       
        // Abrufen eines OAuth-Zugriffstokens (optional)
        const accessTokenResponse = await axios.post(
          'https://id.twitch.tv/oauth2/token',
          null,
          {
            params: {
              client_id: clientId,
              client_secret: '5uor3qihm10ujysix0fy38rg83ohn6',
              grant_type: 'client_credentials',
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
                'Client-ID': clientId,
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const userId = userDataResponse.data.data[0].id;

          const streamDataResponse = await axios.get(
            `https://api.twitch.tv/helix/streams?user_id=${userId}`,
            {
              headers: {
                'Client-ID': clientId,
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
            });
            console.log(startDate+streamerName)
          }
        }

        setStreamEvents(streamEventsData);
      } catch (error) {
        console.log('Fehler beim Abrufen der Stream-Zeiten:', error);
      }
    };

    getStreamTimes();
  }, []);

  const renderCalendarEvents = () => {
    const calendarEvents = {};

    for (const event of streamEvents) {
      const dateString = event.startDate.toISOString().split('T')[0];

      if (!calendarEvents[dateString]) {
        calendarEvents[dateString] = [];
      }

      calendarEvents[dateString].push({
        name: event.streamerName,
        startTime: event.startDate.toLocaleTimeString(),
        endTime: event.endDate.toLocaleTimeString(),
      });
    }

    return calendarEvents;
  };
  const markedDates = {
    '2023-06-01': { marked: true ,customInfo: 'Info für den 1. Juni'},
    '2023-06-05': { marked: true ,customInfo: 'Info für den 2. Juni'},
    '2023-06-10': { marked: true ,customInfo: 'Info für den 3. Juni'},
  };

  const handleDayPress = (date) => {
    setSelectedDate(date);
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButton: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  customInfoText: {
    fontSize: 24,
    color: 'red',
    textAlign: 'center',
  },
});

export default TwitchCalendar;

