module.exports.sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly : true,
        expires  : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge   : 1000 * 60 * 60 * 24 * 7,
    }
}

module.exports.SECRETS = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_KEY: process.env.CLOUDINARY_KEY,
    CLOUDINAY_SECRET: process.env.CLOUDINAY_SECRET,
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN
}