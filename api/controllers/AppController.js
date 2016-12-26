/**
 * AppController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var fs = require('fs');
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

    serve: function(req, res) {
        // console.log(sails.models['user']);
        let render = () => {
                let end = false;
                if (path.slice(-1) == '/')
                    path = path.slice(0, -1);

                if (!path)
                    return res.view('index', opts);

                var fullPath = __dirname + '/../../views/' + path;

                try {
                    stats = fs.lstatSync(fullPath);
                    res.locals.path = req.path.split(path.split('/')[0] + '/')[1];

                    if (path.split('.ejs').length < 2) {
                        if (stats.isDirectory() && fs.lstatSync(fullPath + '/index.ejs').isFile()) {
                            return res.view(path + '/index.ejs', opts);
                        }
                    } else {
                        if (fs.lstatSync(fullPath).isFile()) {
                            return res.view(path, opts);
                        }
                    }

                } catch (e) {
                    if (path.split('.ejs').length < 2) {
                        path = path + '.ejs';
                        return render();
                    }
                    if (path.split('.ejs').length == 2 && path.split('*').length < 2) {
                        path = path.split('/')[0].split('.ejs')[0] + '/*';
                        return render();
                    }

                    return res.notFound();
                }
            },
            opts = {},
            // if (req.headers['X-PJAX']) opts.layout = null;

            // Get model if exist
            path = req.path.substring(1).toLowerCase(),
            pathArray = path.split('/'),
            controllers = sails.controllers,
            count = 0,
            controller = 'views/' + (pathArray[count] || 'index') + 'view';

        // If not maybe is a subfolder
        if (!controllers[controller]) {
            controller = 'views/' + pathArray[count] + '/' + (pathArray[count + 1] || 'index') + 'view';
            count = 1;
        }

        let action = pathArray[count + 1] || 'index',
            id = req.params.id = pathArray[count + 2];

        if (controllers[controller] && controllers[controller][action]) {
            return controllers[controller][action](req, res, (ctrlOptions) => {
                if (ctrlOptions) {
                    opts = ctrlOptions;
                }
                return render();

            });
        }

        return render();
    }
};
