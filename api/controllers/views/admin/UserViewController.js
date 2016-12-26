/**
 * admin/UserViewController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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

    index: function(req, res, callback) {
        User.find().exec((err, users)=>{
            return callback({users: users});
        });
    }
};
