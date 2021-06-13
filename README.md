# Chatty multiextension server


## Testing

Testing is a little bit strange. Since we need to fire up a server that actually
serves the request, we have to fire up the whole fastify and node stack. At this
moment it behaves strange cause it doesn't really close process that it was
started in. Cause of that when done running `npm run test` it will hang after
all tests ran. Just terminate the process with `ctrl + c`. Later on, I will try
to figure out a way to terminate the server somehow or add an option to terminate
the process. However, the process termination idea doesn't sit well with me
cause the server doesn't own the process so it shouldn't try to terminate it.  