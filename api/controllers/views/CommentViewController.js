/**
 * CommentViewController
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
        Comment.find().exec((err, comments)=>{
            return callback({comments: comments});
        });
    }
};
