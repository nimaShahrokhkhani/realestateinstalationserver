'use strict';
const session = require('express-session');

function initialize() {

    return session({
        secret: 'realStateClient',
        cookie: {
            httpOnly: true,
            secure: false
        },
        saveUninitialized: false,
        resave: false
    });
}

async function getSession(request) {
    return new Promise((fulfill, reject) => {
        request.sessionStore.get(request.sessionID, (error, session) => {
            if (!error && session) {
                fulfill(session);
            } else {
                reject("sessionExpire");
            }
        });
    });
}

function regenerate(request) {
    return new Promise((fulfill, reject) => {
        request.session.regenerate((error) => {
            if (!error) {
                fulfill(request.session);
            }
            else {
                reject("generalError");
            }
        });
    });
}

function destroy(request, response) {
    return new Promise((fulfill, reject) => {
        request.session = null;
        request.sessionStore.destroy(request.sessionID, (error) => {
            if (!error) {
                response.clearCookie('connect.sid', {path: '/'});
                fulfill();
            } else {
                reject("generalError");
            }
        });
    });
}

module.exports = {initialize, getSession, regenerate, destroy};
