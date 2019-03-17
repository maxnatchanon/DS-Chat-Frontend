const ip = {
    loadBalancer: 'http://172.20.10.2:3000',
    primaryBackend: 'http://127.0.0.1:4000',
    secondaryBackend: 'http://127.0.0.1:5000',
    socketServer: 'http://172.20.10.2:3001',
};

module.exports = ip;