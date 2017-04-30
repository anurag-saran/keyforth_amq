var stompit = require('stompit');

var connectOptions = {
  'host': process.env.BROKER_AMQ_STOMP_SERVICE_HOST,    
  'port': process.env.BROKER_AMQ_STOMP_SERVICE_PORT,
  'connectHeaders':{
    'host': process.env.BROKER_AMQ_STOMP_SERVICE_HOST,
    'login': process.env.AMQ_USER,
    'passcode': process.env.AMQ_PASSWORD,
    'heart-beat': '5000,5000'
  }
};

stompit.connect(connectOptions, function(error, client) {
  
  if (error) {
    console.log('connect error ' + error.message);
     console.log(' connectOptions ' + JSON.stringify(connectOptions));
    return;
  }
  
  var sendHeaders = {
    'destination': '/queue/test',
    'content-type': 'text/plain'
  };
  
  var frame = client.send(sendHeaders);
  frame.write('hello');
  frame.end();
  
  var subscribeHeaders = {
    'destination': '/queue/test',
    'ack': 'client-individual'
  };
  
  client.subscribe(subscribeHeaders, function(error, message) {
    
    if (error) {
      console.log('subscribe error ' + error.message);
      return;
    }
    
    message.readString('utf-8', function(error, body) {
      
      if (error) {
        console.log('read message error ' + error.message);
        return;
      }
      
      console.log('received message: ' + body);
      
      client.ack(message);
      
      client.disconnect();
    });
  });
});