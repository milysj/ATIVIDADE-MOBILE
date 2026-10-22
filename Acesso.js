import React from 'react';
import { View } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { styles } from './css/Styles';

const Acesso = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#0F1015' }}>
      {/* APPBAR */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          iconColor="#FFFFFF"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Acesso"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      {/* CONTEÚDO */}
      <View style={[styles.acesso, { flex: 1, justifyContent: 'center' }]}>
        <Text variant="headlineMedium" style={styles.acessoTitulo}>
          Bem-vindo ao Technologic!
        </Text>
        <Text variant="bodyLarge" style={styles.acessoTexto}>
          Seu streaming completo de Filmes, Séries, Animes e Documentários.
        </Text>

        {/* JÁ TENHO CADASTRO */}
        <Button
          mode="contained"
          icon="login"
          buttonColor="#F2A900"
          textColor="#0F1015"
          style={styles.acessoButton}
          labelStyle={{ fontWeight: '800', fontSize: 15 }}
          onPress={() => navigation.navigate('Login')}
        >
          JÁ TENHO CADASTRO
        </Button>

        {/* NÃO TENHO CADASTRO */}
        <Button
          mode="outlined"
          icon="account-plus"
          textColor="#FFFFFF"
          style={[styles.acessoButton, { borderColor: '#303448' }]}
          labelStyle={{ fontWeight: '700', fontSize: 15 }}
          onPress={() => navigation.navigate('Cadastro')}
        >
          NÃO TENHO CADASTRO
        </Button>
      </View>
    </View>
  );
};

export default Acesso;