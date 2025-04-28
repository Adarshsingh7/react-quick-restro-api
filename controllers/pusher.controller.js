const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1891916',
  key: '94e1a249c769b5aa1b47',
  secret: '3ec33fa1508ca18da6e7',
  cluster: 'ap2',
  useTLS: true,
});

exports.notify = (req, res) => {
  const { channel, event, data } = req.body;
  console.log({ channel, event, data });
  pusher
    .trigger(channel, event, data)
    .then(() => {
      res.status(200).send('Notification sent');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error triggering event');
    });
};
