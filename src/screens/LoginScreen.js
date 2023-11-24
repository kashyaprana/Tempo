import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useCallback } from 'react';
import { Button, View, Text, Pressable } from 'react-native';
import * as AppAuth from "expo-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";

const LoginScreen = () => {
  const navigation = useNavigation();


  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const expirationDate = await AsyncStorage.getItem("expirationDate");

      const userSpotifyInfo = await axios.get(
        `https://api.spotify.com/v1/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      global.name = userSpotifyInfo.data.display_name;
      global.email = userSpotifyInfo.data.email;
      global.profile_pic_url = userSpotifyInfo.data.images[0].url;
      global.spotify_id = userSpotifyInfo.data.id;

      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < parseInt(expirationDate)) {
          // token still valid



          navigation.navigate("Home");
        } else {
          // token expired, remove from async
          AsyncStorage.removeItem("token");
          AsyncStorage.removeItem("expirationDate");
        }
      }
    }

    checkTokenValidity();
  }, [])
  async function authSpotify() {
    const config = {
      issuer: "https://accounts.spotify.com",
      clientId: "da6bb118b9c6467f8a32fb1576baa2ef",
      scopes: [
        "user-read-email",
        "user-library-read",
        "user-read-recently-played",
        "user-top-read",
        "playlist-read-private",
        "playlist-read-collaborative",
        "playlist-modify-public"

      ],
      redirectUrl: "exp://192.168.1.4:8081/--/spotify-auth-callback"
    }
    const result = await AppAuth.authAsync(config);
    // console.log(result);



    if (result.accessToken) {
      const expirationDate = new Date(result.accessTokenExpirationDate).getTime();
      AsyncStorage.setItem("token", result.accessToken);
      AsyncStorage.setItem("expirationDate", expirationDate.toString());

      const userSpotifyInfo = await axios.get(
        `https://api.spotify.com/v1/me`,
        {
          headers: {
            Authorization: `Bearer ${result.accessToken}`,
          },
        }
      );

      global.name = userSpotifyInfo.data.display_name;
      global.email = userSpotifyInfo.data.email;
      global.profile_pic_url = userSpotifyInfo.data.images[0].url;
      global.spotify_id = userSpotifyInfo.data.id;


      navigation.navigate("Home");

    }
  }


  return (
    <View style={{
      flex: 1,
      backgroundColor: '#000',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Text style={{ color: '#fff' }}>
        Login Screen
      </Text>
      <Pressable
        style={{ backgroundColor: 'green', padding: 10, margin: 10, borderRadius: 100 }}
        onPress={authSpotify}
      >
        <Text style={{ color: 'white' }}>
          Login with Spotify
        </Text>
      </Pressable>

    </View>
  )
}
export default LoginScreen;