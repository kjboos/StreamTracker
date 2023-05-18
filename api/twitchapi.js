import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';

const TwitchCalendar = () => {
  const [streamEvents, setStreamEvents] = useState([]);

  useEffect(() => {
    // Funktion zum Abrufen der Stream-Zeiten
    const getStreamTimes = async () => {
      try {
        const clientId = 'DEINE_CLIENT_ID';
        const followedStreamers = ['STREAMER1', 'STREAMER2', 'STREAMER3'];

        // Abrufen eines OAuth-Zugriffstokens (optional)
        const accessTokenResponse = await axios.post(
          'https://id.twitch.tv/oauth2/token',
          null,
          {
            params: {
              client_id: clientId,
              client_secret: 'DEIN_CLIENT_SECRET',
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

  return (
    <View>
      <Calendar markedDates={renderCalendarEvents()} />
    </View>
  );
};

export default TwitchCalendar;
