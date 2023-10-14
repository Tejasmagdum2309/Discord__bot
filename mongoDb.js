import { MongoClient } from 'mongodb';
// import {mongoose} from 'mongoose';

import dotEnv from "dotenv"

dotEnv.config();

const mongoURI = process.env.mongoUri;

const mongoClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

//TO get starting Date of todays formate
async function getStartOfDay() {
   
    const startOfDay = new Date(); // Create a new Date object to avoid modifying the original date

    // Set hours, minutes, seconds, and milliseconds to zero to get the start of the day
    startOfDay.setHours(0, 0, 0, 0);
    console.log(startOfDay)
    return startOfDay;
}

//logic to know when user updting 
async function changed_Date(oldDate) {
    let date1 = new Date();
    let date2 = new Date(oldDate);
    console.log(date1)
    console.log(date2)
    let timeDiff = date1 - date2;
    let day = timeDiff / (1000 * 60 * 60 * 24);
    return Math.floor(day);
}

//Strek str to int convet and return..
async function strak_Update(oldStrak) {
    let str = (oldStrak);
    let numstr = parseInt(str, 10);
    numstr += 1;

    return numstr
}


//Main streak update function
async function updateStreak(userId) {
    try {
        // Connect to the MongoDB database
        await mongoClient.connect();
        console.log('Connected to MongoDB database');

        // Access the database and collection
        const database = mongoClient.db('Discord-Bot');

        const collection = database.collection('user-contest-info');

        // Check if the user's Discord ID already exists in the collection

        let existingData = await collection.findOne({ userId: userId });



        // If the user's Discord ID exists, update the existing document 
        if (existingData) {

            const day = await changed_Date(existingData.timestamp);
            
            //To update task for initial stages and daily...............
            if (day == 1 || existingData.streak == 0) {

               
                let newstreak = await strak_Update(existingData.streak);
                let neWexistingData = {};
                if(existingData.streak == 0 && existingData.eligibility == "no"){
                    neWexistingData = { streak: newstreak, eligibility: "yes",timestamp: await getStartOfDay() };}
                else{
                    neWexistingData = {streak: newstreak, timestamp: await getStartOfDay()}
                }

                await collection.updateOne(
                    existingData,
                    { $set: neWexistingData }
                );

                return {streak : newstreak,status:"updated"};
            }

            else if (day < 1) {
                return {streak : existingData.streak,status :"alreadyUpdated"}
            }
            else {
               
                let newstreak = await strak_Update(existingData.streak);
        
                let neWexistingData = { eligibility: "no", streak: newstreak, timestamp: await getStartOfDay() };
                
                await collection.updateOne(
                    existingData,
                    { $set: neWexistingData }
                );

                return {streak : newstreak,status:"lateUpdate"}
            }


        }
       
        else {
            return 'notRegistered'
        }
    } catch (error) {
        console.error('Error storing message data:', error);
    } finally {
        // Close the MongoDB connection
        await mongoClient.close();
        console.log('MongoDB connection closed');

    }
};

//Creating new user
async function createNewUser(userId,auser){
    try {
        // Connect to the MongoDB database
        await mongoClient.connect();
        console.log('Connected to MongoDB database');

        // Access the database and collection
        const database = mongoClient.db('Discord-Bot');

        const collection = database.collection('user-contest-info');

        // Check if the user's Discord ID already exists in the collection

        let existingData = await collection.findOne({ userId: userId });



        // if already present
        if (existingData) {
               return 'registeredAlready' 
        }
        // insert a new document into the collection
        else {
            let date = await getStartOfDay();
            
            existingData = {

                userId: userId,
                name : auser,
                eligibility: "no",
                streak: "0",
                timestamp: date
            }
            await collection.insertOne({ ...existingData });

            return 'registerdNow';
        }
    } catch (error) {
        console.error('Error storing message data:', error);
    } finally {
        // Close the MongoDB connection
        await mongoClient.close();
        console.log('MongoDB connection closed');

    }    
}


async function createNewCompitation(competitionData){
    try {
        await mongoClient.connect();
        console.log('Connected to MongoDB database');

        const database = mongoClient.db('Discord-Bot');
        const collection = database.collection('competitions');

        await collection.insertOne(competitionData);
        console.log('Competition data stored in the database:', competitionData);
    } catch (error) {
        console.error('Error storing competition data:', error);
    } finally {
        await mongoClientClient.close();
        console.log('MongoDB connection closed');
    }
}

async function eligibleUsers(){
    try {
        // Connect to the MongoDB database
        await mongoClient.connect();
        console.log('Connected to MongoDB database');

        // Access the database and collection
        const database = mongoClient.db('Discord-Bot');

        const collection = database.collection('user-contest-info');

        // Check if the user's Discord ID already exists in the collection

        let users = await collection.find({ eligibility: "yes" }).toArray();
        
        if(users){
            return users;
        }
        else{
            return 'noOneEligible'
        }
        

    } catch (error) {
        console.error('Error storing message data:', error);
    } finally {
        // Close the MongoDB connection
        await mongoClient.close();
        console.log('MongoDB connection closed');

    }    
}




export { updateStreak,createNewUser,createNewCompitation,eligibleUsers };

