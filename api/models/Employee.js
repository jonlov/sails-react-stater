/**
 * Employee.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    types: {
        toWeb: function(value) {
            return true;
        }
    },
    attributes: {
        user: {
            model: 'user',
            required: true,
            unique: true,
            toWeb: {
                editableOnCreate: true,
                primary: 'username'
            }
        },
        cleaner: 'boolean',
        nannie: 'boolean',
        // Add a reference to Bookings
        jobs: {
            collection: 'booking',
            via: 'employees',
            through: 'job',
            toWeb: {
                notEditable: true,
                primary: 'username',
                searchBy: 'user'
            }
        }
    },
    afterDestroy: function(destroyedRecords, cb) {
        if (destroyedRecords && destroyedRecords.length > 0) {
            return destroyedRecords.map(value => {
                // Update the profile in question with the user's ID
                if (value && value.user)
                    return User.update({
                        id: value.user
                    }, {employee: null}).exec((err, data) => {
                        return cb();
                    });
                }
            );
        }

        // Otherwise just return
        return cb();
    },
    afterCreate: function(newlyInsertedRecord, cb) {
        // If a profile ID was specified, or a profile was created
        // along with the user...
        if (newlyInsertedRecord.user) {
            // Update the profile in question with the user's ID
            return User.update({
                id: newlyInsertedRecord.user
            }, {employee: newlyInsertedRecord.id}).exec((err, data) => {
                return cb(err, data);
            });
        }

        // Otherwise just return
        return cb();
    },
    afterUpdate: function(newlyInsertedRecord, cb) {
        // If a profile ID was specified, or a profile was created
        // along with the user...
        if (newlyInsertedRecord.user) {
            // Update the profile in question with the user's ID
                return User.update({
                    id: newlyInsertedRecord.user
                }, {employee: newlyInsertedRecord.id}).exec(cb);
        }

        // Otherwise just return
        return cb();
    }
};
