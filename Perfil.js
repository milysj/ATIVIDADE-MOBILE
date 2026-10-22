import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Avatar, Text, TextInput, Button, Divider, IconButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from './services/AuthContext';
import { UsuarioService } from './services/api';

const Perfil = ({ navigation }) => {
  const { usuario, isAutenticado, isAdmin, atualizarUsuario } = useAuth();

  // Dados do usuário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [imagem, setImagem] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!isAutenticado) {
      Alert.alert('Acesso Restrito', 'Faça login para acessar seu perfil.', [
        { text: 'Fazer Login', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }

    if (usuario) {
      setNome(usuario.nome || '');
      setEmail(usuario.email || '');
      setTelefone(usuario.telefone || '');
      setCpf(usuario.cpf || '');
      if (usuario.imagem) {
        setImagem(usuario.imagem);
      }
    }
  }, [usuario, isAutenticado]);

  // Escolher Imagem
  const editarFoto = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!resultado.canceled) {
      setImagem(resultado.assets[0].uri);
    }
  };

  // Salvar Perfil
  const salvarPerfil = async () => {
    if (!usuario?._id && !usuario?.id) {
      Alert.alert('Erro', 'Usuário não identificado.');
      return;
    }

    setSalvando(true);
    try {
      const userId = usuario._id || usuario.id;
      const payload = {
        nome,
        email,
        telefone,
        cpf,
        imagem: imagem || '',
        ...(senha ? { senha } : {}),
      };

      const res = await UsuarioService.atualizar(userId, payload);
      if (res.sucesso) {
        atualizarUsuario(res.dados);
        setSenha('');
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso no banco de dados!');
      }
    } catch (error) {
      Alert.alert('Erro', error.message || 'Falha ao atualizar perfil.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.cabecalho}>
        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          {imagem ? (
            <Image source={{ uri: imagem }} style={styles.avatarImagem} />
          ) : (
            <Avatar.Icon
              size={100}
              icon={isAdmin ? 'crown' : 'account'}
              style={styles.avatar}
              color="#0F1015"
            />
          )}
          {/* BOTÃO EDITAR FOTO */}
          <IconButton
            icon="camera"
            iconColor="#FFFFFF"
            size={18}
            style={styles.botaoEditar}
            onPress={editarFoto}
          />
        </View>

        {/* TÍTULO & ROLE */}
        <Text variant="headlineSmall" style={styles.titulo}>
          {nome || 'Meu Perfil'}
        </Text>

        <View style={[styles.roleBadge, isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser]}>
          <Text style={[styles.roleText, isAdmin ? styles.roleTextAdmin : styles.roleTextUser]}>
            {isAdmin ? '👑 ADMINISTRADOR' : '👤 USUÁRIO PADRÃO'}
          </Text>
        </View>

        <Text style={styles.subtitulo}>{email}</Text>
      </View>

      <Divider style={{ backgroundColor: '#262A3B' }} />

      {/* FORMULÁRIO */}
      <View style={styles.formulario}>
        <TextInput
          label="Nome Completo"
          value={nome}
          onChangeText={setNome}
          mode="outlined"
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="account" iconColor="#F2A900" />}
          style={styles.input}
        />

        <TextInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="email" iconColor="#F2A900" />}
          style={styles.input}
        />

        <TextInput
          label="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          mode="outlined"
          keyboardType="phone-pad"
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="phone" iconColor="#F2A900" />}
          style={styles.input}
        />

        <TextInput
          label="CPF"
          value={cpf}
          onChangeText={setCpf}
          mode="outlined"
          keyboardType="numeric"
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="card-account-details" iconColor="#F2A900" />}
          style={styles.input}
        />

        <TextInput
          label="Nova Senha (deixe em branco para não alterar)"
          value={senha}
          onChangeText={setSenha}
          mode="outlined"
          secureTextEntry
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="lock" iconColor="#F2A900" />}
          style={styles.input}
        />

        {/* SALVAR */}
        <Button
          mode="contained"
          icon="content-save"
          buttonColor="#F2A900"
          textColor="#0F1015"
          loading={salvando}
          disabled={salvando}
          onPress={salvarPerfil}
          style={styles.botao}
          labelStyle={{ fontWeight: '800', fontSize: 15 }}
        >
          Salvar Alterações
        </Button>

        {/* VOLTAR */}
        <Button
          mode="outlined"
          icon="arrow-left"
          textColor="#FFFFFF"
          onPress={() => navigation.goBack()}
          style={styles.botaoVoltar}
        >
          Voltar para o Início
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1015',
  },

  cabecalho: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#14161F',
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },

  avatar: {
    backgroundColor: '#F2A900',
  },

  avatarImagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#F2A900',
  },

  botaoEditar: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    backgroundColor: '#262A3B',
    margin: 0,
    borderWidth: 2,
    borderColor: '#F2A900',
  },

  titulo: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 22,
  },

  subtitulo: {
    color: '#A0A3BD',
    marginTop: 4,
    fontSize: 14,
  },

  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 2,
  },

  roleBadgeAdmin: {
    backgroundColor: '#F2A900',
  },

  roleBadgeUser: {
    backgroundColor: '#262A3B',
  },

  roleText: {
    fontSize: 11,
    fontWeight: '800',
  },

  roleTextAdmin: {
    color: '#0F1015',
  },

  roleTextUser: {
    color: '#A0A3BD',
  },

  formulario: {
    padding: 20,
  },

  input: {
    marginBottom: 14,
    backgroundColor: '#181A24',
  },

  botao: {
    marginTop: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  botaoVoltar: {
    marginTop: 14,
    marginBottom: 30,
    borderRadius: 10,
    borderColor: '#303448',
    paddingVertical: 4,
  },
});

export { Perfil };
