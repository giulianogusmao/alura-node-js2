var cluster = require('cluster');
var os = require('os');

// verifica se o cluster é o nó(thread) principal
if (cluster.isMaster) {

    // cria uma thread para cada cpu
    os.cpus().forEach((cpu, index) => {
        console.log(`Create thread Slave n° ${index}`);
        cluster.fork()
    });

    // acompanha as thread que foram inicializadas e estão com o servidor rodando
    cluster.on("listening", worker => {
        console.log("cluster %d conectado", worker.process.pid);
    });

    // verifica qual das threads foram desconectadas
    cluster.on("disconnect", worker => {
        console.log("cluster %d desconectado", worker.process.pid);
    });

    // cria uma nova thread quando a mesma cair
    cluster.on("exit", function (worker) {
        console.log("cluster %d perdido", worker.process.pid);
        cluster.fork();
    });
} else {
    /**
     * somente as threads do tipo slave (thread secundárias) irão executar a aplicação, a
     * thread principal (master) ficará responável por realizr o balanceamento das threads
     * slaves, distribuindo as requisições que forem chegando;
     */
    require('./index.js');
}
