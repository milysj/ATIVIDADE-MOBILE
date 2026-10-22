import { Platform } from 'react-native';

// 10.0.2.2 é o IP padrão que o Emulador do Android Studio usa para acessar o computador
const IP_EMULADOR = '10.0.2.2';
const IP_FISICO = '192.168.15.42';

export const API_URL = Platform.select({
  web: 'http://localhost:3000/api',
  android: `http://${IP_EMULADOR}:3000/api`,
  default: `http://${IP_FISICO}:3000/api`,
});

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

export const getAuthToken = () => {
  return authToken;
};

// Wrapper para requisições com os 4 métodos HTTP (GET, POST, PUT, DELETE)
const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.mensagem || 'Ocorreu um erro na requisição.');
    }

    return data;
  } catch (error) {
    console.error(`Erro na requisição ${options.method || 'GET'} ${url}:`, error);
    throw error;
  }
};

export const api = {
  // GET
  get: (endpoint) => request(endpoint, { method: 'GET' }),

  // POST
  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // PUT
  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // DELETE
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};

// Funções de apoio específicas da aplicação
export const AuthService = {
  login: async (email, senha) => {
    const res = await api.post('/auth/login', { email, senha });
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },
  cadastro: async (dados) => {
    const res = await api.post('/auth/register', dados);
    if (res.token) {
      setAuthToken(res.token);
    }
    return res;
  },
};

export const ConteudoService = {
  listar: (termoBusca = '', categoria = '') => {
    const params = [];
    if (termoBusca && termoBusca.trim() !== '') {
      params.push(`busca=${encodeURIComponent(termoBusca.trim())}`);
    }
    if (categoria && categoria !== 'TODOS' && categoria.trim() !== '') {
      params.push(`categoria=${encodeURIComponent(categoria.trim())}`);
    }
    const queryString = params.join('&');
    const endpoint = queryString ? `/conteudos?${queryString}` : '/conteudos';
    return api.get(endpoint);
  },
  buscarPorId: (id) => api.get(`/conteudos/${id}`),
  cadastrar: (conteudo) => api.post('/conteudos', conteudo),
  atualizar: (id, conteudo) => api.put(`/conteudos/${id}`, conteudo),
  excluir: (id) => api.delete(`/conteudos/${id}`),
};

export const UsuarioService = {
  perfil: () => api.get('/usuarios/perfil'),
  atualizar: (id, dados) => api.put(`/usuarios/${id}`, dados),
};
