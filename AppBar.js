import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  Appbar, 
  Text, 
  ActivityIndicator,
  IconButton
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './css/Styles';
import ModCard from './Cards';
import { ConteudoService } from './services/api';
import { useAuth } from './services/AuthContext';

const CATEGORIAS = [
  { id: 'TODOS', label: 'Todos', icon: 'fire' },
  { id: 'Filmes', label: 'Filmes', icon: 'movie-open' },
  { id: 'Séries', label: 'Séries', icon: 'television-classic' },
  { id: 'Animes', label: 'Animes', icon: 'sword-cross' },
  { id: 'Documentários', label: 'Documentários', icon: 'earth' },
  { id: 'Desenhos', label: 'Desenhos', icon: 'palette' },
];

const AppBar = ({ navigation }) => {
  const { isAutenticado, isAdmin } = useAuth();
  const [conteudos, setConteudos] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState('TODOS');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar conteúdos do backend com filtro de categoria
  const carregarConteudos = async (cat = categoriaAtiva) => {
    try {
      const res = await ConteudoService.listar('', cat === 'TODOS' ? '' : cat);
      if (res.sucesso && Array.isArray(res.dados)) {
        setConteudos(res.dados);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarConteudos(categoriaAtiva);
    }, [categoriaAtiva])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarConteudos(categoriaAtiva);
  };

  const selecionarCategoria = (id) => {
    setCategoriaAtiva(id);
    setLoading(true);
    carregarConteudos(id);
  };

  const navigateTo = (tela, params) => {
    const parent = navigation.getParent();
    if (parent) {
      parent.navigate(tela, params);
    } else {
      navigation.navigate(tela, params);
    }
  };

  const abrirDetalhes = (item) => {
    navigateTo('DetalhesCard', { item });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1015' }}>
      {/* HEADER PRINCIPAL */}
      <Appbar.Header style={styles.header}>
        <Appbar.Action 
          icon="menu" 
          iconColor="#FFFFFF" 
          onPress={() => navigation.openDrawer()} 
        />
        <Appbar.Content 
          title="TECHNOFILM" 
          titleStyle={styles.headerTitle} 
        />
        <Appbar.Action 
          icon="magnify" CLS
          iconColor="#FFFFFF" 
          onPress={() => navigateTo('Pesquisa')} 
        />
        {/* Se for administrador, atalho direto para o Painel Admin */}
        {isAdmin && (
          <Appbar.Action
            icon="shield-crown"
            iconColor="#F2A900"
            onPress={() => navigateTo('Admin')}
          />
        )}
        <Appbar.Action 
          icon={isAutenticado ? 'account-check' : 'account'} 
          iconColor={isAutenticado ? '#F2A900' : '#FFFFFF'}
          onPress={() => navigateTo(isAutenticado ? 'Perfil' : 'Acesso')} 
        />
      </Appbar.Header>

      {/* ABAS HORIZONTAIS DE TEMAS / CATEGORIAS */}
      <View style={{ backgroundColor: '#0F1015' }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {CATEGORIAS.map((cat) => {
            const ativa = categoriaAtiva === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => selecionarCategoria(cat.id)}
                style={[
                  styles.tabItem,
                  ativa && styles.tabItemActive,
                ]}
                activeOpacity={0.8}
              >
                <IconButton
                  icon={cat.icon}
                  size={16}
                  iconColor={ativa ? '#0F1015' : '#F2A900'}
                  style={{ margin: 0, marginRight: -4, padding: 0 }}
                />
                <Text style={[styles.tabText, ativa && styles.tabTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* LISTAGEM PRINCIPAL DOS CARDS */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#F2A900" />
          <Text style={{ marginTop: 12, color: '#A0A3BD' }}>
            Explorando catálogo...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.cards}
          contentContainerStyle={styles.cardsContent}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              tintColor="#F2A900" 
            />
          }
        >
          {conteudos.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: '#A0A3BD', fontSize: 16, textAlign: 'center' }}>
                Nenhum título encontrado nesta categoria no momento.
              </Text>
              {categoriaAtiva !== 'TODOS' && (
                <TouchableOpacity
                  style={{ marginTop: 14, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#1C1F2B', borderRadius: 8 }}
                  onPress={() => selecionarCategoria('TODOS')}
                >
                  <Text style={{ color: '#F2A900', fontWeight: 'bold' }}>
                    Ver Todas as Categorias
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            conteudos.map((item) => (
              <ModCard
                key={item._id}
                item={item}
                isAdminMode={false}
                onVer={abrirDetalhes}
              />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default AppBar;