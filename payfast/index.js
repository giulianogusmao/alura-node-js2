const app = require('./config/express')();
const server = require('./config/server.config')();

app.listen(server.port, () => {
    console.log(`\n*** Servidor ${server.name} rodando na porta: ${server.port} ***\n`);
});
