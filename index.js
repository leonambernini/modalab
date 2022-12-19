const express = require('express');
const axios = require('axios');
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;

app.use(cors({ credentials: true }))

app.get("/test", async (req, res) => {
    return res.json({'ok': true})
});

app.listen(port, () => {
    console.log('Servidor rodando na porta ' + port);
})