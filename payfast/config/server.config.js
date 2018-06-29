const port = process.env.NODE_PORT || 3000;
const name = 'payfast';

module.exports = () => {
    return { port, name };
}
