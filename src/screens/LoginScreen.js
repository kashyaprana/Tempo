import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useCallback } from 'react';
import { Button, View, Text, Pressable } from 'react-native';
import * as AppAuth from "expo-app-auth";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { ResponseType, useAuthRequest } from "expo-auth-session";


const LoginScreen = () => {
  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared successfully');
    } catch (error) {
      console.error(`Error clearing AsyncStorage: ${error}`);
    }
  };
  // clearAsyncStorage();
  const navigation = useNavigation();

  const discovery = {
    authorizationEndpoint: "https://accounts.spotify.com/authorize",
    tokenEndpoint: "https://accounts.spotify.com/api/token",
  };

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "da6bb118b9c6467f8a32fb1576baa2ef",
      clientSecret: "8fca67e6d0b14f33a05eb7bff7821ae1",
      scopes: [
        "user-read-currently-playing",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "user-modify-playback-state",
        "streaming",
        "user-read-email",
        "user-read-private",
      ],
      usePKCE: false,
      redirectUri: "exp://192.168.1.4:8081/--/spotify-auth-callback",
    },
    discovery
  );

  const storeData = async (name, data) => {
    try {
      await AsyncStorage.setItem(name, data);
    } catch (e) {
      // saving error
      console.log("Error", e);
    }
  };

  const removeData = async (name) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (e) {
      // saving error
      console.log("Error", e);
    }
  };

  const getUserData = async (access_token) => {
    try {
      const getUserSpotifyData = await axios.get(
        `https://api.spotify.com/v1/me`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log("ata");
      console.log(getUserSpotifyData.data);
    } catch (error) {

    }
  }


  useEffect(() => {
    // removeData("token");
    if (response?.type === "success") {
      const { access_token } = response.params;
      storeData("token", access_token);
      // getUserData(access_token);
      navigation.navigate("Home");
    }
  }, [response]);



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
          promptAsync();
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