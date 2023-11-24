import { View, Text } from "react-native"
import LinearGradient from 'react-native-linear-gradient';

const ExploreScreen = () => {
  return (
    <LinearGradient colors={['#7D7D7D', '#000']} style={{ height: '100%' }}>
      <View>

        <Text>
          ExploreScreen
        </Text>
      </View>
    </LinearGradient>
  )
}
export default ExploreScreen;