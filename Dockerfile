FROM node:22

WORKDIR /app

COPY client/package.json client/package-lock.json ./
COPY client/.npmrc ./
COPY client/prisma ./prisma

RUN npm install --ignore-scripts
RUN npx prisma generate

COPY client/ .

ENV SKIP_ENV_VALIDATION=1
RUN npm run build

# Copy static assets into the standalone output
RUN cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/public

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

WORKDIR /app/.next/standalone
CMD ["node", "server.js"]
