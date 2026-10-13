import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { 
    Appbar, 
    Text, 
    FAB, 
    Portal, 
    Dialog, 
    TextInput, 
    Button, 
    ActivityIndicator 
} from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { styles } from './css/Styles';
import ModCard from './Cards';
import { ConteudoService } from './services/api';
import { useAuth } from './services/AuthContext';

const AppBar = ({ navigation }) => {
    const { isAutenticado, usuario } = useAuth();
    const [conteudos, setConteudos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Estados do modal de Cadastro / Edição
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editandoItem, setEditandoItem] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [subtitulo, setSubtitulo] = useState('');
    const [imagem, setImagem] = useState('');
    const [descricao, setDescricao] = useState('');
    const [salvando, setSalvando] = useState(false);

    // Carregar conteúdos do backend MongoDB
    const carregarConteudos = async () => {
        try {
            const res = await ConteudoService.listar();
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
            carregarConteudos();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        carregarConteudos();
    };

    // Abrir modal para novo card
    const abrirNovoModal = () => {
        setEditandoItem(null);
        setTitulo('');
        setSubtitulo('');
        setImagem('https://picsum.photos/700');
        setDescricao('');
        setDialogVisible(true);
    };

    // Abrir modal para editar card existente
    const abrirEditarModal = (item) => {
        setEditandoItem(item);
        setTitulo(item.titulo || '');
        setSubtitulo(item.subtitulo || '');
        setImagem(item.imagem || '');
        setDescricao(item.descricao || '');
        setDialogVisible(true);
    };

    // Salvar (POST ou PUT)
    const salvarConteudo = async () => {
        if (!titulo.trim() || !subtitulo.trim() || !imagem.trim()) {
            Alert.alert('Atenção', 'Título, subtítulo e imagem são obrigatórios.');
            return;
        }

        setSalvando(true);
        try {
            const payload = {
                titulo: titulo.trim(),
                subtitulo: subtitulo.trim(),
                imagem: imagem.trim(),
                descricao: descricao.trim(),
            };

            if (editandoItem) {
                // PUT /api/conteudos/:id
                await ConteudoService.atualizar(editandoItem._id, payload);
                Alert.alert('Sucesso', 'Conteúdo e imagem atualizados!');
            } else {
                // POST /api/conteudos
                await ConteudoService.cadastrar(payload);
                Alert.alert('Sucesso', 'Novo conteúdo cadastrado com sucesso!');
            }

            setDialogVisible(false);
            carregarConteudos();
        } catch (error) {
            Alert.alert('Erro ao salvar', error.message || 'Falha na operação.');
        } finally {
            setSalvando(false);
        }
    };

    // Excluir card (DELETE)
    const confirmarExcluir = (item) => {
        Alert.alert(
            'Excluir Conteúdo',
            `Deseja realmente excluir "${item.titulo}"?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await ConteudoService.excluir(item._id);
                            Alert.alert('Sucesso', 'Conteúdo excluído com sucesso!');
                            carregarConteudos();
                        } catch (error) {
                            Alert.alert('Erro ao excluir', error.message || 'Falha na exclusão.');
                        }
                    },
                },
            ]
        );
    };

    const navigateTo = (tela) => {
        const parent = navigation.getParent();
        if (parent) {
            parent.navigate(tela);
        } else {
            navigation.navigate(tela);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
            <Appbar.Header style={styles.header}>
                <Appbar.Action icon="menu" iconColor="white" onPress={() => navigation.openDrawer()} />
                <Appbar.Content title="Technologic" style={styles.title} />
                <Appbar.Action icon="magnify" onPress={() => navigateTo('Pesquisa')} />
                <Appbar.Action 
                    icon={isAutenticado ? "account-check" : "account"} 
                    onPress={() => navigateTo(isAutenticado ? 'Perfil' : 'Acesso')} 
                />
            </Appbar.Header>

            {/* Abas horizontais do template */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabs}
                contentContainerStyle={styles.tabsContent}
            >
                <View style={styles.tab}>
                    <Text style={styles.tabText}>TODOS</Text>
                </View>
                <View style={styles.tab}>
                    <Text style={styles.tabText}>SÉRIES</Text>
                </View>
                <View style={styles.tab}>
                    <Text style={styles.tabText}>TELA 01</Text>
                </View>
                <View style={styles.tab}>
                    <Text style={styles.tabText}>TELA 02</Text>
                </View>
                <View style={styles.tab}>
                    <Text style={styles.tabText}>TELA 03</Text>
                </View>
            </ScrollView>

            {/* Lista dinâmica de cards */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#F2A900" />
                    <Text style={{ marginTop: 10 }}>Carregando dados do MongoDB...</Text>
                </View>
            ) : (
                <ScrollView
                    style={styles.cards}
                    contentContainerStyle={styles.cardsContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {conteudos.length === 0 ? (
                        <View style={{ padding: 30, alignItems: 'center' }}>
                            <Text variant="bodyLarge" style={{ color: '#666' }}>
                                Nenhum conteúdo cadastrado ainda.
                            </Text>
                        </View>
                    ) : (
                        conteudos.map((item) => (
                            <ModCard
                                key={item._id}
                                item={item}
                                isAutenticado={isAutenticado}
                                onEditar={abrirEditarModal}
                                onExcluir={confirmarExcluir}
                                onVer={(card) => {
                                    Alert.alert(card.titulo, card.descricao || card.subtitulo);
                                }}
                            />
                        ))
                    )}
                </ScrollView>
            )}

            {/* Botão flutuante para adicionar novos cards (Área Administrativa - Visível apenas quando logado) */}
            {isAutenticado && (
                <FAB
                    icon="plus"
                    label="Novo Card"
                    style={{
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0,
                        backgroundColor: '#F2A900',
                    }}
                    color="#FFFFFF"
                    onPress={abrirNovoModal}
                />
            )}

            {/* Modal/Dialog para Cadastrar / Editar Card e Imagem */}
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title>
                        {editandoItem ? 'Editar Imagem / Conteúdo' : 'Novo Conteúdo (Admin)'}
                    </Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label="Título"
                            placeholder="Ex: Breaking Bad"
                            value={titulo}
                            onChangeText={setTitulo}
                            mode="outlined"
                            style={{ marginBottom: 10 }}
                        />
                        <TextInput
                            label="Subtítulo / Episódio"
                            placeholder="Ex: 1x01 - Pilot"
                            value={subtitulo}
                            onChangeText={setSubtitulo}
                            mode="outlined"
                            style={{ marginBottom: 10 }}
                        />
                        <TextInput
                            label="URL da Imagem"
                            placeholder="https://..."
                            value={imagem}
                            onChangeText={setImagem}
                            mode="outlined"
                            style={{ marginBottom: 10 }}
                        />
                        <TextInput
                            label="Descrição (Opcional)"
                            placeholder="Sinopse ou detalhes"
                            value={descricao}
                            onChangeText={setDescricao}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={{ marginBottom: 10 }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(false)} disabled={salvando}>
                            Cancelar
                        </Button>
                        <Button 
                            mode="contained" 
                            onPress={salvarConteudo} 
                            loading={salvando} 
                            disabled={salvando}
                        >
                            Salvar
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </View>
    );
};

export default AppBar;