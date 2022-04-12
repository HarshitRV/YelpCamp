const MongoStore = require("connect-mongo");


module.exports.sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly : true,
        expires  : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge   : 1000 * 60 * 60 * 24 * 7,
    },
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_CONNECTION_STRING,
        touchAfter: 24 * 60 * 60
    })
}

module.exports.SECRETS = {
    NODE_ENV: process.env.NODE_ENV,
    MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
    MONGODB_LOCAL: process.env.MONGODB_LOCAL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
    CLOUDINAY_SECRET: process.env.CLOUDINAY_SECRET,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN
}