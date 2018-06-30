function CartaoDAO(connection) {
    this._connection = connection;
}

CartaoDAO.prototype.salva = function (cartao, callback) {
    this._connection.query('INSERT INTO cartoes SET ?', cartao, callback);
}

CartaoDAO.prototype.lista = function (callback) {
    this._connection.query('SELECT * FROM cartoes', callback);
}

CartaoDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query("SELECT * FROM cartoes WHERE id = ?", [id], callback);
}

CartaoDAO.prototype.atualiza = function (cartao, callback) {
    this._connection.query(
        `UPDATE cartoes 
        SET status = ?, data = ? 
        WHERE id = ?`,
        [cartao.status, cartao.data, cartao.id], callback);
}

module.exports = () => {
    return CartaoDAO;
}
