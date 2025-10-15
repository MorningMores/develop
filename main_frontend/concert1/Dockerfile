# Multi-stage build for Nuxt 4 frontend
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build

FROM node:20-alpine
ENV NODE_ENV=production NUXT_HOST=0.0.0.0 NUXT_PORT=3000
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./
RUN npm ci --production
RUN addgroup -g 1001 -S nuxt && adduser -S nuxt -u 1001 && chown -R nuxt:nuxt /app
USER nuxt
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD node -e "require('http').get('http://localhost:3000/', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
CMD ["node", ".output/server/index.mjs"]
