import {NativeEventEmitter, NativeModules} from 'react-native';

const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('locationUpdate', event => {
      console.log(event.eventProperty) // "someValue"
    });

// Function to add data to the queue
addToQueue = async (data) => {
    // queue is initialized as an empty array if gpsQueue doesn't exist.

    console.log("adding to que ", data)

    let queue = JSON.parse(await AsyncStorage.getItem("gpsQueue")) || [];
    console.log("from add que ", queue)
    //add location data to que
    queue.push(data);
    if (queue.length > 10000) {
        queue.shift(); // Remove oldest item if queue exceeds 10,000 items
    }
    console.log("setting que")
    await AsyncStorage.setItem("gpsQueue", JSON.stringify(queue));
};