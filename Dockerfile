# --- Estágio 1: Builder ---
# Usamos uma imagem Node.js completa para instalar as dependências
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de manifesto de pacotes
COPY package.json package-lock.json ./

# Instala TODAS as dependências, incluindo as de desenvolvimento (caso precise de build steps)
RUN npm install

# Copia o resto do código da sua aplicação
COPY . .

# --- Estágio 2: Production ---
# Usamos uma imagem Node.js mais enxuta para a versão final
FROM node:18-alpine

# Define o ambiente como "produção"
ENV NODE_ENV=production

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de manifesto novamente
COPY package.json package-lock.json ./

# Instala APENAS as dependências de produção (mais leve e seguro)
RUN npm install --omit=dev

# Copia o código da aplicação do estágio anterior
COPY --from=builder /app .

# Expõe a porta que a aplicação vai usar (Render define isso como 10000)
EXPOSE 10000

# O comando para iniciar a sua aplicação quando o container rodar
CMD ["node", "server.js"]
