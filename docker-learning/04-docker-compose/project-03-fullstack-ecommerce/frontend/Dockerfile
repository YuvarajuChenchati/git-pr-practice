FROM nginx:1.27-alpine

# Remove default nginx html
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom nginx reverse proxy config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy web assets
COPY index.html /usr/share/nginx/html/index.html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
