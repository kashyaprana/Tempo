// React Navigation 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
// import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// Top Tab bar render
import TabBarStyle from './TabBar';

// Top Tab Screens
import RecapScreen from '../screens/RecapScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ExploreScreen from '../screens/ExploreScreen';

// Login Screens
import LoginScreen from '../screens/LoginScreen';

//Sidebar Screens
import SettingsScreen from '../screens/SettingsScreen';
import LinearGradient from 'react-native-linear-gradient';


// declaring top tabs react navigation component.
const Tab = createMaterialTopTabNavigator();
// Top Tabs Navigation which includes Friends, Recap, and Explore screens.
function TopTabNav() {
  return (
    // <LinearGradient colors={['#7D7D7D', '#000']} style={{ height: '100%' }} >
    <View style={styles.container}>

      <Tab.Navigator
        tabBar={props => <TabBarStyle {...props} />}
        initialRouteName='Recap'
      >
        <Tab.Screen name="Friends" component={FriendsScreen} />
        <Tab.Screen name="Recap" component={RecapScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
      </Tab.Navigator>
    </View>
    // </LinearGradient>
  );
}

// declaring drawer react navigation component.
// const Drawer = createDrawerNavigator();

// function Sidebar() {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Settings" component={SettingsScreen} />
//     </Drawer.Navigator>
//   );
// }


const Stack = createStackNavigator();

function AppNav() {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={TopTabNav} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? Constants.statusBarHeight : 10,
    flex: 1,
    height: '100%',
    backgroundColor: '#7D7D7D'
  },
});


export default AppNav;