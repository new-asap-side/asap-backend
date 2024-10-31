# STEP 1
FROM node:20-slim AS builder
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build

# STEP 2
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app ./

EXPOSE 3000

CMD ["yarn","start:prod"]