var moment = require('moment'),
    jwt = require('jsonwebtoken');

module.exports = {
    createToken: function(user) {
        var payload = {
            sub: user.id,
            sessionToken: user.sessionToken,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.sign(payload, ConfigService.TOKEN_SECRET());
    },
    decodeToken: function(token) {
        return jwt.decode(token, ConfigService.TOKEN_SECRET());
    },
    verifyToken: function(token) {
        return jwt.verify(token, ConfigService.TOKEN_SECRET());
    }
}
