const { Client, LocalAuth } = require("whatsapp-web.js");
const ZeroMq = require("../zeromq/zeromq.config");
const qrcode = require("qrcode-terminal");
const axios = require("axios");
// const mountResponse = require('../../utils/mountResponse');

/**
 * @param {ZeroMq} zeroMq
 */
function startWhatsJs(zeroMq) {
  console.log("Starting WhatsJs...");

  const client = new Client({
    puppeteer: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
    authStrategy: new LocalAuth({
      dataPath: "sessions",
    }),
  });

  client.once("ready", () => {
    console.log("---------------------------------");
    console.log("|      Client is ready!         |");
    console.log("---------------------------------");
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("message", (message) => {
    let final_message = {
      type: "message",
      from: message.from,
      content: message.body,
      response: null,
    };
    zeroMq.sendMessage(JSON.stringify(final_message));
  });

  client.initialize();

  //--------------------- Event listener to actions ---------------------//

  zeroMq.on("message", (originalMessage) => {
    let message_parsed = JSON.parse(originalMessage);

    // -- Response to user
    if (message_parsed.type === "response" && message_parsed.response) {
      client.sendMessage(message_parsed.from, message_parsed.response);
    }

    // -- Actions
    if (message_parsed.type === "message") {
      try {
        let actions = require("../webhooks/actions.json");
        actions.forEach((action) => {
          if (
            action.event === message_parsed.type &&
            (action.content === message_parsed.content ||
              action.content === "*")
          ) {
            try {
              fetch(action.webhook, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(message_parsed),
              })
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                  }
                  return response.json();
                })
                .catch((error) => {
                  console.error("Error on action:", action, error);
                });
            } catch (error) {
              console.error("Error on action:", action, error); // Log the specific action and error
            }
          }
        });
      } catch (error) {
        console.error("Error processing actions:", error); // Log the error related to actions
      }
    }
  });
}

module.exports = startWhatsJs;
