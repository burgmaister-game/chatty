# Chatty multiextension server

Chatty is a very specific server that offers a REST and WebSocket capabilities. Mainly,
it's intended to be used as a standalone platform to provide JS-based games and simple
applications with a simple server to communicate between users.

Chatty doesn't offer any built-in API. The API should be provided by provisioning it
with extensions. These extensions would describe communication like game-protocol messages,
chat-messages, system-messages, and so on. This architecture allows creating one server
that handles a couple of protocols via one infrastructure.

## Extensions

To run simple chatty server inspect following code

```
// construct an instance of the server
const server = new Server();

// make it listen on port 80
server.listen(80);

// register an extension
server.register({
    name:           'chat',
    version:        1,
    restEndpoints:  [
        ChatRooms
    ],
    wsEndpoints: [
        ChatRoom
    ]
});
```