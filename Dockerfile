FROM node:alpine as builder

WORKDIR /app

COPY ./ /app
RUN npm install \
    && npm run build

FROM node:alpine

COPY --from=builder /app/build/index.js /app/index.js

ENTRYPOINT ["node", "/app/index.js"]