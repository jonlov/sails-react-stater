/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
let bcrypt = require('bcrypt');
module.exports = {
    //model validation messages definitions
    validationMessages: { //hand for i18n & l10n
        email: {
            required: 'Email is required',
            email: 'Provide valid email address',
            unique: 'Email address is already taken'
        },
        username: {
            required: 'Username is required'
        }
    },
    types: {
        toWeb: function() {
            return true;
        }
    },
    attributes: {
        firstName: {
            type: 'string',
            required: true,
            alpha: true,
            minLength: 3,
            maxLength: 32
        },
        lastName: {
            type: 'string',
            required: true,
            alpha: true,
            minLength: 3,
            maxLength: 32
        },
        email: {
            type: 'email',
            required: true,
            minLength: 3,
            maxLength: 32,
            unique: true
        },
        username: {
            type: 'string',
            required: true,
            alphanumericdashed: true,
            unique: true
        },
        password: {
            type: 'string',
            minLength: 6,
            required: true,
            toWeb: {
                encrypted: true
            }
        },
        roles: {
            type: 'JSON',
            defaultsTo: {
                admin: false,
                banned: false
            }
        },
        // Add a reference to Bookings
        bookings: {
            collection: 'booking',
            via: 'owner',
            toWeb: {
                notEditable: true
            }
        },
        // Add a reference to Bookings
        employee: {
            model: 'employee',
            unique: true,
            toWeb: {
                notEditable: true
            }
        },
        validatePassword: function(password, next) {
            bcrypt.compare(password, this.password, next);
        },
        toJSON: function() {
            var obj = this.toObject();
            delete obj.password;
            // obj.employee = (this.toObject().employee)
            //     ? this.toObject().employee[0]
            //     : {};
            // delete obj.roles;
            return obj;
        }
    },
    beforeCreate: function(user, cb) {
        // Force when create to the default roles
        if (user.roles)
            delete user.roles;

        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                    cb(err);
                } else {
                    user.password = hash;
                    cb();
                }
            });
        });
    },
    beforeUpdate: function(user, cb) {
        if (user.roles) {
            let newUserRoles = user.roles;
            user.roles = this._attributes.roles.defaultsTo;
            Object.keys(newUserRoles).map((key) => {
                user.roles[key] = newUserRoles[key];
            });
        }

        cb();

    }
};
