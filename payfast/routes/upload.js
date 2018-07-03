module.exports = (app) => {
    const route = '/upload',
        uploadCtrl = new app.controllers.uploads(app);

    app
        .get(route, (req, res) => {
            res.send('oi');
        })

        .post(`${route}/img`, uploadCtrl.cadastraImg);
}
