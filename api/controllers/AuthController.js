/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

module.exports = {

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to CommentController)
     */
    _config: {
        actions: false,
        shortcuts: false,
        rest: false
    },

    local: function(req, res) {
        var body = req.body;

        if (!body)
            return res.badRequest({message: req.__('All.Fields.Required')});

        if (!body.username)
            return res.badRequest({
                message: req.__('All.Fields.Required', 'Email')
            });

        if (!body.password)
            return res.badRequest({
                message: req.__('Specific.Field.Required', 'Password')
            });

        passport.authenticate('local', function(err, user, message) {
            if ((err) || (!user) || !user.roles || user.roles.banned) {
                return res.badRequest({message: req.__(message)});
            }

            req.session.authenticated = true;
            // req.session.jwt = JWTService.createToken(user);

            // if it is a websocket req.logIn will not be avaliable
            if (!req.logIn) {
                return res.ok({message: req.__(message), user: user});
            }

            req.logIn(user, function(err) {
                if (err)
                    res.badRequest(err);

                return res.ok({message: req.__(message), user: user});
            });

        })(req, res);
    },

    logout: function(req, res) {
        req.logout();
        delete req.session.authenticated;
        // delete req.session.jwt;
        res.redirect('/');
    }
};
