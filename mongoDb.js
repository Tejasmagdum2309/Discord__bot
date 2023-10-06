import {MongoClient} from 'mongodb';
// import {mongoose} from 'mongoose';

const mongoURI = '///';

const mongoClient = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

async function storeMessageData(userId, content) {
    try {
        // Connect to the MongoDB database
        await mongoClient.connect();
        console.log('Connected to MongoDB database');

        // Access the database and collection
        const database = mongoClient.db('your-database-name');
        const collection = database.collection('messages');

        // Check if the user's Discord ID already exists in the collection
        const existingData = await collection.findOne({ userId: userId });

        if (existingData) {
            // If the user's Discord ID exists, update the existing document with the new message data
            await collection.updateOne(
                { userId: userId },
                { $set: { content: content, timestamp: new Date() } }
            );
            console.log('Message data updated in the database:', content);
        } else {
            // If the user's Discord ID does not exist, insert a new document into the collection
            await collection.insertOne({
                userId: userId,
                content: content,
                timestamp: new Date()
            });
            console.log('Message data stored in the database:', content);
        }
    } catch (error) {
        console.error('Error storing message data:', error);
    } finally {
        // Close the MongoDB connection
        await mongoClient.close();
        console.log('MongoDB connection closed');
    }
}

export { storeMessageData };

