
module.exports = (app) => {
    const route = '/pagamentos',
        pagamentosCtl = new app.controllers.pagamentos(app);

    app
        .get(route, pagamentosCtl.lista)
        .get(`${route}/pagamento/:id`, pagamentosCtl.detalhe)
        .put(`${route}/pagamento/:id`, pagamentosCtl.confirma)
        .delete(`${route}/pagamento/:id`, pagamentosCtl.cancela)
        .post(`${route}/pagamento`, pagamentosCtl.cadastra);
}
