const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'warriors-commentary-api',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'warriors-commentary-group' });

async function initializeKafka() {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({ topic: 'warriors-commentary', fromBeginning: true });

  console.log('Kafka producer and consumer initialized');
}

async function sendCommentary(commentary) {
  try {
    await producer.send({
      topic: 'warriors-commentary',
      messages: [
        { value: JSON.stringify(commentary) },
      ],
    });
    console.log('Commentary sent to Kafka');
  } catch (error) {
    console.error('Error sending commentary to Kafka:', error);
  }
}

async function consumeCommentary(callback) {
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const commentary = JSON.parse(message.value.toString());
      callback(commentary);
    },
  });
}

module.exports = {
  initializeKafka,
  sendCommentary,
  consumeCommentary,
};
