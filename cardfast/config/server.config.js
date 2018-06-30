const port = process.env.NODE_PORT || 3001;
const name = 'cardfast';

module.exports = () => {
    return { port, name };
}
