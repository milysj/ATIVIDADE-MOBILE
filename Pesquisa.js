import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Appbar, TextInput, Text, ActivityIndicator } from 'react-native-paper';
import { ConteudoService } from './services/api';
import ModCard from './Cards';
import { useAuth } from './services/AuthContext';
import { styles } from './css/Styles';

const Pesquisa = ({ navigation }) => {
    const { isAutenticado } = useAuth();
    const [termo, setTermo] = useState('');
    const [resultados, setResultados] = useState([]);
    const [carregando, setCarregando] = useState(false);

    // Efeito de busca com debounce
    useEffect(() => {
        const timeout = setTimeout(() => {
            buscar(termo);
        }, 400);

        return () => clearTimeout(timeout);
    }, [termo]);

    const buscar = async (texto) => {
        setCarregando(true);
        try {
            const res = await ConteudoService.listar(texto);
            if (res.sucesso && Array.isArray(res.dados)) {
                setResultados(res.dados);
            }
        } catch (error) {
            console.error('Erro na pesquisa:', error);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction
                    iconColor="white"
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Content
                    title="Pesquisar"
                    titleStyle={styles.title}
                />
            </Appbar.Header>

            <View style={{ padding: 15 }}>
                <TextInput
                    label="Pesquisar séries ou episódios"
                    placeholder="Digite um termo (ex: Breaking, 1x01, Dark)..."
                    value={termo}
                    onChangeText={setTermo}
                    mode="outlined"
                    left={<TextInput.Icon icon="magnify" />}
                    right={
                        termo ? (
                            <TextInput.Icon
                                icon="close"
                                onPress={() => setTermo('')}
                            />
                        ) : null
                    }
                />
            </View>

            {carregando ? (
                <View style={{ padding: 30, alignItems: 'center' }}>
                    <ActivityIndicator size="small" color="#F2A900" />
                    <Text style={{ marginTop: 8 }}>Buscando no banco de dados...</Text>
                </View>
            ) : (
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 30 }}
                >
                    {resultados.length === 0 ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <Text variant="bodyMedium" style={{ color: '#777', textAlign: 'center' }}>
                                {termo.trim()
                                    ? `Nenhum resultado encontrado para "${termo}".`
                                    : 'Digite algo acima para pesquisar registros no MongoDB.'}
                            </Text>
                        </View>
                    ) : (
                        resultados.map((item) => (
                            <ModCard
                                key={item._id}
                                item={item}
                                isAutenticado={isAutenticado}
                                onVer={(card) => {
                                    Alert.alert(card.titulo, card.descricao || card.subtitulo);
                                }}
                            />
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
};

export default Pesquisa;