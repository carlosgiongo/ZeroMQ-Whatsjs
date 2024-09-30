const defaultApiResponse = require("../../utils/defaultApiResponse");
const ZeroMq = require("../../config/zeromq/zeromq.config");
const fs = require('fs');
const path = require('path');

/**
 * @param {Express} app 
 * @param {ZeroMq} zeroMq  
 */
module.exports = function(app, zeroMq) {
    app.post('/webhooks/set', (req, res) => {
        let { 
            title,
            webhook,
            event,
            content
        } = req.body;

        if(!webhook || !event || !content || !title) return res.status(400).send(defaultApiResponse(400, 'Missing parameters', null));
        
        let actions = null;
        
        try {
            actions = require("../../config/webhooks/actions.json");
        } catch (error) {
            actions = [];
        }
        
        if(!actions) actions = [];
        actions.push({ title, webhook, event, content });
        fs.writeFileSync(path.resolve(__dirname, "../../config/webhooks/actions.json"), JSON.stringify(actions));

       return res.status(200).send(defaultApiResponse(200, 'Action created', null));
    });
}