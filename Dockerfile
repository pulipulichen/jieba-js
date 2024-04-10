#Specify the version of nodejs.
FROM pudding/node-pwa:node-12-20230513

COPY package.json ./
RUN npm i