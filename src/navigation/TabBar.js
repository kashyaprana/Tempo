
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

function TabBarStyle({ state, descriptors, navigation, position }) {
  return (



    <View style={styles.tabContainer}>

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (

          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={styles.tabButton}
          >
            {isFocused && (
              <View style={{ backgroundColor: 'white', height: 7, width: 100 }} />
            )}
            <Text style={{ fontSize: isFocused ? 24 : 18, color: 'white', fontFamily: 'Trebuchet MS', fontWeight: 'bold' }}>{label}</Text>
          </TouchableOpacity>

        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    height: 60,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TabBarStyle;