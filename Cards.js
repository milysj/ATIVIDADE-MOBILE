import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Card, Text, Button, IconButton } from 'react-native-paper';
import { styles } from './css/Styles';

const ModCard = ({ 
  item, 
  onVer, 
  isAdminMode = false, 
  onEditar, 
  onExcluir 
}) => {
  const titulo = item?.titulo || 'Sem título';
  const subtitulo = item?.subtitulo || '';
  const imagemUri = item?.imagem || 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80';
  const categoria = item?.categoria || 'Geral';
  const qtdEpisodios = item?.episodios?.length;

  const handleCardPress = () => {
    if (onVer) {
      onVer(item);
    }
  };

  return (
    <Card style={styles.card} onPress={handleCardPress}>
      {/* Imagem de Capa com Badge de Categoria */}
      <View style={{ position: 'relative' }}>
        <Card.Cover
          style={styles.cardCover}
          source={{ uri: imagemUri }}
        />
        {/* Badge de Categoria */}
        <View style={styles.cardBadge}>
          <Text style={styles.cardBadgeText}>{categoria}</Text>
        </View>

        {/* Indicador de Episódios ou Duração no canto inferior direito da imagem */}
        <View style={localStyles.duracaoBadge}>
          <IconButton icon="play-circle" size={14} iconColor="#F2A900" style={{ margin: 0, padding: 0 }} />
          <Text style={localStyles.duracaoText}>
            {qtdEpisodios ? `${qtdEpisodios} ep.` : 'Assistir'}
          </Text>
        </View>
      </View>

      {/* Conteúdo do Card */}
      <Card.Content style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {titulo}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {subtitulo}
        </Text>
        {item?.descricao ? (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.descricao}
          </Text>
        ) : null}
      </Card.Content>

      {/* Ações em Modo Admin */}
      {isAdminMode ? (
        <View style={styles.adminCardActions}>
          <Button
            icon="pencil"
            mode="outlined"
            compact
            textColor="#F2A900"
            style={{ borderColor: '#F2A900' }}
            onPress={() => onEditar && onEditar(item)}
          >
            Editar
          </Button>
          <Button
            icon="delete"
            mode="contained"
            compact
            buttonColor="#D32F2F"
            textColor="#FFFFFF"
            onPress={() => onExcluir && onExcluir(item)}
          >
            Excluir
          </Button>
        </View>
      ) : (
        <View style={styles.cardFooter}>
          <Text style={{ color: '#F2A900', fontSize: 13, fontWeight: '700' }}>
            Ver episódios e detalhes
          </Text>
          <IconButton icon="arrow-right" iconColor="#F2A900" size={18} style={{ margin: 0 }} />
        </View>
      )}
    </Card>
  );
};

const localStyles = StyleSheet.create({
  duracaoBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 16, 21, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  duracaoText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 2,
  },
});

export default ModCard;