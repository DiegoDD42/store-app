# Store APP Frontend

## Passos para rodar

### Pré-requisitos
- Node.js >= 18
- npm ou yarn
- API backend rodando

### Clonar o projeto
```bash
git clone https://github.com/DiegoDD42/store-app.git
cd store-app
```

### Instale as dependências
```bash
npm install
# ou
yarn
```

### Configuração da API
A URL do backend deve ser configurada em src/services/api.js linha 1:
```js
export const API_URL = 'http://localhost:8080/api/v1';
```
Certifique-se de que o backend Spring Boot esteja rodando na porta configurada.

### Rodando o projeto
Para iniciar o frontend em modo de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```
A aplicação iniciará o servidor em http://localhost:3000  
Abra no navegador para acessar a loja.
