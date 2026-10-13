import React, { useState } from 'react';
import { View, Alert } from 'react-native';

import {
    Appbar,
    TextInput,
    Button,
    Text,
} from 'react-native-paper';

import { styles } from './css/Styles';
import { useAuth } from './services/AuthContext';

const Cadastro = ({ navigation }) => {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
    const { cadastrar, loadingAuth } = useAuth();

    const handleCadastrar = async () => {
        if (!nome.trim() || !email.trim() || !senha.trim()) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert('Atenção', 'A confirmação de senha não confere com a senha digitada.');
            return;
        }

        if (senha.length < 6) {
            Alert.alert('Atenção', 'A senha deve conter pelo menos 6 caracteres.');
            return;
        }

        const res = await cadastrar({
            nome: nome.trim(),
            email: email.trim().toLowerCase(),
            senha: senha,
        });

        if (res.sucesso) {
            Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!', [
                {
                    text: 'Continuar',
                    onPress: () => navigation.navigate('Home'),
                },
            ]);
        } else {
            Alert.alert('Erro no cadastro', res.mensagem);
        }
    };

    return (

        <View style={styles.cadastroContainer}>

            {/* APPBAR */}

            <Appbar.Header style={styles.header}>

                <Appbar.BackAction
                    iconColor="white"
                    onPress={() => navigation.goBack()}
                />

                <Appbar.Content
                    title="Cadastro"
                    titleStyle={styles.title}
                />

            </Appbar.Header>


            {/* FORMULÁRIO */}

            <View style={styles.cadastroContent}>

                <Text
                    variant="headlineMedium"
                    style={styles.cadastroTitulo}
                >
                    Criar conta
                </Text>


                <Text
                    variant="bodyLarge"
                    style={styles.cadastroTexto}
                >
                    Preencha os dados abaixo
                </Text>


                {/* NOME */}

                <TextInput
                    label="Nome"
                    placeholder="Digite seu nome"
                    value={nome}
                    onChangeText={setNome}
                    mode="outlined"
                    left={
                        <TextInput.Icon icon="account" />
                    }
                    style={styles.input}
                />


                {/* E-MAIL */}

                <TextInput
                    label="E-mail"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    mode="outlined"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    left={
                        <TextInput.Icon icon="email" />
                    }
                    style={styles.input}
                />


                {/* SENHA */}

                <TextInput
                    label="Senha"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChangeText={setSenha}
                    mode="outlined"
                    secureTextEntry={!mostrarSenha}
                    left={
                        <TextInput.Icon icon="lock" />
                    }
                    right={
                        <TextInput.Icon
                            icon={mostrarSenha ? 'eye-off' : 'eye'}
                            onPress={() =>
                                setMostrarSenha(!mostrarSenha)
                            }
                        />
                    }
                    style={styles.input}
                />


                {/* CONFIRMAR SENHA */}

                <TextInput
                    label="Confirmar senha"
                    placeholder="Digite novamente sua senha"
                    value={confirmarSenha}
                    onChangeText={setConfirmarSenha}
                    mode="outlined"
                    secureTextEntry={!mostrarConfirmacao}
                    left={
                        <TextInput.Icon icon="lock-check" />
                    }
                    right={
                        <TextInput.Icon
                            icon={
                                mostrarConfirmacao
                                    ? 'eye-off'
                                    : 'eye'
                            }
                            onPress={() =>
                                setMostrarConfirmacao(
                                    !mostrarConfirmacao
                                )
                            }
                        />
                    }
                    style={styles.input}
                />


                {/* CADASTRAR */}

                <Button
                    mode="contained"
                    icon="account-plus"
                    style={styles.cadastroButton}
                    loading={loadingAuth}
                    disabled={loadingAuth}
                    onPress={handleCadastrar}
                >
                    CADASTRAR
                </Button>


                {/* JÁ POSSUI CONTA */}

                <Button
                    mode="text"
                    icon="login"
                    onPress={() =>
                        navigation.navigate('Login')
                    }
                >
                    JÁ TENHO CADASTRO
                </Button>

            </View>

        </View>
    );
};

export default Cadastro;