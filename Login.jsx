import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Text,
} from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './services/AuthContext';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const { login, loadingAuth } = useAuth();

  const handleEntrar = async () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Informe e-mail e senha para entrar.');
      return;
    }

    const res = await login(email.trim().toLowerCase(), senha);

    if (res.sucesso) {
      Alert.alert(
        'Bem-vindo de Volta!',
        `Olá, ${res.usuario.nome}! (${res.usuario.role === 'admin' ? 'Administrador 👑' : 'Usuário 👤'})`,
        [
          {
            text: 'Acessar Catálogo',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } else {
      Alert.alert('Erro ao entrar', res.mensagem);
    }
  };

  return (
    <View style={styles.loginContainer}>
      {/* APPBAR */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          iconColor="#FFFFFF"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Login"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      {/* FORMULÁRIO */}
      <View style={styles.loginContent}>
        <Text variant="headlineMedium" style={styles.loginTitulo}>
          Bem-vindo de volta!
        </Text>

        <Text variant="bodyLarge" style={styles.loginTexto}>
          Entre com sua conta para continuar
        </Text>

        {/* E-MAIL */}
        <TextInput
          label="E-mail"
          placeholder="Digite seu e-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="email" iconColor="#F2A900" />}
          style={styles.input}
        />

        {/* SENHA */}
        <TextInput
          label="Senha"
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          secureTextEntry={!mostrarSenha}
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="lock" iconColor="#F2A900" />}
          right={
            <TextInput.Icon
              icon={mostrarSenha ? 'eye-off' : 'eye'}
              iconColor="#A0A3BD"
              onPress={() => setMostrarSenha(!mostrarSenha)}
            />
          }
          style={styles.input}
        />

        {/* ENTRAR */}
        <Button
          mode="contained"
          icon="login"
          buttonColor="#F2A900"
          textColor="#0F1015"
          style={styles.loginButton}
          loading={loadingAuth}
          disabled={loadingAuth}
          onPress={handleEntrar}
          labelStyle={{ fontWeight: '800', fontSize: 15 }}
        >
          ENTRAR
        </Button>

        {/* CADASTRO */}
        <Button
          mode="text"
          textColor="#A0A3BD"
          icon="account-plus"
          onPress={() => navigation.navigate('Cadastro')}
        >
          Não tem uma conta? <Text style={{ color: '#F2A900', fontWeight: 'bold' }}>Cadastre-se</Text>
        </Button>
      </View>
    </View>
  );
};

export default Login;