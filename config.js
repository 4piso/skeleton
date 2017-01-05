// Load Modules =================================
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
    label: ['skeleton'],
    store: null
};

// Config =======================================
internals.config = {
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
        connections: [
            {
                labels: internals.label,
                routes: {
                    cors: true
                },
                port: {
                    $filter: 'env',
                    prd: 8080,
                    $default: 8085
                },
                host: {
                    $filter: 'env',
                    prd: '127.0.0.1',
                    $default: 'localhost'
                }
            }
        ],
        registrations: [
            {
                plugin: 'hapi-boom-jsend',
                options: {
                    select: internals.label
                }
            },
            {
                plugin: 'vision',
                options: {
                    select: internals.label
                }
            },
            {
                plugin: 'inert',
                options: {
                    select: internals.label
                }
            },
            {
                plugin: 'scooter',
                options: {
                    select: internals.label
                }
            },
            {
                plugin: {
                    register: 'lout',
                    options: {
                        'apiVersion': Pkg.version
                    }
                },
                options: {
                    select: internals.label
                }
            },
            {
                plugin: './plugins/router',
                options: {
                    select: internals.label
                }
            },
            {
                plugin: './plugins/mailer',
                options: {
                    select: internals.label
                }
            },
            {
                plugin: {
                    register: './plugins/db',
                    options: internals.mongo
                },
                options: {
                    select: internals.label
                }
            },
            {
                plugin: './plugins/shutdown',
                options: {
                    select: internals.label
                }
            },
            {
                plugin: './plugins/version',
                options: {
                    select: internals.label
                }
            },
            {
                plugin: {
                    register: 'good',
                    options: {
                        reporters: {
                            console: [{
                                module: 'good-squeeze',
                                name: 'Squeeze',
                                args: [{ 'log': '*', 'request': '*', 'response': '*', 'error': '*' }]
                            }, {
                                module: 'good-console'
                            }, 'stdout'],
                            'file-error': [
                                {
                                    module: 'good-squeeze',
                                    name: 'Squeeze',
                                    args: [{ 'error': '*', 'log': 'error' }]
                                },
                                {
                                    module: 'good-squeeze',
                                    name: 'SafeJson'
                                },
                                {
                                    module: 'good-file',
                                    args: ['./logs/errors.log']
                                }
                            ],
                            'file-app': [
                                {
                                    module: 'good-squeeze',
                                    name: 'Squeeze',
                                    args: [{ 'log': 'app' }]
                                },
                                {
                                    module: 'good-squeeze',
                                    name: 'SafeJson'
                                },
                                {
                                    module: 'good-file',
                                    args: ['./logs/app.log']
                                }
                            ],
                            'file-mongo': [
                                {
                                    module: 'good-squeeze',
                                    name: 'Squeeze',
                                    args: [{ 'log': 'mongo', request: 'mongo' }]
                                },
                                {
                                    module: 'good-squeeze',
                                    name: 'SafeJson'
                                },
                                {
                                    module: 'good-file',
                                    args: ['./logs/mongo.log']
                                }
                            ]
                        }
                    }
                },
                'options': {
                    'select': internals.label
                }
            },
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