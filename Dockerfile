FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=builder /app/dist /app/dist

EXPOSE 5173

HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=10s \
  CMD wget -q --spider http://localhost:5173/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
