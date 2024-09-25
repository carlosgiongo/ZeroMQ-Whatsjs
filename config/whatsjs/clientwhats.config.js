const { Client, LocalAuth } = require('whatsapp-web.js');
const ZeroMq = require('../zeromq/zeromq.config');
const qrcode = require('qrcode-terminal');
const mountResponse = require('../../utils/mountResponse');

/**
 * @param {ZeroMq} zeroMq 
 */
function startWhatsJs(zeroMq){
    console.log('Starting WhatsJs...');

    const client = new Client({
        puppeteer: {
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        },
        authStrategy: new LocalAuth({
            dataPath: 'sessions'
        }),
    });

    client.once('ready', () => {
        console.log('---------------------------------');
        console.log('|      Client is ready!         |');
        console.log('---------------------------------');
    });
    
    client.on('qr', (qr) => {
        qrcode.generate(qr, {small: true});
    });
    
    client.on('message_create', message => {
        let final_message = {
            type: 'message',
            from: message.from,
            content: message.body,
            response: null
        };
        zeroMq.sendMessage(JSON.stringify(final_message));
    });

    client.initialize();

    //--------------------- Event listener to actions ---------------------//

    zeroMq.on('message', (originalMessage) => { 
        let message_parsed = JSON.parse(originalMessage);

        //-- Response to user
        if (message_parsed.type === 'response' && message_parsed.response) {
            client.sendMessage(message_parsed.from, message_parsed.response);
        }
        
        //-- Actions
        if (message_parsed.type === 'message') {
            let newMessage = { 
                type: 'message', 
                from: message_parsed.from, 
                content: message_parsed.content, 
                response: null 
            };

            // ------- Actions call -------- //

            if (message_parsed.content === '!!ping') {
                // console.log(mountResponse(newMessage, 'Pong!'))
                // zeroMq.sendMessage(JSON.stringify(mountResponse(newMessage, 'Pong!')));
                // Make API CALL
            }
        }
    });    
}

module.exports = startWhatsJs;