FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

<<<<<<< HEAD
EXPOSE 8080
=======
<<<<<<< HEAD
EXPOSE 8080
=======
EXPOSE 3001

ENV PORT=3001
>>>>>>> 19dd94f0b185677226cb0f094c64f9baec816ab3
>>>>>>> ba24849c401000dfadda9388747bb615161fd56a

CMD ["node", "server.js"]