# About
A simple Yelp type website which let's you review camping cites
let's you add camp site you visted.

# [Visit The Site](https://campsite-review.up.railway.app/campgrounds)

# Running the app locally
## Setting up local environment
1. Install all the dependencies ```npm install```
2. Create ```.env``` file and populate the following fields
```
NODE_ENV=devlopment
MONGODB_CONNECTION_STRING=<Your mongodb connetion url>
MONGODB_LOCAL=mongodb://localhost:27017/yelp-camp
SESSION_SECRET=<Any secret code you like>
CLOUDINARY_CLOUD_NAME=<Your cloudinary cloud name>
CLOUDINARY_KEY=<Your cloudinary key>
CLOUDINAY_SECRET=<Your cloudinary secret>
MAPBOX_TOKEN=<Your mapbox token>
```
3. Signup for account on [cloudinary](https://cloudinary.com/) and get your cloudinary credentials and on [mapbox](https://www.mapbox.com/) to get your mapbox token.
4. In ```app.js``` file, replace ```process.env.MONGODB_CONNECTION_STRING``` with ```process.env.MONGODB_LOCAL``` if you dont have mongodb atlas cluster created yet.
5. Run the app ```npm start```

# Connect with me.
- [Twitter](https://twitter.com/hrv_vishwakarma)
- [LinkedIn](https://www.linkedin.com/in/harshit-kr-vishwakarma-b57b8b175/)
- [Discord Server](https://discord.com/invite/5PNFxQF2nz)