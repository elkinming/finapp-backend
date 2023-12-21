console.log("Initializing Logger");

const log4js = require('log4js');
const logFileName = process.env.LOG_FILE_NAME || 'app';
const Logger_Path = `${__dirname}/logs/${logFileName}.log`;

log4js.configure({
  appenders: {
    out: {
        type: 'stdout'
    },
    app: {
        type: 'file',
        filename: Logger_Path,
        maxLogSize: '75M',
        // layout: {
        //     type: 'pattern', pattern: '%d %p %f:%l %m'
        // }
    }
  },
  categories: {
    "-": { appenders: [ 'out', 'app' ], level: 'debug',
        // enableCallStack: true
    },
    default: { appenders: [ 'app' ], level: 'debug',
        // enableCallStack: true
    }
  }
});

const logger = log4js.getLogger("-");

logger.level = 'info';
logger.info("Logger Started !!");


// function to access Logger adding the Functions name to the log trace
const logger2 = {};

logger2.info = function(str){
  return logger.info(Get_Function_Name() + " ||| " + str);
};

logger2.error = function(str){
    return logger.error(Get_Function_Name() + " ||| " + str);
};

function Get_Function_Name() {
    let err = new Error();
    let Function_Name = err.stack;
    let Name_Data = '';
    let Line = '';

    // Extraccion de Logs para Linux
    if (process.platform == 'linux'){
      Function_Name = Function_Name.split(" at ");
      Function_Name = Function_Name[3].split(")");
      Function_Name = Function_Name[0].split("/");
      Function_Name = Function_Name[Function_Name.length - 1].split(":");
      Name_Data = Function_Name[0];
      Line = Function_Name[1];

    // Extraccion de Logs para windows
    } else {
      Function_Name = Function_Name.split(")");
      Function_Name = Function_Name[2].split(":");
      Name_Data = Function_Name[1];
      Line = Function_Name[2];
    }

    Name_Data = Name_Data.split("\\");
    Name_Data = Name_Data[Name_Data.length - 1];

    return '  ' + Name_Data + ':' + Line;
    // return '';
}

module.exports = logger2;
