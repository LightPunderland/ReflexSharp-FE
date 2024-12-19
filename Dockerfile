FROM node:18-alpine as build

# Install build dependencies including Python
RUN apk add --no-cache python3 make g++ pkgconfig cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build-force

CMD rm -rf /var/www/html/assets /var/www/html/index.html /var/www/html/vite.svg && \
    cp -r dist/* /var/www/html/ && \
    echo "Build files copied to /var/www/html" && \
    tail -f /dev/null
