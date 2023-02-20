import { MongoClient } from "mongodb";

async function MongoDbConnection() {
  //Function para conectar a mongoDb y a la meetup collection.

  const KEY = process.env.MONGODB_KEY;
  const client = await MongoClient.connect(KEY);

  //Iniciamos la database conectada al cliente.
  const dataBase = client.db();
  console.log("You are coneccted to the dataBase");
  //Nos conectamos a la colecion que deseamos
  const conectToMeetupsCollection = dataBase.collection("meetups");

  //Una vez conectados a la coleccion meetups usamos find() para buscar todos los docs.
  const meetups = await conectToMeetupsCollection.find().toArray();

  //Closing DB
  client.close();
}

module.exports = { MongoDbConnection };
