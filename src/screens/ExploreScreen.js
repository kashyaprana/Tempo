import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Button,
  TouchableOpacity,
  Pressable,
  FlatList,
  Dimensions
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LinearGradient from 'react-native-linear-gradient';
import { supabase } from '../../supabase';
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";

const ExploreScreen = () => {
  const [loaded, setLoaded] = useState(false);
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width;

  // DROPDOWN
  const [open, setOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('medium_term');
  const [items, setItems] = useState([
    { label: 'Years', value: 'long_term' },
    { label: 'Months', value: 'medium_term' },
    { label: 'Weeks', value: 'short_term' }
  ]);


  const [listRecommendations1, setListRecommendations1] = useState([]);
  const [listRecommendations2, setListRecommendations2] = useState([]);

  useEffect(() => {

    // TOP ARTISTS 
    const getRecommendations = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("token");
        if (!accessToken) {
          console.log("Access token not found");
          return;
        }

        // API CALL TO GET USER'S TOP SONGS
        const time_range = timeRange;
        const ResUserTopTracks = await axios.get(
          `https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // API CALL TO GET USER'S TOP ARTISTS
        const topArtistsResponse = await axios.get(
          `https://api.spotify.com/v1/me/top/artists?time_range=${time_range}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // FORMAT ARTIST DATA TO ONLY KEEP ID, NAME, GENRES
        const formattedArtistsData = (topArtistsResponse.data.items).map((artist) => {
          const { name, id, genres } = artist;
          return {
            name,
            id,
            genres
          };
        });

        // STORE ARTIST ID AND NAME
        const artistsIds = formattedArtistsData.map((artist) => {
          return {
            id: artist.id,
            name: artist.name,
            genres: artist.genres
          };
        });

        // GET GENRES
        const getGenres = (topArtistsResponse.data.items).map((artist) => {
          const { genres } = artist;
          return {
            genres
          };
        });

        // Extract unique genres
        const uniqueGenres = [...new Set(getGenres.flatMap(item => item.genres))];

        // EXTRACT ARTIST ID
        const artistidValues = artistsIds.map(item => item.id);

        // Extract "id" values and store them in an array
        const trackidArray = (ResUserTopTracks.data.items).map(item => item.id);

        // Limit the array to only two items
        const genres1 = uniqueGenres.slice(0, 2);
        const artists1 = artistidValues.slice(0, 2);
        const tracks1 = trackidArray.slice(0, 1);
        // Second Values
        const genres2 = uniqueGenres.slice(2, 4);
        const artists2 = artistidValues.slice(2, 4);
        const tracks2 = trackidArray.slice(1, 2);

        // Convert the array to a comma-separated string
        const genresString1 = genres1.join(',');
        const artistString1 = artists1.join(',');
        const tracksString1 = tracks1.join(',');
        // Second values
        const genresString2 = genres2.join(',');
        const artistString2 = artists2.join(',');
        const tracksString2 = tracks2.join(',');

        // Use the function for each track
        const fetchTrackImage = async (track) => {
          const getTrackImage = await axios.get(
            `https://api.spotify.com/v1/tracks/${track.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          // Add image URL to the track object
          track.image_url = getTrackImage.data.album.images[0].url;

        };

        // First set of Recommendations
        const getRecommendations1 = await axios.get(
          `https://api.spotify.com/v1/recommendations?limit=10&seed_artists=${artistString1}&seed_genres=${genresString1}&seed_tracks=${tracksString1}&max_popularity=60`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const RecTracks1 = (getRecommendations1.data.tracks).map((song) => {
          return {
            name: song.name,
            artist: song.album.artists[0].name,
            id: song.id,

          };
        });
        await Promise.all(RecTracks1.map(fetchTrackImage));
        setListRecommendations1(RecTracks1);

        // Second set of Recommendations
        const getRecommendations2 = await axios.get(
          `https://api.spotify.com/v1/recommendations?limit=10&seed_artists=${artistString2}&seed_genres=${genresString2}&seed_tracks=${tracksString2}&max_popularity=60`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const RecTracks2 = (getRecommendations2.data.tracks).map((song) => {
          return {
            name: song.name,
            artist: song.album.artists[0].name,
            id: song.id,

          };
        });
        await Promise.all(RecTracks2.map(fetchTrackImage));
        setListRecommendations2(RecTracks2);

      } catch (err) {
        console.log(err);
      }
    };

    getRecommendations();
    setLoaded(true);
  }, [timeRange]);

  const UserTrackRecommendations = ({ data }) => {

    return (
      <View>


        {loaded ? (
          <View style={{ flexDirection: 'row', marginVertical: 5 }}>
            {(data).map((song, index) => (
              <View key={index} style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  src={song.image_url}
                  style={{
                    width: screenWidth * 0.4,
                    height: screenWidth * 0.4,
                    margin: 5,
                    borderRadius: 10,
                  }}
                />
                <Text style={{ ...styles.songName, width: screenWidth * 0.4, textAlign: 'center' }}
                  numberOfLines={1} ellipsizeMode="tail"
                >
                  {song.name}
                </Text>
                <Text style={{ ...styles.songName, width: screenWidth * 0.4, textAlign: 'center' }}
                  numberOfLines={1} ellipsizeMode="tail"
                >
                  {song.artist}
                </Text>
              </View>
            ))}
          </View>) : (
          <Text style={styles.heading}>
            Loading
          </Text>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#7D7D7D', '#000']} style={{ height: '100%' }}>
      {loaded ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            height: '100%',
          }}>
          <View>
            <View style={{ flexDirection: 'row', margin: 5, zIndex: 10, alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.heading}>
                For You
              </Text>

              <DropDownPicker
                open={open}
                value={timeRange}
                items={items}
                setOpen={setOpen}
                setValue={setTimeRange}
                setItems={setItems}
                dropDownDirection="BOTTOM"
                onChangeValue={() => { setLoaded(false) }}
                style={{
                  width: screenWidth * 0.2,
                  borderWidth: 0.5,
                  backgroundColor: 'transparent',
                  borderColor: '#FFF',
                  color: '#FFF',

                }}
                labelStyle={{
                  fontWeight: "bold",
                  color: '#FFF'
                }}
                textStyle={{
                  fontSize: 15,
                  color: '#FFF'
                }}
                dropDownContainerStyle={{
                  width: screenWidth * 0.2,
                  borderWidth: 0.5,
                  backgroundColor: '#7D7D7D',
                  borderColor: '#FFF',
                }}
                showArrowIcon={false}
                showTickIcon={false}
              />

            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                <UserTrackRecommendations data={listRecommendations1} />
                <UserTrackRecommendations data={listRecommendations2} />
              </View>
            </ScrollView>
            <View style={{ backgroundColor: '#000', height: screenWidth * 0.3, width: screenWidth * 0.95, alignSelf: 'center', marginVertical: 10, borderRadius: 20, flexDirection: 'row' }}>
              <Image src="/Users/kashyap/Documents/Tempo/src/utopia-tour.png" style={{ height: '90%', width: '30%', borderRadius: 20, alignSelf: 'center', margin: 10 }} />
              <Text style={{ ...styles.artistName, width: '50%', margin: 10, marginTop: 10, fontSize: 18 }}>
                Travis Scott Utopia Tour Presents Circus Maximus, get Tickets now!
              </Text>

            </View>
          </View>
          <View style={{ marginBottom: 60, }}>
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.heading}> LOADING ...</Text>
      )}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  artistName: {
    marginVertical: 1,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Trebuchet MS',
  },
  songName: {
    // marginVertical: 1,
    // fontWeight: 'bold',
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Trebuchet MS',
  },
  heading: {
    color: '#FFFFFF',
    margin: 10,
    fontSize: 23,
    fontWeight: 'bold',
    fontFamily: 'Trebuchet MS',
  }
});

export default ExploreScreen;