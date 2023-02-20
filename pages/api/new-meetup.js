//Only server side code.
//Este codigo nunca va a estar disponible para el cliente, ya que es server code, aunque este en el mismo proyecto
//Una de las ventajas de usar nextJS

//Import MongoDb
import { MongoClient } from "mongodb";

// Lo que pongamos aqui se activara cuando llamamemos esta route --> /api/new-meetup

//Se utiliza por convencion function handler

export default async function handler(req, res) {
  //Podemos chequear que sea un post request y que solo se active este codigo si se ejecuta la url + post method

  if (req.method === "POST") {
    //con req.body obtenemos la data que va en el request incoming
    const data = req.body;

    const { title, image, address, description } = data; //sacamos estos parametros de data

    //conenctando mongoDb

    const client = await MongoClient.connect(
      "mongodb+srv://guind0:pepe2539@cluster0.54d6isu.mongodb.net/?retryWrites=true&w=majority"
    );

    //Iniciamos la database conectada al cliente.
    const dataBase = client.db();
    console.log("You are coneccted to the dataBase");
    //Nos conectamos a la colecion que deseamos
    const conectToMeetupsCollection = dataBase.collection("meetups");

    //Insertamos un nuevo doc en la coleccion
    const result = await conectToMeetupsCollection.insertOne(data);

    console.log(result);

    //Cerramos la conexion a DB
    client.close();

    //Creamos una respuesta tras la operacion

    res.status(201).json({ message: "Meetup inserted" });
  }
}
