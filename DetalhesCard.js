import React, { useState } from 'react';
import { View, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import { Text, IconButton, Button, Divider, Portal, Dialog } from 'react-native-paper';
import { styles } from './css/Styles';

const DetalhesCard = ({ route, navigation }) => {
  const item = route.params?.item || {};

  const titulo = item.titulo || 'Detalhes do Título';
  const subtitulo = item.subtitulo || '';
  const imagem = item.imagem || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80';
  const descricao = item.descricao || 'Nenhuma descrição fornecida para esta obra.';
  const categoria = item.categoria || 'Geral';

  // Episódios com fallback inteligente
  const episodios = Array.isArray(item.episodios) && item.episodios.length > 0
    ? item.episodios
    : categoria.toLowerCase().includes('filme')
      ? [{ numero: 1, titulo: 'Filme Completo', duracao: '2h 15min', descricao: 'Aproveite a experiência completa em alta definição.' }]
      : [
          { numero: 1, titulo: '1x01 - Episódio de Estreia', duracao: '45 min', descricao: 'Início da jornada.' },
          { numero: 2, titulo: '1x02 - O Confronto', duracao: '48 min', descricao: 'Novas revelações e conflitos.' },
          { numero: 3, titulo: '1x03 - Ponto de Inflexão', duracao: '50 min', descricao: 'O clímax da primeira parte.' },
        ];

  const [dialogPlayer, setDialogPlayer] = useState(false);
  const [episodioAtual, setEpisodioAtual] = useState(null);

  const assistirEpisodio = (ep) => {
    setEpisodioAtual(ep);
    setDialogPlayer(true);
  };

  return (
    <View style={styles.detalhesContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner de Capa */}
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: imagem }}
            style={styles.detalhesBanner}
            resizeMode="cover"
          />

          {/* Gradiente / Overlay escuro no rodapé da imagem */}
          <View style={localStyles.imageOverlay} />

          {/* Botões do Topo (Voltar e Compartilhar) */}
          <View style={styles.detalhesHeaderOverlay}>
            <IconButton
              icon="arrow-left"
              iconColor="#FFFFFF"
              size={24}
              style={styles.detalhesIconButton}
              onPress={() => navigation.goBack()}
            />
            <IconButton
              icon="share-variant"
              iconColor="#FFFFFF"
              size={22}
              style={styles.detalhesIconButton}
              onPress={() => Alert.alert('Compartilhar', `Compartilhando "${titulo}"...`)}
            />
          </View>
        </View>

        {/* Informações Principais */}
        <View style={styles.detalhesContent}>
          {/* Badge da Categoria */}
          <View style={styles.detalhesCategoria}>
            <Text style={styles.detalhesCategoriaText}>
              {categoria.toUpperCase()}
            </Text>
          </View>

          {/* Título e Subtítulo */}
          <Text style={styles.detalhesTitulo}>{titulo}</Text>
          <Text style={styles.detalhesSubtitulo}>{subtitulo}</Text>

          {/* Botões de Ação Rápida */}
          <View style={localStyles.actionButtonsRow}>
            
            <Button
              mode="outlined"
              icon="plus"
              textColor="#FFFFFF"
              style={localStyles.listButton}
              onPress={() => Alert.alert('Minha Lista', `"${titulo}" adicionado à sua lista!`)}
            >
              Minha Lista
            </Button>
          </View>

          {/* Sinopse */}
          <View style={styles.detalhesSinopseBox}>
            <Text style={styles.detalhesSinopseTitulo}>Sinopse</Text>
            <Text style={styles.detalhesSinopseTexto}>{descricao}</Text>
          </View>

          {/* Lista de Episódios */}
          <View style={styles.episodiosHeader}>
            <Text style={styles.episodiosTitulo}>
              {categoria.toLowerCase().includes('filme') ? 'Mídia Principal' : `Episódios (${episodios.length})`}
            </Text>
          </View>

          {episodios.map((ep, index) => (
            <View key={index} style={styles.episodioCard}>
              <View style={styles.episodioNumeroBadge}>
                <Text style={styles.episodioNumeroText}>{ep.numero || index + 1}</Text>
              </View>

              <View style={styles.episodioInfo}>
                <Text style={styles.episodioTitulo}>{ep.titulo}</Text>
                {ep.duracao ? (
                  <Text style={styles.episodioDuracao}>{ep.duracao}</Text>
                ) : null}
                {ep.descricao ? (
                  <Text style={{ color: '#8A8D9F', fontSize: 12, marginTop: 2 }} numberOfLines={1}>
                    {ep.descricao}
                  </Text>
                ) : null}
              </View>

            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(15, 16, 21, 0.4)',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  playButton: {
    flex: 1.5,
    borderRadius: 10,
    paddingVertical: 4,
  },
  listButton: {
    flex: 1,
    borderRadius: 10,
    borderColor: '#303448',
    paddingVertical: 4,
  },
});

export default DetalhesCard;
