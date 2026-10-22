import { View, Text, Image, ActivityIndicator } from 'react-native';
import { styles } from './css/Styles';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('./assets/logo.jpg')}
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#F2A900" style={{ marginTop: 20 }} />
      <Text style={{ color: '#A0A3BD', marginTop: 14, fontSize: 14, fontWeight: '600' }}>
        Carregando Technologic...
      </Text>
    </View>
  );
};

export default SplashScreen;