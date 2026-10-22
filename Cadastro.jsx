import React, { useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  Text,
  IconButton,
} from 'react-native-paper';
import { styles } from './css/Styles';
import { useAuth } from './services/AuthContext';

const Cadastro = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [role, setRole] = useState('user'); // 'user' ou 'admin'

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const { cadastrar, loadingAuth } = useAuth();

  const handleCadastrar = async () => {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Atenção', 'A confirmação de senha não confere com a senha digitada.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    const res = await cadastrar({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senha,
      role: role,
    });

    if (res.sucesso) {
      Alert.alert(
        'Conta Criada com Sucesso!',
        `Bem-vindo(a), ${res.usuario.nome}! Seu perfil foi configurado como ${res.usuario.role === 'admin' ? 'Administrador 👑' : 'Usuário Padrão 👤'}.`,
        [
          {
            text: 'Ir para o Início',
            onPress: () => navigation.navigate('Home'),
          },
        ]
      );
    } else {
      Alert.alert('Erro no cadastro', res.mensagem);
    }
  };

  return (
    <View style={styles.cadastroContainer}>
      {/* APPBAR */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          iconColor="#FFFFFF"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Criar Conta"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.cadastroContent}>
        <Text variant="headlineMedium" style={styles.cadastroTitulo}>
          Cadastre-se
        </Text>
        <Text variant="bodyMedium" style={styles.cadastroTexto}>
          Escolha seu perfil e junte-se ao catálogo
        </Text>

        {/* SELETOR DE TIPO DE USUÁRIO (PADRÃO OU ADMINISTRADOR) */}
        <View style={styles.perfilSelectorContainer}>
          <Text style={styles.perfilSelectorLabel}>Tipo de Conta:</Text>
          <View style={styles.perfilOptionsRow}>
            {/* OPÇÃO 1: USUÁRIO PADRÃO */}
            <TouchableOpacity
              style={[
                styles.perfilOptionCard,
                role === 'user' && styles.perfilOptionActive,
              ]}
              onPress={() => setRole('user')}
              activeOpacity={0.8}
            >
              <IconButton
                icon="account"
                size={20}
                iconColor={role === 'user' ? '#F2A900' : '#8A8D9F'}
                style={{ margin: 0 }}
              />
              <Text
                style={[
                  styles.perfilOptionText,
                  role === 'user' && styles.perfilOptionTextActive,
                ]}
              >
                Padrão
              </Text>
            </TouchableOpacity>            
          </View>
        </View>

        {/* NOME */}
        <TextInput
          label="Nome Completo"
          placeholder="Ex: Maria Silva"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="account" iconColor="#F2A900" />}
          style={styles.input}
        />

        {/* E-MAIL */}
        <TextInput
          label="E-mail"
          placeholder="seuemail@exemplo.com"
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
          placeholder="Mínimo de 6 caracteres"
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

        {/* CONFIRMAR SENHA */}
        <TextInput
          label="Confirmar Senha"
          placeholder="Digite a senha novamente"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          mode="outlined"
          secureTextEntry={!mostrarConfirmacao}
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="lock-check" iconColor="#F2A900" />}
          right={
            <TextInput.Icon
              icon={mostrarConfirmacao ? 'eye-off' : 'eye'}
              iconColor="#A0A3BD"
              onPress={() => setMostrarConfirmacao(!mostrarConfirmacao)}
            />
          }
          style={styles.input}
        />

        {/* BOTÃO CADASTRAR */}
        <Button
          mode="contained"
          icon="account-plus"
          buttonColor="#F2A900"
          textColor="#0F1015"
          style={styles.cadastroButton}
          loading={loadingAuth}
          disabled={loadingAuth}
          onPress={handleCadastrar}
          labelStyle={{ fontWeight: '800', fontSize: 15 }}
        >
          FINALIZAR CADASTRO
        </Button>

        {/* JÁ POSSUI CONTA */}
        <Button
          mode="text"
          textColor="#A0A3BD"
          icon="login"
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 6 }}
        >
          Já possui conta? <Text style={{ color: '#F2A900', fontWeight: 'bold' }}>Entrar</Text>
        </Button>
      </ScrollView>
    </View>
  );
};

export default Cadastro;