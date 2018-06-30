const mysql = require('mysql');

function cartaoFactory(app) {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'alura_node_cardfast'
    });
}

module.exports = () => {
    return cartaoFactory;
}
