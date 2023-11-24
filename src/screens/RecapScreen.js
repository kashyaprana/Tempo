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
// import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
// import ArtistCard from "../components/ArtistCard";
// import RecentlyPlayedCard from "../components/RecentlyPlayedCard";
import { useNavigation } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import LinearGradient from 'react-native-linear-gradient';

const RecapScreen = () => {
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

  // DATA
  const [topArtistAlbums, setTopArtistAlbums] = useState([]);
  const [userTopSongs, setUserTopSongs] = useState([]);
  const [userProfile, setUserProfile] = useState();

  const [recentlyplayed, setRecentlyPlayed] = useState([]);
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    setLoaded(false);
    // TOP ARTISTS 
    const getTopArtistsAlbums = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("token");
        if (!accessToken) {
          console.log("Access token not found");
          return;
        }


        // API CALL TO GET USER'S TOP ARTISTS
        const type = "artists";
        const time_range = timeRange;
        const topArtistsResponse = await axios.get(
          `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=5`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // FORMAT ARTIST DATA TO ONLY KEEP ID AND NAME
        const formattedArtistsData = (topArtistsResponse.data.items).map((artist) => {
          const { name, id, genres } = artist;
          return {
            name,
            id,
          };
        });

        // STORE ARTIST ID AND NAME
        const artistsIdsData = formattedArtistsData.map((artist) => {
          return {
            id: artist.id,
            name: artist.name,
          };
        });

        // GET TOP ALBUM OF THE ARTIST WITH THEIR ID
        const getTopAlbums = async (artistId, accessToken) => {
          try {
            const response = await axios.get(
              `https://api.spotify.com/v1/artists/${artistId}/albums?limit=1`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            const topAlbum = response.data.items[0];

            const { name, images } = topAlbum;
            const imageUrl = images.length > 0 ? images[0].url : null;

            return {
              name: name,
              imageUrl: imageUrl,
            };
          } catch (error) {
            console.error(`Error fetching top album for artist ${artistId}:`, error);
            return null; // Handle the error as needed
          }
        };


        // GET TOP ALBUM FOR USER'S TOP ARTISTS
        const getTopAlbumsForArtists = async (artistsIdsData, accessToken) => {
          const topAlbumsData = [];

          for (const artist of artistsIdsData) {
            const topAlbumData = await getTopAlbums(artist.id, accessToken);

            if (topAlbumData) {
              topAlbumsData.push({
                artistId: artist.id,
                artistName: artist.name,
                topAlbum: topAlbumData,
              });
            }
          }

          return topAlbumsData;
        };


        const topAlbumsData = await getTopAlbumsForArtists(artistsIdsData, accessToken);

        setTopArtistAlbums(topAlbumsData);

      } catch (err) {
        console.log(err);
      }
    };

    // TOP TRACKS
    const getTopTracks = async () => {
      try {
        const accessToken = await AsyncStorage.getItem("token");
        if (!accessToken) {
          console.log("Access token not found");
          return;
        }

        // API CALL TO GET USER'S TOP SONGS
        const type = "tracks";
        const time_range = timeRange;
        const ResUserTopTracks = await axios.get(
          `https://api.spotify.com/v1/me/top/${type}?time_range=${time_range}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const songInfoArray = [];

        // Iterate through the array
        (ResUserTopTracks.data.items).forEach(item => {
          // Extract relevant information
          const songName = item.name;
          const artistName = item.artists[0].name; // Assuming there is only one artist
          const albumName = item.album.name;
          const albumImages = item.album.images; // This is an array of images
          const albumImageURL = item.album.images.length > 0 ? item.album.images[0].url : null;

          // Create an object to store the information
          const songInfo = {
            name: songName,
            artist: artistName,
            album: {
              name: albumName,
              images: albumImages,
              imageURL: albumImageURL
            }
          };

          // Push the object to the array
          songInfoArray.push(songInfo);
        });

        setUserTopSongs(songInfoArray);

      } catch (err) {
        console.log(err);
      }
    };

    getTopArtistsAlbums();
    getTopTracks();
    setLoaded(true);
  }, [timeRange]);


  const TopArtistsList = ({ data }) => {
    const handlePress = (artistId, artistName, topAlbum) => {
      // Implement the onPress logic as needed
      console.log(`Pressed ${artistName}'s top album: ${topAlbum.name}`);
    };

    return (
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} >
          {data.map((item, index) => (
            <View key={index} style={{ alignItems: 'center', justifyContent: 'center', }}>
              {(index === 1 || index === 0) ? (
                <>
                  <Image
                    source={{ uri: item.topAlbum.imageUrl }}
                    style={{
                      width: screenWidth * 0.45,
                      height: screenWidth * 0.45,
                      margin: 5,
                      borderRadius: 10,
                    }}
                  />
                  <Text style={{ ...styles.artistName, width: screenWidth * 0.3, textAlign: 'center' }}
                    numberOfLines={1} ellipsizeMode="tail"
                  >
                    {index + 1}. {item.artistName}</Text>
                </>
              ) : null}
            </View>
          ))
          }
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {data.map((item, index) => (
            <View key={index} style={{ alignItems: 'center', justifyContent: 'center' }}>
              {(index === 2 || index === 3 || index === 4) && (
                <>
                  <Image
                    source={{ uri: item.topAlbum.imageUrl }}
                    style={{
                      width: screenWidth * 0.3,
                      height: screenWidth * 0.3,
                      margin: 5,
                      borderRadius: 10,
                    }}
                  />
                  <Text style={{ ...styles.artistName, width: screenWidth * 0.3, textAlign: 'center' }}
                    numberOfLines={1} ellipsizeMode="tail"
                  >
                    {index + 1}. {item.artistName}
                  </Text>
                </>
              )}
            </View>
          ))}
        </View>

      </View>

    );
  };

  const TopSongsList = ({ data }) => {


    return (
      <View>
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
          {(data.slice(0, 3)).map((song, index) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src={song.album.imageURL}
                style={{
                  width: screenWidth * 0.3,
                  height: screenWidth * 0.3,
                  margin: 5,
                  borderRadius: 10,
                }}
              />
              <Text style={{ ...styles.songName, width: screenWidth * 0.3, textAlign: 'center' }}
                numberOfLines={1} ellipsizeMode="tail"
              >
                {song.name}
              </Text>
              <Text style={{ ...styles.songName, width: screenWidth * 0.3, textAlign: 'center' }}
                numberOfLines={1} ellipsizeMode="tail"
              >
                by {song.artist}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
          {(data.slice(3, 6)).map((song, index) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src={song.album.imageURL}
                style={{
                  width: screenWidth * 0.3,
                  height: screenWidth * 0.3,
                  margin: 5,
                  borderRadius: 10,
                }}
              />
              <Text style={{ ...styles.songName, width: screenWidth * 0.3, textAlign: 'center' }}
                numberOfLines={1} ellipsizeMode="tail"
              >
                {song.name}
              </Text>
              <Text style={{ ...styles.songName, width: screenWidth * 0.3, textAlign: 'center' }}
                numberOfLines={1} ellipsizeMode="tail"
              >
                by {song.artist}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', marginVertical: 5 }}>
          {(data.slice(6, 9)).map((song, index) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src={song.album.imageURL}
                style={{
                  width: screenWidth * 0.3,
                  height: screenWidth * 0.3,
                  margin: 5,
                  borderRadius: 10,
                }}
              />
              <Text style={{ ...styles.songName, width: screenWidth * 0.3, textAlign: 'center' }}
                numberOfLines={1} ellipsizeMode="tail"
              >
                {song.name}
              </Text>
              <Text style={{ ...styles.songName, width: screenWidth * 0.3, textAlign: 'center' }}
                numberOfLines={1} ellipsizeMode="tail"
              >
                by {song.artist}
              </Text>
            </View>
          ))}
        </View>
      </View>

    );
  };

  return (
    <LinearGradient colors={['#7D7D7D', '#000']} style={{ height: '100%', }}>

      {loaded ? (
        <ScrollView style={{
          height: '100%',
          marginBottom: 60,
        }}>
          <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'space-between', marginHorizontal: 10 }}>
            <Text style={styles.heading}>
              {global.name}
            </Text>
            <Pressable>
              <Image
                src={global.profile_pic_url}
                style={{ height: screenWidth * 0.1, width: screenWidth * 0.1, borderRadius: 100 }}
              />
            </Pressable>
          </View>
          <View>
            <View style={{ flexDirection: 'row', margin: 5, zIndex: 10, alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.heading}>
                Your Top Artists
              </Text>

              <DropDownPicker
                open={open}
                value={timeRange}
                items={items}
                setOpen={setOpen}
                setValue={setTimeRange}
                setItems={setItems}
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

            <View>
              <TopArtistsList data={topArtistAlbums} />
            </View>
          </View>

          <View>
            <Text style={styles.heading}>
              Your Top Songs
            </Text>
            <View>
              <TopSongsList data={userTopSongs} />
            </View>
          </View>

        </ScrollView>
      ) : (
        <Text> LOADING... </Text>
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



export default RecapScreen;