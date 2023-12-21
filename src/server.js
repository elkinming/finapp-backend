let server = require('./main');
const _log = require('./logger/logger');
const port = process.env.PORT || 3000;

server.listen(port, () =>{
    _log.info("Server Init Finish. Listening on Port: " + port)
});