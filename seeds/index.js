const mongoose = require('mongoose');
const Campground = require('../models/campground')
const cities = require('./cities');
const https = require("https");
const { places, descriptors } = require('./seedHelpers');

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
    
    for (let i=0; i<30; i++){
        const randomNum = Math.trunc(Math.random() * 1000);
        const price = Math.trunc(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${randomSample(descriptors)} ${randomSample(places)}`,
            location: `${cities[randomNum].city}, ${cities[randomNum].state}`,
            image: 'https://i.imgur.com/DiVMspC.jpeg',
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam ipsa laboriosam soluta architecto! Nostrum illo, recusandae reprehenderit sequi officia dolor!'
        });
        await camp.save();
    }
}

// seedDB();
// deleteDB();