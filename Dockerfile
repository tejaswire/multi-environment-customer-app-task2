FROM node:20-alpine

WORKDIR /usr/src/app

COPY app/package*.json ./
RUN npm install --omit=dev

COPY app/ ./

USER node

EXPOSE 8081

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8081/health || exit 1

CMD ["npm", "start"]