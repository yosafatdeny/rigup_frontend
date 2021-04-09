FROM nginx

WORKDIR /usr/share/nginx/html/

COPY build/ .

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# CMD ["nginx", "-g", "daemonn off;"]