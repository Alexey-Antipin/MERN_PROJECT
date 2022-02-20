const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const bodyParser = require('body-parser')

const app = express();
const PORT = config.get("server.PORT");
const ServerMongoDB = config.get("server.ServerMongoDB");

app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/auth', require("./routes/auth.routes.js"))

// Запуск Сервера
const start = async () => {

    try {

        await mongoose.connect(ServerMongoDB);

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Сервер запущен на порту ${PORT}`)
        });

    } catch (error) {
        console.log("Что-то пошло не так:", error)
    }
};

start();