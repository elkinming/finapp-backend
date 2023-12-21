let bcrypt = require('bcrypt');
let _db = require('./db-connection');
let _log = require('../logger/logger');

let functions = {}

functions.createUser = async (user) => {

    let response = {
        isUserCreated: false,
        isUserRepeated: false,
        error: null
    };
    try {
        _log.info(`Init: createUser, Params: user: ${user}`);

        let userAlreadyExists = await checkIfUserUsernameExists(user.username);
        _log.info('User username already Exist: ' + userAlreadyExists);
        if (userAlreadyExists){
            response.isUserRepeated = true;
            return response;
        }

        // encrypt password
        user.password = await bcrypt.hash(user.password, 10);

        let text = `insert into users ( username, password ) values ( $1, $2 )`;
        let values = [
            user.username.toLowerCase(),
            user.password ,
        ];
        let result = await _db.query(text, values);    
        _log.info(`User Created`);
        // console.log(JSON.stringify(result, null, 2));

        response.isUserCreated = true;
        response.isUserRepeated = false;
        response.error = null;
        return response;

    } catch (error) {
        _log.error('Exception at function createUser, Err: ' + JSON.stringify(error, null, 4));
        response.isUserCreated = false;
        response.isUserRepeated = false;
        response.error = error;
        return response;
    }

}

const checkIfUserUsernameExists = async (username) => {
    let response = false;
    try {
        _log.info(`Init: checkIfUserUsernameExists, Params: username: ${username.toLowerCase()}`);
        let text = '';
        let values = [];

        text = `SELECT * FROM users WHERE username = $1`;
        values = [username.toLowerCase()];

        let result = await _db.query(text, values);   
        _log.info(`Users found: ` + result.rowCount);

        response = result.rowCount == 0 ? false : true;
        return response;

    } catch (error) {
        _log.error('Exception at function checkIfUserUsernameExists, Err: ' + JSON.stringify(error, null, 4));
        response = false;
        return response;
    }
}

// functions.getAllUsers = async () => {

//     let response = {};
//     try {
//         _log.info(`Init: getAllUsers, Params: none`);

//         let text = `SELECT * FROM usuario_sistema WHERE esta_eliminado = $1 ORDER BY nombre_usuario asc`;
//         let values = [EnumDelete.IS_NOT_DELETED];
//         let result = await _db.query(text, values);   
//         _log.info(`Users found: ` + result.rowCount);

//         response.users = result.rows;
//         response.error = null;
//         return response;

//     } catch (error) {
//         _log.error('Exception at function createUser, Err: ' + JSON.stringify(error, null, 4));
//         response.users = [];
//         response.error = error;
//         return response;
//     }

// }

// functions.getUser = async (idUser) => {

//     let response = {};
//     try {
//         _log.info(`Init: getUser, Params: idUser: ${idUser}`);

//         let text = `SELECT * FROM usuario_sistema WHERE id_usuario_sistema = $1 AND esta_eliminado = $2`;
//         let values = [idUser, EnumDelete.IS_NOT_DELETED];
//         let result = await _db.query(text, values);   
//         _log.info(`Users found: ` + result.rowCount);

//         response.user = result.rows[0];
//         response.error = null;
//         return response;

//     } catch (error) {
//         _log.error('Exception at function getUser, Err: ' + JSON.stringify(error, null, 4));
//         response.user = null;
//         response.error = error;
//         return response;
//     }

// }

// functions.updateUser = async (idUser, user) => {

//     let response = {
//         isUserUpdated: false,
//         isUserRepeated: false,
//         error: null
//     };
    
//     try {
//         _log.info(`Init: updateUser.`);

//         let userAlreadyExists = await checkIfUserEmailExists(user.email, idUser);
//         _log.info('User email already Exist: ' + userAlreadyExists);
//         if (userAlreadyExists){
//             response.isUserRepeated = true;
//             return response;
//         }

//         // Validacion de password, ya que puede ser opcional
//         let passwordQuery = '';
//         if (user.password){
//             user.password = await bcrypt.hash(user.password, 10);
//             passwordQuery = `, password = $10`;
//         }

//         let nowDate = new Date().toISOString();

//         let text = `UPDATE usuario_sistema SET 
//             nombre_usuario = $1, email = $2 ${passwordQuery}, departamento_empresa = $3 , cargo_empresa = $4 , 
//             numero_empleado_empresa = $5 , fecha_actualizacion = $6 , id_rol_usuario_sistema = $7 , 
//             id_tipo_empleado_empresa = $8 
//             where id_usuario_sistema = $9
//         `;

//         let values = [
//             user.nombre_usuario,
//             user.email ,
//             user.departamento_empresa ,
//             user.cargo_empresa ,
//             user.numero_empleado_empresa ,
//             nowDate ,
//             user.id_rol_usuario_sistema ,
//             user.id_tipo_empleado_empresa ,
//             idUser
//         ];

//         if (user.password){
//             values.push(user.password);
//         }

//         let result = await _db.query(text, values);    
//         _log.info(`User Updated`);

//         response.isUserUpdated = true;
//         response.error = null;
//         return response;

//     } catch (error) {
//         _log.error('Exception at function updateUser, Err: ' + JSON.stringify(error, null, 4));
//         response.isUserUpdated = false;
//         response.error = error;
//         return response;
//     }

// }

// functions.deleteUser = async (idUser) => {

//     let response = {};
//     try {
//         _log.info(`Init: deleteUser, Params: idUser: ${idUser}`);

//         // let text = `DELETE FROM usuario_sistema WHERE id_usuario_sistema = $1`;
//         let text = `UPDATE usuario_sistema SET esta_eliminado = $1 WHERE id_usuario_sistema = $2`;
//         let values = [EnumDelete.IS_DELETED, idUser];
//         let result = await _db.query(text, values);   
//         // _log.info(JSON.stringify(result, null, 4));
//         _log.info(`Users found: ` + result.rowCount);

//         response.error = null;
//         return response;

//     } catch (error) {
//         _log.error('Exception at function getUser, Err: ' + JSON.stringify(error, null, 4));
//         response.error = error;
//         return response;
//     }

// }



module.exports = functions;