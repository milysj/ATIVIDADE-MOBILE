import { useEffect, useState } from 'react';
import SplashScreen from './SplashScreen';

import { View } from 'react-native';
// React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';

import { PaperProvider } from 'react-native-paper';
import { theme } from './theme/theme';

// AppBar (Home)
import AppBar from './AppBar';
// Rotas
import Pesquisa from './Pesquisa';
import Acesso from './Acesso';
import Login from './Login';
import Cadastro from './Cadastro';
import { Perfil } from './Perfil';
import DetalhesCard from './DetalhesCard';
import Admin from './Admin';
// Cabeçalho do menu lateral
import { CabecalhoMenu } from './CabecaMenu';
// Contexto de Autenticação
import { AuthProvider } from './services/AuthContext';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigation() {
  return (
    <Drawer.Navigator 
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#0F1015',
          width: 300,
        },
      }}
      drawerContent={(props) => (
        <View style={{ flex: 1, backgroundColor: '#0F1015' }}>
          <CabecalhoMenu />
          <DrawerContentScrollView {...props} />
        </View>
      )}
    >
      <Drawer.Screen
        name="Início"
        component={AppBar}
        options={{
          drawerLabelStyle: { color: '#FFFFFF', fontWeight: 'bold' },
        }}
      />
      <Drawer.Screen
        name="Admin"
        component={Admin}
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0F1015' },
      }}
    >
      <Stack.Screen name="MainDrawer" component={DrawerNavigation} />
      <Stack.Screen name="Home" component={DrawerNavigation} />
      <Stack.Screen name="DetalhesCard" component={DetalhesCard} />
      <Stack.Screen name="Admin" component={Admin} />
      <Stack.Screen name="Pesquisa" component={Pesquisa} />
      <Stack.Screen name="Acesso" component={Acesso} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
      <Stack.Screen name="Perfil" component={Perfil} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { setLoading(false); }, 1500);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </PaperProvider>
  );
}
