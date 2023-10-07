import { MongoClient } from 'mongodb';
// import {mongoose} from 'mongoose';

import dotEnv from "dotenv"

dotEnv.config();

const mongoURI = process.env.mongoUri;

const mongoClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function storeMessageData(userId) {
    try {
        // Connect to the MongoDB database
        await mongoClient.connect();
        console.log('Connected to MongoDB database');

        // Access the database and collection
        const database = mongoClient.db('Discord-Bot');
        const collection = database.collection('user-contest-info');

        // Check if the user's Discord ID already exists in the collection
        const existingData = await collection.findOne({ userId: userId });

        if (existingData) {



            if (existingData.streak != 0) {
                let date1 = new Date();

                let date2 = new Date(`${existingData.timestamp}`);


                let timeDiff = date1 - date2;

                let t = timeDiff / (1000 * 60 * 60 * 24);


                if (t == 1) {
                    // If the user's Discord ID exists, update the existing document with the new message data

                    let str = (existingData.streak)++;
                    let numstr = parseInt(str, 10);
                    numstr += 1;
                    console.log(str + " " + numstr);
                    await collection.updateOne(
                        { userId: userId },
                        { $set: { streak: (numstr), timestamp: new Date() } }
                    );

                    return 'you are done'
                }

                else if (t < 1) {
                    return `you already uptodate`;
                }
                else {

                    await collection.updateOne(
                        { userId: userId },
                        { $set: { streak: 0, timestamp: new Date() } }
                    );
                    return `you are not eligible for contest gifts`
                }

            } else { return `not eligible for gifts but you can work on project to get cirtificstes...` }
        } else {
            // If the user's Discord ID does not exist, insert a new document into the collection
            await collection.insertOne({
                userId: userId,
                streak: 1,
                timestamp: new Date()
            });
            console.log('Message data stored in the database:');
            return `Hello there new user`;
        }
    } catch (error) {
        console.error('Error storing message data:', error);
    } finally {
        // Close the MongoDB connection
        await mongoClient.close();
        console.log('MongoDB connection closed');

    }
};



export { storeMessageData };

