import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthService, UsuarioService, setAuthToken } from './api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);

  // Função para realizar Login
  const login = async (email, senha) => {
    setLoadingAuth(true);
    try {
      const res = await AuthService.login(email, senha);
      if (res.sucesso && res.usuario) {
        setUsuario(res.usuario);
        setAuthToken(res.token);
        return { sucesso: true, usuario: res.usuario };
      }
      return { sucesso: false, mensagem: res.mensagem || 'Falha ao autenticar.' };
    } catch (error) {
      return { sucesso: false, mensagem: error.message || 'Erro ao conectar com o servidor.' };
    } finally {
      setLoadingAuth(false);
    }
  };

  // Função para realizar Cadastro
  const cadastrar = async (dados) => {
    setLoadingAuth(true);
    try {
      const res = await AuthService.cadastro(dados);
      if (res.sucesso && res.usuario) {
        setUsuario(res.usuario);
        setAuthToken(res.token);
        return { sucesso: true, usuario: res.usuario };
      }
      return { sucesso: false, mensagem: res.mensagem || 'Falha ao cadastrar.' };
    } catch (error) {
      return { sucesso: false, mensagem: error.message || 'Erro ao conectar com o servidor.' };
    } finally {
      setLoadingAuth(false);
    }
  };

  // Logout
  const logout = () => {
    setUsuario(null);
    setAuthToken(null);
  };

  // Atualizar dados do usuário no contexto
  const atualizarUsuario = (novosDados) => {
    setUsuario((prev) => (prev ? { ...prev, ...novosDados } : novosDados));
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isAutenticado: !!usuario,
        isAdmin: usuario?.role === 'admin',
        loadingAuth,
        login,
        cadastrar,
        logout,
        atualizarUsuario,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
