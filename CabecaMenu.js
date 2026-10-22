import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Avatar, Text, IconButton, Portal, Dialog, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './services/AuthContext';

const CabecalhoMenu = () => {
  const navigation = useNavigation();
  const { usuario, isAutenticado, isAdmin, logout } = useAuth();
  const [dialogSair, setDialogSair] = useState(false);

  const navigateTo = (tela, params) => {
    try {
      navigation.closeDrawer();
    } catch (e) {}

    try {
      navigation.navigate(tela, params);
    } catch (e) {
      const parent = navigation.getParent();
      if (parent) {
        parent.navigate(tela, params);
      }
    }
  };

  const confirmarSaida = () => {
    setDialogSair(false);
    logout();
    navigateTo('Acesso');
  };

  return (
    <View style={styles.container}>
      {/* Área de Perfil do Usuário */}
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
        <Avatar.Icon
          size={58}
          icon={isAdmin ? 'crown' : 'account'}
          style={styles.avatar}
          color="#0F1015"
        />

        <View style={styles.informacoes}>
          <Text variant="titleMedium" style={styles.nome} numberOfLines={1}>
            {isAutenticado ? usuario?.nome : 'Visitante'}
          </Text>

          {/* Badge de Nível de Usuário */}
          <View style={[styles.roleBadge, isAdmin ? styles.roleBadgeAdmin : styles.roleBadgeUser]}>
            <Text style={[styles.roleText, isAdmin ? styles.roleTextAdmin : styles.roleTextUser]}>
              {isAdmin ? '👑 ADMINISTRADOR' : isAutenticado ? '👤 USUÁRIO PADRÃO' : 'VISITANTE'}
            </Text>
          </View>

          <Text variant="bodySmall" style={styles.email} numberOfLines={1}>
            {isAutenticado ? usuario?.email : 'Toque para fazer login'}
          </Text>
        </View>
      </Pressable>

      {/* PAINEL DE ADMINISTRAÇÃO (Exclusivo para Administrador) */}
      {isAdmin && (
        <Pressable 
          style={[styles.menuItem, styles.adminMenuItem]} 
          onPress={() => navigateTo('Admin')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon="shield-crown" iconColor="#0F1015" size={20} style={{ margin: 0, marginRight: 8 }} />
            <Text style={styles.adminMenuTexto}>
              Painel de Administração
            </Text>
          </View>
          <IconButton icon="chevron-right" iconColor="#0F1015" size={20} style={{ margin: 0 }} />
        </Pressable>
      )}

      {/* Menu: Meu Perfil */}
      {isAutenticado && (
        <Pressable style={styles.menuItem} onPress={() => navigateTo('Perfil')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon="account-cog" iconColor="#F2A900" size={20} style={{ margin: 0, marginRight: 8 }} />
            <Text style={styles.menuTexto}>Meu perfil</Text>
          </View>
          <IconButton icon="chevron-right" iconColor="#8A8D9F" size={20} style={{ margin: 0 }} />
        </Pressable>
      )}

      {/* Menu: Pesquisa */}
      <Pressable style={styles.menuItem} onPress={() => navigateTo('Pesquisa')}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="magnify" iconColor="#F2A900" size={20} style={{ margin: 0, marginRight: 8 }} />
          <Text style={styles.menuTexto}>Pesquisar no catálogo</Text>
        </View>
        <IconButton icon="chevron-right" iconColor="#8A8D9F" size={20} style={{ margin: 0 }} />
      </Pressable>

      {/* Menu: Login ou Sair */}
      {!isAutenticado ? (
        <Pressable style={styles.menuItem} onPress={() => navigateTo('Acesso')}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon="login" iconColor="#F2A900" size={20} style={{ margin: 0, marginRight: 8 }} />
            <Text style={styles.menuTexto}>Entrar / Criar Conta</Text>
          </View>
          <IconButton icon="chevron-right" iconColor="#8A8D9F" size={20} style={{ margin: 0 }} />
        </Pressable>
      ) : (
        <Pressable style={styles.menuItem} onPress={() => setDialogSair(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <IconButton icon="logout" iconColor="#FF5252" size={20} style={{ margin: 0, marginRight: 8 }} />
            <Text style={[styles.menuTexto, { color: '#FF5252' }]}>Sair da conta</Text>
          </View>
          <IconButton icon="chevron-right" iconColor="#FF5252" size={20} style={{ margin: 0 }} />
        </Pressable>
      )}

      {/* Diálogo de confirmação de saída */}
      <Portal>
        <Dialog
          visible={dialogSair}
          onDismiss={() => setDialogSair(false)}
          style={{ backgroundColor: '#181A24', borderRadius: 16 }}
        >
          <Dialog.Title style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
            Encerrar Sessão
          </Dialog.Title>
          <Dialog.Content>
            <Text style={{ color: '#A0A3BD' }}>
              Deseja realmente sair da sua conta no aplicativo?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button textColor="#A0A3BD" onPress={() => setDialogSair(false)}>
              Cancelar
            </Button>
            <Button textColor="#FF5252" onPress={confirmarSaida}>
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
    backgroundColor: '#14161F',
    paddingTop: 35,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262A3B',
  },

  usuario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#202330',
  },

  avatar: {
    backgroundColor: '#F2A900',
  },

  informacoes: {
    flex: 1,
    marginLeft: 14,
  },

  nome: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },

  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    marginBottom: 4,
  },

  roleBadgeAdmin: {
    backgroundColor: '#F2A900',
  },

  roleBadgeUser: {
    backgroundColor: '#262A3B',
  },

  roleText: {
    fontSize: 10,
    fontWeight: '800',
  },

  roleTextAdmin: {
    color: '#0F1015',
  },

  roleTextUser: {
    color: '#A0A3BD',
  },

  email: {
    color: '#8A8D9F',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
    marginBottom: 4,
  },

  adminMenuItem: {
    backgroundColor: '#F2A900',
    borderRadius: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginVertical: 6,
  },

  adminMenuTexto: {
    color: '#0F1015',
    fontWeight: '800',
    fontSize: 14,
  },

  menuTexto: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

export { CabecalhoMenu };