var port  = 8000;

module.exports = {
    port: port,
    db: 'mongodb://localhost/ceditordb',
    google: {
        clientID: '1035643126756-oj4bulq5vvojmva1j0bob8c3k1ckrga7.apps.googleusercontent.com',
        clientSecret: 'Z2l17cAhwmn4zqtrnlW2QTcO',
        callbackURL: 'http://localhost:'+ port +'/auth/google/callback'
    }
};