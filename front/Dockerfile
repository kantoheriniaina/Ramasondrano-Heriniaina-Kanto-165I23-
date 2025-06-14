FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx next telemetry disable
RUN npm run build

FROM node:20-slim
WORKDIR /app
COPY --from=builder /app .
CMD ["npm", "start"]