# Usa a imagem oficial do Nginx como base
FROM nginx

# Copia os arquivos do aplicativo para o diretório padrão do Nginx
COPY ./dist /usr/share/nginx/html

# Copia o arquivo de configuração do Nginx para o contêiner
COPY .docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Expõe a porta 80 do Nginx
EXPOSE 80

# Define o comando para iniciar o servidor Nginx quando o contêiner for iniciado
CMD ["nginx", "-g", "daemon off;"]
