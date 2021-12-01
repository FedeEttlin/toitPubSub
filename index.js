const grpc = require("@grpc/grpc-js");
const os = require("os");

const baseUrl = "@toitware/api/src/toit/api";

const { PublishClient } = require(`${baseUrl}/pubsub/publish_grpc_pb`);
const { PublishRequest } = require(`${baseUrl}/pubsub/publish_pb`);

const apiUrl = "api.toit.io";
const apiToken = "API KEY"; // Aquí debes de pegar tu Api Key.

async function main(topic, message) {
  const credentials = createCredentials(apiToken);
  await publishMessage(credentials, topic, message);
}

function createCredentials(apiToken) {
  return grpc.credentials.combineChannelCredentials(
    grpc.credentials.createSsl(),
    grpc.credentials.createFromMetadataGenerator((_, cb) => {
      const md = new grpc.Metadata();
      md.set("Authorization", "Bearer " + apiToken);
      cb(null, md);
    })
  );
}

function publishMessage(credentials, topic, message) {
  return new Promise((resolve, reject) => {
    const client = new PublishClient(apiUrl, credentials);
    const req = new PublishRequest();
    req.setTopic(topic);
    req.setPublisherName(os.hostname());
    req.setDataList([Buffer.from(message).toString("base64")]);
    client.publish(req, (err, resp) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

main("cloud:mensajes", "on");
