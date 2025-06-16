# Use uma imagem base oficial do Node.js
# 'alpine' é uma versão mais leve do Linux, ideal para contêineres
FROM node:18-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie package.json e package-lock.json (ou yarn.lock) primeiro.
# Isso aproveita o cache do Docker. Se suas dependências não mudarem,
# esta camada não será reconstruída em builds futuras, tornando-as mais rápidas.
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código da aplicação para o diretório de trabalho do contêiner
# O ponto '.' refere-se ao diretório atual na sua máquina host.
COPY . .

# Exponha a porta em que sua aplicação Express está escutando.
# Esta porta é interna ao contêiner. O mapeamento para a sua máquina host será feito no docker-compose.yml.
EXPOSE 3000

# Comando para iniciar a aplicação quando o contêiner for executado.
# Certifique-se de que 'server.js' é o ponto de entrada principal do seu servidor.
CMD ["node", "server.js"]