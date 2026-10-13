import { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Avatar, Text, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './services/AuthContext';

const CabecalhoMenu = () => {
  const navigation = useNavigation();
  const { usuario, isAutenticado, logout } = useAuth();
  const [dialogSair, setDialogSair] = useState(false);

  const navigateTo = (tela) => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate(tela);
    } else {
      navigation.navigate(tela);
    }
  };

  const confirmarSaida = () => {
    setDialogSair(false);
    logout();
    navigateTo("Acesso");
  };

  return (
    <View style={styles.container}>
      {/* Área do usuário */}
      <Pressable 
        style={styles.usuario} 
        onPress={() => {
          if (isAutenticado) {
            navigateTo('Perfil');
          } else {
            navigateTo('Acesso');
          }
        }}
      >
        {/* Avatar */}
        <Avatar.Icon
          size={65}
          icon="account"
          style={styles.avatar}
        />

        {/* Nome e e-mail */}
        <View style={styles.informacoes}>
          <Text
            variant="titleMedium"
            style={styles.nome}
          >
            {isAutenticado ? usuario?.nome : 'Visitante'}
          </Text>

          <Text
            variant="bodyMedium"
            style={styles.email}
            numberOfLines={1}
          >
            {isAutenticado ? usuario?.email : 'Toque para fazer login'}
          </Text>
        </View>
      </Pressable>

      {/* Área do perfil */}
      {isAutenticado && (
        <Pressable style={styles.perfil} onPress={() => navigateTo('Perfil')}>
          <Text variant="bodyMedium" style={styles.perfilTexto}>
            Meu perfil
          </Text>
          <IconButton
            icon="account"
            iconColor="white"
            size={24}
            onPress={() => navigateTo('Perfil')}
          />
        </Pressable>
      )}

      {/* Área da Pesquisa */}
      <Pressable style={styles.perfil} onPress={() => navigateTo('Pesquisa')}>
        <Text variant="bodyMedium" style={styles.perfilTexto}>
          Pesquisa
        </Text>
        <IconButton
          icon="magnify"
          iconColor="white"
          size={24}
          onPress={() => navigateTo('Pesquisa')}
        />
      </Pressable>

      {/* Se não autenticado, opção para entrar */}
      {!isAutenticado ? (
        <Pressable style={styles.perfil} onPress={() => navigateTo('Acesso')}>
          <Text variant="bodyMedium" style={styles.perfilTexto}>
            Entrar / Cadastrar
          </Text>
          <IconButton
            icon="login"
            iconColor="white"
            size={24}
            onPress={() => navigateTo('Acesso')}
          />
        </Pressable>
      ) : (
        /* Área do sair */
        <Pressable style={styles.perfil} onPress={() => setDialogSair(true)}>
          <Text variant="bodyMedium" style={styles.perfilTexto}>
            Sair
          </Text>
          <IconButton
            icon="logout"
            iconColor="white"
            size={24}
            onPress={() => setDialogSair(true)}
          />
        </Pressable>
      )}

      {/* Dialog de confirmação */}
      <Portal>
        <Dialog
          visible={dialogSair}
          onDismiss={() => setDialogSair(false)}>
          <Dialog.Title>Confirmar saída</Dialog.Title>
          <Dialog.Content>
            <Text>
              Deseja realmente sair da sua conta?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogSair(false)}>
              Cancelar
            </Button>
            <Button onPress={confirmarSaida}>
              Sair
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};


const styles = StyleSheet.create({

  container: {
    backgroundColor: '#C0C0C0',
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    backgroundColor: '#F2A900',
  },

  informacoes: {
    flex: 1,
    marginLeft: 15,
  },

  nome: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 19,
  },

  email: {
    color: '#FFFFFF',
    marginTop: 3,
  },

  perfil: {
    marginTop: 15,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.3)',

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  perfilTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

});

export { CabecalhoMenu };