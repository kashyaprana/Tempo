import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useCallback, useState } from 'react';
import { Button, View, Text, Pressable, Platform } from 'react-native';
import * as AppAuth from "expo-app-auth";
// import * as AppAuth from 'react-native-app-auth';
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { supabase } from '../../supabase';
// import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as Linking from 'expo-linking';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [token, setToken] = useState(null);
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
      "playlist-modify-public",
      "user-read-private"
    ],
    // redirectUrl: redirectUrl,
    // redirectUrl: "spotify-ios-quick-start://spotify-login-callback",
    redirectUrl: "exp://192.168.1.4:8081/--/spotify-auth-callback"
  };




  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = await AsyncStorage.getItem("token");
      const expirationDate = await AsyncStorage.getItem("expirationDate");

      if (accessToken && expirationDate) {
        const currentTime = Date.now();
        if (currentTime < parseInt(expirationDate)) {
          // token still valid

          // navigation.navigate("Home");
        } else {
          // token expired, remove from async
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("expirationDate");
        }
      }
    }

    checkTokenValidity();
  }, [])

  async function authSpotify() {
    // try {
    //   await AsyncStorage.clear();
    //   console.log('AsyncStorage cleared successfully');
    // } catch (error) {
    //   console.error('Error clearing AsyncStorage: ');
    // }

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
        "playlist-modify-public",
        "user-read-private"
      ],
      // redirectUrl: "spotify-ios-quick-start://spotify-login-callback",
      redirectUrl: "exp://192.168.1.4:8081/--/spotify-auth-callback"
    }
    const result = await AppAuth.authAsync(config);

    if (result.accessToken) {
      const expirationDate = new Date(result.accessTokenExpirationDate).getTime();
      AsyncStorage.setItem("token", result.accessToken);
      AsyncStorage.setItem("expirationDate", expirationDate.toString());

      // const userSpotifyInfo = await axios.get(
      //   `https://api.spotify.com/v1/me`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${result.accessToken}`,
      //     },
      //   }
      // );
      // console.log('User Spotify Info:', userSpotifyInfo);
      // global.name = userSpotifyInfo.data.display_name;
      // global.email = userSpotifyInfo.data.email;
      // global.profile_pic_url = userSpotifyInfo.data.images[0].url;
      // global.spotify_id = userSpotifyInfo.data.id;


      // // CHECK IF USER EXISTS
      // const { data, error } = await supabase
      //   .from('users')
      //   .select('*')
      //   .eq('email', userSpotifyInfo.data.email);


      // if (data.length === 0) {
      //   // NO USER WITH EMAIL FOUND
      //   // Make an insert query to the 'users' table
      //   const { insert_data, error } = await supabase
      //     .from('users')
      //     .upsert([
      //       {
      //         email: userSpotifyInfo.data.email,
      //         name: userSpotifyInfo.data.display_name,
      //         spotify_id: userSpotifyInfo.data.id,
      //       },
      //     ]);

      //   if (error) {
      //     console.log(error)
      //     throw error;
      //   }

      // } else {
      //   console.log("USER WITH SAME EMAIL EXISTS");
      // }

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
        onPress={() => {
          authSpotify();
        }}
      >
        <Text style={{ color: 'white' }}>
          Login with Spotify
        </Text>
      </Pressable>

    </View>
  )
}
export default LoginScreen;