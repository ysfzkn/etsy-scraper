FROM nikolaik/python-nodejs:latest
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN pip install beautifulsoup4
RUN pip install lxml
RUN pip install requests
RUN pip install openpyxl

EXPOSE 3000
CMD npm start