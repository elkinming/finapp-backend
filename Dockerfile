# syntax=docker/dockerfile:1
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
# CMD ["npm", "run", "dev"]
CMD ["npm", "run", "start"]
EXPOSE 3000