import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  Appbar, 
  Text, 
  FAB, 
  Portal, 
  Dialog, 
  TextInput, 
  Button, 
  ActivityIndicator,
  IconButton
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './css/Styles';
import ModCard from './Cards';
import { ConteudoService } from './services/api';
import { useAuth } from './services/AuthContext';

const CATEGORIAS_DISPONIVEIS = ['Séries', 'Filmes', 'Animes', 'Documentários', 'Desenhos'];

const Admin = ({ navigation }) => {
  const { isAutenticado, isAdmin } = useAuth();
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados do Modal de Criação / Edição
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editandoItem, setEditandoItem] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [subtitulo, setSubtitulo] = useState('');
  const [categoria, setCategoria] = useState('Séries');
  const [imagem, setImagem] = useState('');
  const [descricao, setDescricao] = useState('');
  const [episodios, setEpisodios] = useState([]);
  const [novoEpTitulo, setNovoEpTitulo] = useState('');
  const [novoEpDuracao, setNovoEpDuracao] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Verificar se usuário é admin
  useEffect(() => {
    if (!isAutenticado || !isAdmin) {
      Alert.alert(
        'Acesso Negado',
        'Apenas administradores podem acessar o painel de gerenciamento.',
        [{ text: 'Voltar', onPress: () => navigation.goBack() }]
      );
    }
  }, [isAutenticado, isAdmin]);

  const carregarConteudos = async () => {
    try {
      const res = await ConteudoService.listar();
      if (res.sucesso && Array.isArray(res.dados)) {
        setConteudos(res.dados);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdos no Admin:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarConteudos();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    carregarConteudos();
  };

  const abrirNovoModal = () => {
    setEditandoItem(null);
    setTitulo('');
    setSubtitulo('');
    setCategoria('Séries');
    setImagem('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80');
    setDescricao('');
    setEpisodios([
      { numero: 1, titulo: '1x01 - Episódio Piloto', duracao: '45 min' }
    ]);
    setNovoEpTitulo('');
    setNovoEpDuracao('');
    setDialogVisible(true);
  };

  const abrirEditarModal = (item) => {
    setEditandoItem(item);
    setTitulo(item.titulo || '');
    setSubtitulo(item.subtitulo || '');
    setCategoria(item.categoria || 'Séries');
    setImagem(item.imagem || '');
    setDescricao(item.descricao || '');
    setEpisodios(Array.isArray(item.episodios) ? [...item.episodios] : []);
    setNovoEpTitulo('');
    setNovoEpDuracao('');
    setDialogVisible(true);
  };

  const adicionarEpisodio = () => {
    if (!novoEpTitulo.trim()) {
      Alert.alert('Atenção', 'Informe o título do episódio.');
      return;
    }

    const proximoNumero = episodios.length + 1;
    const novoEp = {
      numero: proximoNumero,
      titulo: novoEpTitulo.trim(),
      duracao: novoEpDuracao.trim() || '45 min',
    };

    setEpisodios([...episodios, novoEp]);
    setNovoEpTitulo('');
    setNovoEpDuracao('');
  };

  const removerEpisodio = (index) => {
    const atualizados = episodios.filter((_, i) => i !== index);
    // Reindexar números
    const reindexados = atualizados.map((ep, idx) => ({ ...ep, numero: idx + 1 }));
    setEpisodios(reindexados);
  };

  const salvarConteudo = async () => {
    if (!titulo.trim() || !subtitulo.trim() || !imagem.trim()) {
      Alert.alert('Atenção', 'Título, subtítulo e imagem são campos obrigatórios.');
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        titulo: titulo.trim(),
        subtitulo: subtitulo.trim(),
        categoria,
        imagem: imagem.trim(),
        descricao: descricao.trim(),
        episodios,
      };

      if (editandoItem) {
        await ConteudoService.atualizar(editandoItem._id, payload);
        Alert.alert('Sucesso', 'Conteúdo atualizado com sucesso!');
      } else {
        await ConteudoService.cadastrar(payload);
        Alert.alert('Sucesso', 'Novo conteúdo cadastrado no catálogo!');
      }

      setDialogVisible(false);
      carregarConteudos();
    } catch (error) {
      Alert.alert('Erro ao salvar', error.message || 'Falha na operação.');
    } finally {
      setSalvando(false);
    }
  };

  const confirmarExcluir = (item) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${item.titulo}" do catálogo?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await ConteudoService.excluir(item._id);
              Alert.alert('Sucesso', 'Conteúdo removido com sucesso!');
              carregarConteudos();
            } catch (error) {
              Alert.alert('Erro ao excluir', error.message || 'Falha na exclusão.');
            }
          },
        },
      ]
    );
  };

  // Contadores por categoria
  const contadores = {
    total: conteudos.length,
    series: conteudos.filter((c) => c.categoria === 'Séries').length,
    filmes: conteudos.filter((c) => c.categoria === 'Filmes').length,
    animes: conteudos.filter((c) => c.categoria === 'Animes').length,
    documentarios: conteudos.filter((c) => c.categoria === 'Documentários').length,
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1015' }}>
      {/* APPBAR ADMIN */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction iconColor="#FFFFFF" onPress={() => navigation.goBack()} />
        <Appbar.Content 
          title="Painel de Administração" 
          titleStyle={styles.headerTitle} 
          subtitle="Gerencie o catálogo completo"
          subtitleStyle={{ color: '#A0A3BD', fontSize: 12 }}
        />
        <Appbar.Action icon="plus" iconColor="#F2A900" onPress={abrirNovoModal} />
      </Appbar.Header>

      {/* DASHBOARD DE ESTATÍSTICAS */}
      <View style={styles.adminHeaderStat}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{contadores.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{contadores.series}</Text>
          <Text style={styles.statLabel}>Séries</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{contadores.filmes}</Text>
          <Text style={styles.statLabel}>Filmes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{contadores.animes}</Text>
          <Text style={styles.statLabel}>Animes</Text>
        </View>
      </View>

      {/* LISTAGEM DE CARDS COM AÇÕES DE ADMIN */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#F2A900" />
          <Text style={{ marginTop: 12, color: '#A0A3BD' }}>Carregando dados...</Text>
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
              <Text style={{ color: '#A0A3BD', fontSize: 16 }}>Nenhum conteúdo cadastrado ainda.</Text>
              <Button 
                mode="contained" 
                style={{ marginTop: 16, backgroundColor: '#F2A900' }}
                textColor="#0F1015"
                onPress={abrirNovoModal}
              >
                Cadastrar Primeiro Título
              </Button>
            </View>
          ) : (
            conteudos.map((item) => (
              <ModCard
                key={item._id}
                item={item}
                isAdminMode={true}
                onEditar={abrirEditarModal}
                onExcluir={confirmarExcluir}
                onVer={(card) => {
                  navigation.navigate('DetalhesCard', { item: card });
                }}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* BOTÃO FLUTUANTE ADICIONAR */}
      <FAB
        icon="plus"
        label="Novo Conteúdo"
        style={{
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
          backgroundColor: '#F2A900',
        }}
        color="#0F1015"
        onPress={abrirNovoModal}
      />

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      <Portal>
        <Dialog 
          visible={dialogVisible} 
          onDismiss={() => setDialogVisible(false)}
          style={{ backgroundColor: '#181A24', borderRadius: 16, maxHeight: '85%' }}
        >
          <Dialog.Title style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
            {editandoItem ? 'Editar Conteúdo / Tema' : 'Novo Conteúdo'}
          </Dialog.Title>
          <Dialog.ScrollArea style={{ paddingHorizontal: 16 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Seleção de Categoria */}
              <Text style={{ color: '#FFFFFF', fontWeight: '700', marginTop: 10, marginBottom: 8 }}>
                Categoria / Tema:
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {CATEGORIAS_DISPONIVEIS.map((cat) => {
                  const ativa = categoria === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      onPress={() => setCategoria(cat)}
                      style={[
                        localStyles.catChip,
                        ativa && localStyles.catChipActive
                      ]}
                    >
                      <Text style={[localStyles.catChipText, ativa && localStyles.catChipTextActive]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TextInput
                label="Título da Obra"
                placeholder="Ex: Breaking Bad, Attack on Titan"
                value={titulo}
                onChangeText={setTitulo}
                mode="outlined"
                textColor="#FFFFFF"
                style={localStyles.input}
              />

              <TextInput
                label="Subtítulo ou Temporada"
                placeholder="Ex: 1ª Temporada Completa"
                value={subtitulo}
                onChangeText={setSubtitulo}
                mode="outlined"
                textColor="#FFFFFF"
                style={localStyles.input}
              />

              <TextInput
                label="URL da Imagem de Capa"
                placeholder="https://..."
                value={imagem}
                onChangeText={setImagem}
                mode="outlined"
                textColor="#FFFFFF"
                style={localStyles.input}
              />

              <TextInput
                label="Sinopse / Descrição"
                placeholder="Conteúdo descritivo da obra..."
                value={descricao}
                onChangeText={setDescricao}
                mode="outlined"
                multiline
                numberOfLines={3}
                textColor="#FFFFFF"
                style={localStyles.input}
              />

              {/* Gerenciamento de Episódios */}
              <Text style={{ color: '#FFFFFF', fontWeight: '700', marginTop: 12, marginBottom: 8 }}>
                Episódios ({episodios.length}):
              </Text>

              {episodios.map((ep, idx) => (
                <View key={idx} style={localStyles.epItem}>
                  <Text style={{ color: '#F2A900', fontWeight: 'bold', width: 24 }}>
                    {ep.numero || idx + 1}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 13 }}>
                      {ep.titulo}
                    </Text>
                    <Text style={{ color: '#A0A3BD', fontSize: 11 }}>
                      {ep.duracao || '45 min'}
                    </Text>
                  </View>
                  <IconButton
                    icon="close-circle"
                    size={20}
                    iconColor="#FF5252"
                    onPress={() => removerEpisodio(idx)}
                  />
                </View>
              ))}

              <View style={localStyles.novoEpRow}>
                <TextInput
                  placeholder="Nome do episódio"
                  value={novoEpTitulo}
                  onChangeText={setNovoEpTitulo}
                  mode="outlined"
                  dense
                  textColor="#FFFFFF"
                  style={[localStyles.input, { flex: 2, marginBottom: 0 }]}
                />
                <TextInput
                  placeholder="Duração"
                  value={novoEpDuracao}
                  onChangeText={setNovoEpDuracao}
                  mode="outlined"
                  dense
                  textColor="#FFFFFF"
                  style={[localStyles.input, { flex: 1, marginBottom: 0 }]}
                />
                <IconButton
                  icon="plus-box"
                  iconColor="#F2A900"
                  size={32}
                  onPress={adicionarEpisodio}
                />
              </View>
            </ScrollView>
          </Dialog.ScrollArea>

          <Dialog.Actions style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Button textColor="#A0A3BD" onPress={() => setDialogVisible(false)} disabled={salvando}>
              Cancelar
            </Button>
            <Button
              mode="contained"
              buttonColor="#F2A900"
              textColor="#0F1015"
              loading={salvando}
              disabled={salvando}
              onPress={salvarConteudo}
            >
              Salvar Título
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const localStyles = StyleSheet.create({
  input: {
    marginBottom: 12,
    backgroundColor: '#1C1F2B',
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1C1F2B',
    borderWidth: 1,
    borderColor: '#2A2E40',
  },
  catChipActive: {
    backgroundColor: '#F2A900',
    borderColor: '#F2A900',
  },
  catChipText: {
    color: '#A0A3BD',
    fontSize: 12,
    fontWeight: '700',
  },
  catChipTextActive: {
    color: '#0F1015',
    fontWeight: '800',
  },
  epItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14161F',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#262A3B',
  },
  novoEpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 16,
  },
});

export default Admin;
