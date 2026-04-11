FROM node:22

WORKDIR /app

COPY package.json package-lock.json .npmrc ./
COPY prisma ./prisma

RUN npm install --ignore-scripts
RUN npx prisma generate

COPY . .

ENV SKIP_ENV_VALIDATION=1
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]
