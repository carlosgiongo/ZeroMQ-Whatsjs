require('dotenv').config()
const startWhatsJs = require("./config/whatsjs/clientwhats.config");
const ZeroMq = require("./config/zeromq/zeromq.config");

const zeroMq = new ZeroMq();
const app = require("./config/express/express.config"); 

require("./src/routes/index")(app, zeroMq);

app.listen(process.env.EXP_PORT | 2556, () => {
    console.log(`Express server running on port ${process.env.EXP_PORT | 2556}`);
    startWhatsJs(zeroMq);
});
