const app = require('./config/express')();

const port = process.env.NODE_PORT || 3000;
app.listen(port, () => { 
    console.log('Servidor rodando na porta: ' + port);
});