/**
 * Booking
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    types: {
        toWeb: function() {
            return true;
        }
    },
    attributes: {
        // Add a reference to User
        owner: {
            required: true,
            model: 'user',
            toWeb: {
                editableOnCreate: true,
                primary: 'username',
                populate:'owner'
            }
        },
        // Add a reference to User
        employees: {
            collection: 'employee',
            via: 'jobs',
            through: 'job',
            // dominant: true,
            toWeb: {
                primary: 'username',
                searchBy: 'user',
                populate: 'employees.user'
            }
        },
        datetime: {
            type: 'datetime',
            required: true
            // , after: new Date('Sat Nov 05 1605 00:00:00 GMT-0000')
        },
        hours: {
            type: 'integer',
            required: true,
            min: 2,
            max: 6
        },
        frequency: {
            type: 'string',
            required: true,
            enum: [
                'weekly', 'fortnightly', 'once'
            ],
            defaultsTo: 'weekly'
        },
        status: {
            type: 'string',
            required: true,
            enum: [
                'pending', 'approved', 'denied', 'canceled'
            ],
            defaultsTo: 'pending'
        }

    }

};
