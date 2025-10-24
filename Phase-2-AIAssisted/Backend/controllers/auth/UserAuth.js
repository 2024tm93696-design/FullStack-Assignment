const jwt = require('jsonwebtoken');
const SECRET_KEY = 'this is secret for jwt';


function TokenGenerator(user) {
    return jwt.sign({user}, SECRET_KEY, { expiresIn: '1h' });
}

function TokenVerification(token) {
    let res = jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err);
    if (res instanceof Error) {
        return false;
    } else {
        return true;
    }
}


module.exports = { TokenGenerator, TokenVerification}