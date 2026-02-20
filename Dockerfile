FROM node:22-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm build

FROM nginx:1.29.4-alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf  /etc/nginx/conf.d

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]