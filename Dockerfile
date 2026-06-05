FROM node:20-alpine AS builder

WORKDIR /app

ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /app/dist

EXPOSE 5173

HEALTHCHECK --interval=10s --timeout=5s --retries=3 --start-period=10s \
  CMD wget -q --spider http://localhost:5173/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
