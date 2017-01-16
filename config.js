// Deps =========================================
const Confidence = require('confidence');
const Pkg = require('~/package.json');

// Internals ====================================
const internals = {
    defaults: {
        env: process.env.NODE_ENV || 'dev'
    },
    mongo: {
        db: 'skeleton',
        host: 'localhost',
        port: 27017,
        mongoOptions: {}
    },
    store: null
};

// Config =======================================
internals.config = {
    root: __dirname,
    database: {
        mongodb: internals.mongo
    },
    mailer: {
        'host': 'smtp.gmail.com',
        'port': 465,
        'secure': true,
        'auth': {
            'user': 'test@test.com',
            'pass': 'soporte01'
        },
        'envelope': {
            'name': 'test',
            'from': 'test@test.com'
        }
    },
    manifest: {
        server: {
            cache: {
                engine: require('catbox-redis'),
                host: 'portal.clever-redis.quickcar-rental.composedb.com',
                port: 15924,
                password: 'IJEAHUIIIQYPNHNR',
                partition: 'cache'
            }
        },
        connections: [
            {
                routes: {
                    cors: true
                },
                port: {
                    $filter: 'env',
                    prd: 8000,
                    $default: 1806
                },
                host: {
                    $filter: 'env',
                    prd: '127.0.0.1',
                    $default: 'localhost'
                }
            }
        ],
        registrations: [
            { plugin: 'hapi-boom-jsend' },
            { plugin: 'vision' },
            { plugin: 'inert' },
            { plugin: 'scooter' },
            { plugin: './plugins/heartbeat' },
            { plugin: './plugins/router' },
            { plugin: './plugins/mailer' },
            { plugin: './plugins/shutdown' },
            { plugin: './plugins/version' },
            { plugin: './plugins/auth' },
            { plugin: './plugins/madero' },
            {
                plugin: {
                    register: 'yar',
                    options: {
                        name: 'session',
                        maxCookieSize: 0,
                        cookieOptions: {
                            password: '!?fR!Jd,?3,M}V53mEVG8r}q6m8@~=%7',
                            isSecure: false
                        }
                    }
                }
            },
            {
                plugin: {
                    register: 'lout',
                    options: {
                        'apiVersion': Pkg.version
                    }
                }
            },
            { plugin: {
                    register: './plugins/db',
                    options: internals.mongo
                }
            }

            // {
            //     plugin: {
            //         register: 'good',
            //         options: {
            //             reporters: {
            //                 console: [{
            //                     module: 'good-squeeze',
            //                     name: 'Squeeze',
            //                     args: [{ 'log': '*', 'request': '*', 'response': '*', 'error': '*' }]
            //                 }, {
            //                     module: 'good-console'
            //                 }, 'stdout'],
            //                 // 'file-error': [
            //                 //     {
            //                 //         module: 'good-squeeze',
            //                 //         name: 'Squeeze',
            //                 //         args: [{ 'error': '*', 'log': 'error' }]
            //                 //     },
            //                 //     {
            //                 //         module: 'good-squeeze',
            //                 //         name: 'SafeJson'
            //                 //     },
            //                 //     {
            //                 //         module: 'good-file',
            //                 //         args: ['./logs/errors.log']
            //                 //     }
            //                 // ],
            //                 'file-app': [
            //                     {
            //                         module: 'good-squeeze',
            //                         name: 'Squeeze',
            //                         args: [{ 'log': 'app' }]
            //                     },
            //                     {
            //                         module: 'good-squeeze',
            //                         name: 'SafeJson'
            //                     },
            //                     {
            //                         module: 'good-file',
            //                         args: ['./logs/app.log']
            //                     }
            //                 ],
            //                 // 'file-mongo': [
            //                 //     {
            //                 //         module: 'good-squeeze',
            //                 //         name: 'Squeeze',
            //                 //         args: [{ 'log': 'mongo', request: 'mongo' }]
            //                 //     },
            //                 //     {
            //                 //         module: 'good-squeeze',
            //                 //         name: 'SafeJson'
            //                 //     },
            //                 //     {
            //                 //         module: 'good-file',
            //                 //         args: ['./logs/mongo.log']
            //                 //     }
            //                 // ]
            //             }
            //         }
            //     }
            // },
        ]
    }
};

// Creating confidence store ====================
internals.store = new Confidence.Store(internals.config);

// Exposing GET method fro retrieving conf ======
exports.get = (key, opts = {}) => {

    const criteria = Object.assign({}, internals.defaults, opts);

    return internals.store.get(key, criteria);
};
