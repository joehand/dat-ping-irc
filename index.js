var irc = require('irc')
var DatPing = require('dat-ping')
var debug = require('debug')('dat-ping')

var client = new irc.Client('irc.freenode.net', 'dat-ping', {
  channels: ['#dat']
})
var datPing = DatPing({server: 'dat-ping'})

client.addListener('message#dat', function (from, message) {
  if (message.indexOf('dat-ping') > -1) {
    console.log(from + ' => ' + message)
    var key = message.split(' ')[1]
    if (!key || key.length !== 64) {
      console.log('no ping', key)
      return
    }
    console.log('pinging', key)
    runPing(key, function (err, data) {
      if (err) return console.error(err)
      client.say('#dat', `${from}: Ping Success! Server saw ${data.entries} entries in metadata`)
    })
  }
})

client.addListener('pm', function (from, message) {
  console.log('here', message)
  var key = message
  if (!key || key.length !== 64) {
    console.log('no ping', key)
    return
  }
  console.log('pinging', key)
  runPing(key, function (err, data) {
    if (err) return console.error(err)
    client.say(from, `Ping Success! Server saw ${data.entries} entries in metadata`)
  })
})

function runPing (key, cb) {
  datPing.ping(key)
  datPing.on('response', function (data) {
    if (!data) return cb('nope')
    cb(null, data)
  })
}
