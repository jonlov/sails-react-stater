/**
 * jwtAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
    return next();
};
// module.exports = function(req, res, next) {
//     var user = {},
//         redirect = req.param('redirect');
//
//     user.id = (req.session.passport)
//         ? req.session.passport.user
//         : null;
//
//     if (!user.id)
//         return res.forbidden();
//
//     if (redirect == 'true' || redirect == undefined)
//         redirect = true;
//     else
//         redirect = false;
//
//     if (req.session.jwt) {
//         var payload = JWTService.decodeToken(user);
//
//         if (!payload || !payload.sub) {
//             return res.forbidden();
//         }
//
//         user.id = payload.sub;
//     }
//
//     User.findOne({
//         id: user.id
//     }, function(err, user) {
//         if (!user)
//             return res.forbidden();
//
//         //  if (!req.session.authenticated) return res.sessionExpired({
//         //      user: user,
//         //      redirect: redirect
//         //  });
//
//         req.user = user;
//         next();
//     });
//
// };
