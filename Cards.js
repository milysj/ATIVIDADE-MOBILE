import React from 'react';
import { Card, Button, Text } from 'react-native-paper';
import { styles } from './css/Styles';

const ModCard = ({ item, isAutenticado, onEditar, onExcluir, onVer }) => {
    const titulo = item?.titulo || 'Sem título';
    const subtitulo = item?.subtitulo || '';
    const imagemUri = item?.imagem || 'https://picsum.photos/700';

    return (
        <Card style={styles.card}>
            <Card.Title 
                title={titulo} 
                subtitle={subtitulo} 
                titleStyle={styles.cardTitle} 
            />

            <Card.Cover
                style={styles.cardCover}
                source={{ uri: imagemUri }}
            />

            {item?.descricao ? (
                <Card.Content style={{ paddingTop: 8 }}>
                    <Text variant="bodySmall" numberOfLines={2}>
                        {item.descricao}
                    </Text>
                </Card.Content>
            ) : null}

            <Card.Actions style={styles.cardActions}>
                {isAutenticado && (
                    <Button 
                        icon="pencil" 
                        mode="outlined" 
                        compact
                        onPress={() => onEditar && onEditar(item)}
                    >
                        Editar Imagem
                    </Button>
                )}
                {isAutenticado && (
                    <Button 
                        icon="delete" 
                        mode="text" 
                        textColor="#D32F2F" 
                        compact
                        onPress={() => onExcluir && onExcluir(item)}
                    >
                        Excluir
                    </Button>
                )}
                {!isAutenticado && (
                    <Button 
                        icon="eye" 
                        mode="text" 
                        onPress={() => onVer && onVer(item)}
                    >
                        Ver
                    </Button>
                )}
            </Card.Actions>
        </Card>
    );
};

export default ModCard;