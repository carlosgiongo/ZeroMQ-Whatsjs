const defaultApiResponse = require("../../utils/defaultApiResponse");
const ZeroMq = require("../../config/zeromq/zeromq.config");
const mountResponse = require("../../utils/mountResponse");

/**
 * @param {Express} app 
 * @param {ZeroMq} zeroMq  
 */
module.exports = function(app, zeroMq) {
    app.post('/api/whatsjs', (req, res) => {
        let {
            content,
            from,
            response
        } = req.body;

        if (!content || !from || !response) return res.status(400).send(defaultApiResponse(400, 'Missing parameters', null));

        let message = mountResponse({ from, content }, response);
        zeroMq.sendMessage(JSON.stringify(message));

        return res.status(200).send(defaultApiResponse(200, 'Message sent', null));
    });
}