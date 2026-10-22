import React, { useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Appbar, TextInput, Text, ActivityIndicator } from 'react-native-paper';
import { ConteudoService } from './services/api';
import ModCard from './Cards';
import { styles } from './css/Styles';

const Pesquisa = ({ navigation }) => {
  const [termo, setTermo] = useState('');
  const [resultados, setResultados] = useState([]);
  const [carregando, setCarregando] = useState(false);

  // Efeito de busca com debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      buscar(termo);
    }, 350);

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

  const abrirDetalhes = (card) => {
    navigation.navigate('DetalhesCard', { item: card });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F1015' }}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction
          iconColor="#FFFFFF"
          onPress={() => navigation.goBack()}
        />
        <Appbar.Content
          title="Pesquisar Catálogo"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <View style={{ padding: 16 }}>
        <TextInput
          label="Buscar por título, categoria ou sinopse..."
          placeholder="Ex: Breaking Bad, Titan, Interestelar..."
          value={termo}
          onChangeText={setTermo}
          mode="outlined"
          textColor="#FFFFFF"
          left={<TextInput.Icon icon="magnify" iconColor="#F2A900" />}
          right={
            termo ? (
              <TextInput.Icon
                icon="close"
                iconColor="#A0A3BD"
                onPress={() => setTermo('')}
              />
            ) : null
          }
          style={{ backgroundColor: '#181A24' }}
        />
      </View>

      {carregando ? (
        <View style={{ padding: 40, alignItems: 'center' }}>
          <ActivityIndicator size="small" color="#F2A900" />
          <Text style={{ marginTop: 10, color: '#A0A3BD' }}>
            Buscando no banco de dados...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 40 }}
        >
          {resultados.length === 0 ? (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Text style={{ color: '#8A8D9F', textAlign: 'center', fontSize: 15 }}>
                {termo.trim()
                  ? `Nenhum título encontrado para "${termo}".`
                  : 'Digite algo acima para pesquisar animes, filmes e séries.'}
              </Text>
            </View>
          ) : (
            resultados.map((item) => (
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

export default Pesquisa;