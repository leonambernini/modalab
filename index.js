const express = require('express');
const axios = require('axios');
const cors = require("cors");

const app = express();

const port = process.env.PORT || 3000;

app.use(cors({ credentials: true }))

app.post("/webhook/ns/orders", async (req, res) => {

    try {
        const customer_id = req.params.customer;
    
        if( !customer_id ){
            return res.json({error: true, msg: 'ID do cliente não informado.'});
        }
        
        var config = {
            method: 'get',
            url: `https://api.nuvemshop.com.br/v1/${process.env.USER}/customers/${customer_id}?fields=note`,
            headers: { 
                'Authentication': `bearer ${process.env.TOKEN}`
            }
        };
    
        const { data, status } = await axios(config);
            
        if( status !== 200 ){
            return res.json({error: true, msg: `Erro ao consultar cliente. status ${status}`});
        }
        
        if( !data || typeof data !== 'object' ){
            return res.json({error: true, msg: 'Erro ao consultar cliente.'});
        }

        if( 'note' in data  ){
            const { note } = data;
            if( !note || note.trim() === '' ){
                return res.json({success: true, msg: 'Cliente normal', is_special: false});
            }else if( note.indexOf('VIP') >= 0 ){
                return res.json({success: true, msg: 'Cliente especial', is_special: true});
            }
        }
    
        return res.json({error: true, msg: 'Nenhum resultado encontrado.'});
    } catch (error) {
        return res.json({error: true, msg: `Erro ao consultar cliente: ${error}` });
    }
});

app.listen(port, () => {
    console.log('Servidor rodando na porta ' + port);
})