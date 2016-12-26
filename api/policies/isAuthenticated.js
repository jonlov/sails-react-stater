/**
 * isAuthenticated
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
//     let needsAuthentification = req.options.isAuthenticated,
//         user = req.user,
//         // If user is no banned
//         isUser = user && user.roles && !user.roles.banned;
//
//     if (needsAuthentification === undefined)
//         needsAuthentification = true;
//
//     // User is allowed, proceed to the next policy,
//     // or if this is the last policy, the controller
//     if (!needsAuthentification || (req.session.authenticated && isUser)) {
//         return next();
//     }
//
//     // User is not allowed
//     // (default res.forbidden() behavior can be overridden in `config/403.js`)
//     return res.forbidden('You are not permitted to perform this action.');
// };
