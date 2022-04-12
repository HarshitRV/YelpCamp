const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

/**
 * Geocoder
 */
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const geocoder = mbxGeocoding({ accessToken: 'pk.eyJ1IjoiaGFyc2hpdHJ2IiwiYSI6ImNsMXV1NXN0MDAyOTAza3IxYXl3MmRnM2QifQ.K6V6gArt4TpYJyxBiyxZ7g' });

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log('connected to db')
});

const randomSample = (arr) => arr[Math.trunc(Math.random() * arr.length)];

const deleteDB = async ()=> {
    await Campground.deleteMany({});
}

const seedDB = async ()=> {

    // const geoData = await geocoder.forwardGeocode({
    //     query: 'Ansley, Nebraskaa',
    //     limit: 1
    // }).send();
    
    for (let i=0; i<30; i++){
        const price = Math.trunc(Math.random() * 20) + 10;
        const randomCity = randomSample(cities);

        const camp = new Campground({
            author: "624feb0d000ec6ab278902fc",
            title: `${randomSample(descriptors)} ${randomSample(places)}`,
            location: `${randomCity.city}, ${randomCity.state}`,
            geometry: {
                type: "Point",
                coordinates: [randomCity.longitude, randomCity.latitude]
            },
            images: [{
                url: 'https://i.imgur.com/DiVMspC.jpeg',
                fileName: ''
            }],
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam ipsa laboriosam soluta architecto! Nostrum illo, recusandae reprehenderit sequi officia dolor!'
        });
        await camp.save();
    }
}

// seedDB();
deleteDB();