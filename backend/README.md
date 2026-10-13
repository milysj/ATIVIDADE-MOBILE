# Backend API - AtividadeTemplate

API REST desenvolvida em **Node.js** com **TypeScript**, **Express**, **MongoDB** (via Mongoose) e arquitetura **MVC**.

---

## 🏗️ Arquitetura MVC Implementada

A estrutura do projeto está organizada seguindo rigorosamente o padrão **MVC** (Model-View-Controller), onde a camada de apresentação (*View*) em uma API REST é representada pelos retornos JSON formatados e documentados:

```
backend/
├── .env                  # Variáveis de ambiente
├── .env.example          # Exemplo das variáveis de ambiente
├── package.json          # Dependências e scripts
├── tsconfig.json         # Configurações do compilador TypeScript
└── src/
    ├── config/           # Configuração de conexão com o MongoDB
    │   └── database.ts
    ├── models/           # Camada "Model" (Mongoose Schemas & TypeScript Types)
    │   ├── User.ts       # Modelo de Usuário (nome, email, senha, telefone, cpf, imagem)
    │   └── Content.ts    # Modelo de Conteúdo/Cards (titulo, subtitulo, imagem, descricao)
    ├── controllers/      # Camada "Controller" (Lógica de negócio e orquestração)
    │   ├── AuthController.ts     # Cadastro e Login com JWT
    │   ├── UserController.ts     # CRUD de Usuários
    │   └── ContentController.ts  # CRUD de Conteúdos/Imagens com Pesquisa
    ├── routes/           # Camada de Rotas / Endpoints HTTP
    │   ├── authRoutes.ts
    │   ├── userRoutes.ts
    │   ├── contentRoutes.ts
    │   └── index.ts
    ├── middlewares/      # Interceptadores (Autenticação JWT e Tratamento de Erros)
    │   ├── authMiddleware.ts
    │   └── errorMiddleware.ts
    ├── seeds/            # Script para popular banco com dados iniciais
    │   └── seed.ts
    ├── app.ts            # Instância do Express e middlewares globais
    └── server.ts         # Inicialização do servidor HTTP e banco
```

---

## ⚡ Os 4 Métodos HTTP Implementados (CRUD)

| Método | Endpoint | Descrição | Acesso |
|---|---|---|---|
| **POST** | `/api/auth/register` | Cadastra novo usuário | Público |
| **POST** | `/api/auth/login` | Realiza login e gera token JWT | Público |
| **GET** | `/api/conteudos` | Consulta todos os conteúdos (suporta `?busca=termo`) | Público |
| **GET** | `/api/conteudos/:id` | Consulta um conteúdo por ID | Público |
| **POST** | `/api/conteudos` | Cadastra novo conteúdo/card | Autenticado |
| **PUT** | `/api/conteudos/:id` | Altera dados/imagem de um conteúdo | Autenticado |
| **DELETE** | `/api/conteudos/:id` | Exclui um conteúdo/imagem | Autenticado |
| **GET** | `/api/usuarios` | Consulta todos os usuários | Público |
| **GET** | `/api/usuarios/perfil` | Consulta o perfil do usuário logado | Autenticado |
| **GET** | `/api/usuarios/:id` | Consulta usuário por ID | Público |
| **PUT** | `/api/usuarios/:id` | Altera dados do perfil (nome, telefone, cpf, foto) | Autenticado |
| **DELETE** | `/api/usuarios/:id` | Exclui usuário | Autenticado |

---

## ⚙️ Configuração e Execução

### 1. Instalar as dependências
```bash
cd backend
npm install
```

### 2. Configurar o `.env`
Crie ou edite o arquivo `.env` na raiz da pasta `backend`:
```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/atividadedb
JWT_SECRET=chave_secreta_super_segura_para_jwt_token
```
> Se utilizar o **MongoDB Atlas**, substitua `MONGO_URI` pela sua string de conexão da nuvem.

### 3. Popular o banco com dados de teste (Seed)
Executa a criação do usuário padrão (`emerson@email.com` / `123456`) e os primeiros cards (Breaking Bad, etc.):
```bash
npm run seed
```

### 4. Iniciar o servidor em modo de desenvolvimento
```bash
npm run dev
```
O servidor iniciará em `http://localhost:3000`.

---

## 📖 Exemplos de Requisições

### 1. Cadastro de Usuário (`POST /api/auth/register`)
```json
{
  "nome": "Emerson Rocha",
  "email": "emerson@email.com",
  "senha": "senha123",
  "telefone": "(15) 99999-9999",
  "cpf": "000.000.000-00"
}
```

### 2. Login (`POST /api/auth/login`)
```json
{
  "email": "emerson@email.com",
  "senha": "senha123"
}
```
**Resposta:**
```json
{
  "sucesso": true,
  "mensagem": "Login realizado com sucesso!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5c...",
  "usuario": {
    "id": "67...a1",
    "nome": "Emerson Rocha",
    "email": "emerson@email.com"
  }
}
```

### 3. Consulta com Pesquisa Dinâmica (`GET /api/conteudos?busca=bad`)
Retorna os conteúdos cujo título, subtítulo ou descrição coincidem com o termo informado.

### 4. Cadastro de Conteúdo (`POST /api/conteudos`)
*Requer cabeçalho `Authorization: Bearer <token>`*
```json
{
  "titulo": "Better Call Saul",
  "subtitulo": "1x01 - Uno",
  "imagem": "https://picsum.photos/700",
  "descricao": "A vida do advogado Jimmy McGill antes de Breaking Bad.",
  "categoria": "Séries"
}
```

### 5. Edição de Imagem/Conteúdo (`PUT /api/conteudos/:id`)
*Requer cabeçalho `Authorization: Bearer <token>`*
```json
{
  "titulo": "Better Call Saul (Atualizado)",
  "imagem": "https://nova-url-da-imagem.com/foto.jpg"
}
```

### 6. Exclusão de Imagem/Conteúdo (`DELETE /api/conteudos/:id`)
*Requer cabeçalho `Authorization: Bearer <token>`*
Exclui o registro no MongoDB.
