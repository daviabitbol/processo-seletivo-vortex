♻️ Marketplace Circular

O Marketplace circular é uma aplicação web PWA feita para ajudar os estudantes da faculdade em todos os sentidos. Na plataforma, os alunos podem tanto cadastrar materiais para anúncio, como também buscar e adquirir produtos anunciados por outros colegas para o ambiente acadêmico.

🚀 Como Rodar Localmente
Pré-requisitos
    Node.js 18 ou superior
    Docker e Docker Compose (para o banco de dados)
    npm (instalado junto com o Node.js)
1. Backend (API)

# Entrar na pasta da API
cd marketplace-circular-api

# Instalar as dependências
npm install

# Subir o banco de dados PostgreSQL via Docker
docker compose up -d

# Criar o arquivo .env a partir do exemplo
cp .env.example .env

Preencha o .env com os seguintes valores (compatíveis com o docker-compose.yaml):

JWT_SECRET=uma_chave_secreta_qualquer
JWT_EXPIRATION_TIME=3600
DB_HOST=localhost
DB_PORT=5433
DB_USERNAME=postgres
DB_PASSWORD=12345678
DB_NAME=marketplace-circular

Rode as migrations para criar as tabelas no banco:

npm run migration:run

Inicie o servidor em modo de desenvolvimento:

npm run start:dev

A API estará disponível em http://localhost:3000, e a documentação Swagger em http://localhost:3000/docs.

2. Frontend (PWA)

Em outro terminal:

# Entrar na pasta do frontend
cd marketplace-frontend

# Instalar as dependências
npm install

Crie um arquivo .env na raiz de marketplace-frontend apontando para a API local:

VITE_API_URL=http://localhost:3000

Inicie o servidor de desenvolvimento:

npm run dev

A aplicação estará disponível em http://localhost:5173 (padrão do Vite). Para testar a instalação como PWA, gere o build de produção e sirva-o localmente:

npm run build
npm run preview

Depois, acesse pelo navegador do celular (na mesma rede) ou pelo Chrome DevTools em modo mobile e utilize a opção "Instalar aplicativo" / "Adicionar à tela inicial".

🛠 Tecnologias Utilizadas
Backend (marketplace-circular-api)
Tecnologias -
NestJS	Framework principal da API (Node.js + TypeScript) -
TypeORM	ORM para acesso ao banco de dados -
PostgreSQL	Banco de dados relacional -
Socket.IO	Comunicação em tempo real (chat) -
JWT (@nestjs/jwt)	Autenticação e autorização -
bcrypt	Hash de senhas -
class-validator	Validação de dados de entrada (DTOs) -
Swagger (@nestjs/swagger)	Documentação interativa dos endpoints -
Throttler	Rate limiting das requisições -
Docker / Docker Compose	Provisionamento do banco de dados local


Frontend (marketplace-frontend) 
Tecnologias -
React 19 + TypeScript	Biblioteca principal da interface -
Vite	Build tool e servidor de desenvolvimento -
vite-plugin-pwa	Geração do manifest e Service Worker (PWA) -
React Router DOM	Roteamento entre páginas -
Axios	Cliente HTTP para consumo da API -
Socket.IO Client	Conexão com o chat em tempo real -
jwt-decode	Leitura do token JWT no cliente -

📖 Documentação da API

Com o backend rodando, a documentação interativa (Swagger) fica disponível em: http://localhost:3000/docs

🤖 Diário de Bordo da IA

Ferramentas utilizadas

 Gemini
 Claude
 ChatGPT
 
Estratégia de engenharia de prompts


Prompt 1:
a minha requisição não funcionou e deu erro de CORS como resolver?


Prompt 2:
me ajude a implementar um chat entre vendedor e comprador no meu marketplace


Prompt 3:
como eu implemento um repositório?

Link de uma conversa longa de desenvolvimento com a IA: https://share.gemini.google/TEed9H542qBu

Reflexão crítica: 

Teve um momento durante o início/meio do meu projeto no qual eu estava aprendendo Dto e quando fui pedir pra IA me gerar um código exemplo pro Dto que eu estava querendo implementar ela me gerou um em um formato antigo, pois versoes mais recentes do Nest utilizam ? ou ! pra definir os campos e a IA utilizava uma versao mais antiga em que isso não era necessário, assim, eu passei o mouse pra ver qual era o erro e o VSCode me indincou que faltava um indentifier, entao perguntei pra amigos meus com mais experiência o que era isso e como corrigir, eles me explicaram como resolver esse erro e assim eu guiei a IA.

Link do projeto: https://processo-seletivo-vortex.vercel.app/
