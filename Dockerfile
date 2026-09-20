FROM node:24-alpine AS client-builder
WORKDIR /app/client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

FROM node:24-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY server/package.json server/package-lock.json ./server/
RUN npm ci --prefix server --omit=dev && npm cache clean --force

COPY server/src ./server/src
COPY --from=client-builder /app/client/dist ./client/dist

RUN chown -R node:node /app
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/api/health').then(r => { if (!r.ok) process.exit(1) }).catch(() => process.exit(1))"

CMD ["npm", "start", "--prefix", "server"]
