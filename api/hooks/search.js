/**
 * Adds support for count blueprint and binds :model/count route for each RESTful model.
 */

var _ = require('lodash');
var actionUtil = require('sails-hook-blueprints-offshore/actionUtil');
// if(!actionUtil) actionUtil = require('sails/lib/hooks/blueprints/actionUtil');
var pluralize = require('pluralize');

const defaultSearchBlueprint = function(req, res) {
    var Model = actionUtil.parseModel(req);

    // If associations weren't provided with the options, try and get them
    if (!req.options.associations) {
        req.options = _.merge({
            associations: _.cloneDeep(Model.associations)
        }, req.options // Otherwise make sure it's an array of strings of valid association aliases
        );
    }

    // If "populate" wasn't provided in the options, use the default
    if (_.isUndefined(req.options.populate)) {
        req.options.populate = sails.config.blueprints.populate;
    }

    var parseCriteria = actionUtil.parseCriteria(req),
        parseValues = actionUtil.parseValues(req),
        or = [];

    if (parseValues && parseValues.q)
        Object.keys(Model._attributes).map((keyObj) => {
            if (keyObj != Model.primaryKey && keyObj != 'updatedAt' && keyObj != 'createdAt') {
                let obj = {};
                obj[keyObj] = {
                    'contains': parseValues.q
                };
                or.push(obj);
            }
        });

    var query = Model.find().where({or: or});

    // PREPARE TO DO THE QUERY
    // DELETE THE CRITERIAS THAT WE DON'T NEED
    delete parseCriteria.q;

    query.where(parseCriteria)
    .limit(actionUtil.parseLimit(req)).skip(actionUtil.parseSkip(req)).sort(actionUtil.parseSort(req));
    query = actionUtil.populateRequest(query, req);
    query.exec(function found(err, matchingRecords) {
        if (err)
            return res.serverError(err);

        //   // Only `.watch()` for new instances of the model if
        //   // `autoWatch` is enabled.
        //   if (req._sails.hooks.pubsub && req.isSocket) {
        //     Model.subscribe(req, matchingRecords);
        //     if (req.options.autoWatch) { Model.watch(req); }
        //     // Also subscribe to instances of all associated models
        //     _.each(matchingRecords, function (record) {
        //       actionUtil.subscribeDeep(req, record);
        //     });
        //   }
        //
        //   res.ok(matchingRecords);

        return res.send(matchingRecords);

    });
};

module.exports = function(sails) {
    return {
        initialize: function(cb) {
            var config = sails.config.blueprints;
            var countFn = _.get(sails.middleware, 'blueprints.search') || defaultSearchBlueprint;

            sails.on('router:before', function() {
                _.forEach(sails.models, function(model) {
                    var controller = sails.middleware.controllers[model.identity];

                    if (!controller)
                        return;

                    // Validate blueprint config for this controller
                    if (config.prefix) {
                        if (!_(config.prefix).isString()) {
                            return;
                        }
                        if (!config.prefix.match(/^\//)) {
                            config.prefix = '/' + config.prefix;
                        }
                    }

                    // Validate REST route blueprint config for this controller
                    if (config.restPrefix) {
                        if (!_(config.restPrefix).isString()) {
                            return;
                        }
                        if (!config.restPrefix.match(/^\//)) {
                            config.restPrefix = '/' + config.restPrefix;
                        }
                    }

                    var prefix = config.prefix + config.restPrefix;

                    var baseRoute = [prefix, model.identity].join('/');

                    if (config.pluralize && _.get(controller, '_config.pluralize', true)) {
                        baseRoute = pluralize(baseRoute);
                    }

                    var route = baseRoute + '/search';

                    sails.router.bind(route, countFn, null, {controller: model.identity});
                });
            });

            cb();
        }
    }
};
