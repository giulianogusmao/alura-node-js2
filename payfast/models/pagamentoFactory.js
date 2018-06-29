const mysql = require('mysql');

function pagamentoFactory(app) {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'alura_node_payfast'
    });
}

module.exports = () => {
    return pagamentoFactory;
}
