module.exports = function (app, zeroMq) {
    require('./io.routes')(app, zeroMq);
    require('./webhooks.routes')(app, zeroMq);
}