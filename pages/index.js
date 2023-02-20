//Importamos HEAD para añadir head components such as metadata a nuestra web

import Head from "next/head";

//importamos el componente meetupList para enseñar en la home la lista de neetups mapeados
import MeetupList from "../components/meetups/MeetupList";

//Importamos MongoDB
import { MongoClient } from "mongodb";
import { Fragment } from "react";

//Por ahora damos un dummyMeetup para dar como props al copmponente meetuplist

/*const DUMMY_MEETUPS = [
  {
    id: "m1",
    title: "First MeetUp",
    image:
      "https://cdn.pixabay.com/photo/2016/09/02/16/09/donkey-1639652_960_720.jpg ",
    address: " Some Address 5, 09111, Chemnitz",
    description: "This is a first Meetup",
  },
  {
    id: "m2",
    title: "Second MeetUp",
    image:
      "https://cdn.pixabay.com/photo/2016/09/02/16/09/donkey-1639652_960_720.jpg ",
    address: " Some Address 5, 09111, Chemnitz",
    description: "This is a Second Meetup",
  },
  {
    id: "m3",
    title: "Third MeetUp",
    image:
      "https://cdn.pixabay.com/photo/2016/09/02/16/09/donkey-1639652_960_720.jpg ",
    address: " Some Address 5, 09111, Chemnitz",
    description: "This is a third Meetup",
  },
];*/

export default function HomePage(props) {
  //! Muy importante. El nombre que damos aqui, debe ser igual al que le asiganamos a PROPS en este caso en MeetupList.js
  //! SI no no funcionará

  return (
    <Fragment>
      <Head>
        <title>NextJs Full Course</title>
        <meta
          name="description"
          content="Create and display Meetups. Made with NextJs and React"
        ></meta>
      </Head>
      <MeetupList meetups={props.meetupsDummy} />;
    </Fragment>
  );
}

//exportamos una function especial desde dentro de nuestro page component file.
//Esto lo hacemos para prerenderizar el contenido de la pagina con ya el fetching del contenido y ademas que se
//incluya en el html primero que se renderiza. Bueno para SEO
//esta exportacion de fnction especial de nextjs solo funciona en las PAGES, no en los COMPONETS
//nextJs va a buscar si esta function existe en nuestro page file,  si existe la ejecuta durante el pre-renderizado
//Va a ser lo primero que ejecuta.

//!el significado de esta function es : preparar los props para esta pagina. Por ejemplo aqui necesitaremos los meetups
//! pues esta funcion se encargará de llamar a la API para recibir esta info antes de renderizar el contenido para el cliente
//! ES ASYNC lo que quiere decir que esperará a que esta promise se resuelva, y una vez hecho continuará con el código

//! EN esta function es donde vamos a introducir codigo de server/backend. Podrimaos conectar con una DB o file system.
//!Este codigo nunca va a estar en el lado del client, ya que se ejecuta solo cuando hacemos el BUILD del proyecto.
export async function getStaticProps() {
  //por ejmplo podrimaos fecth data form an API
  //Tambien podriamos crear una nueva api page donde hacer este codigo pero sería redundante. Lo correcto es hacerlo aquí.

  const client = await MongoClient.connect(
    "mongodb+srv://guind0:pepe2539@cluster0.54d6isu.mongodb.net/?retryWrites=true&w=majority"
  );

  //Iniciamos la database conectada al cliente.
  const dataBase = client.db();
  console.log("You are coneccted to the dataBase");
  //Nos conectamos a la colecion que deseamos
  const conectToMeetupsCollection = dataBase.collection("meetups");

  //Una vez conectados a la coleccion meetups usamos find() para buscar todos los docs.
  const meetups = await conectToMeetupsCollection.find().toArray();

  //Closing DB
  client.close();

  //!despues de haber hecho lo que quieras, alfinal siempre hay que retornar un object.

  return {
    //puede haber varios objetos, pero props siempre tiene que existir.
    //será el objeto que le damos a nuestro page component function. HomePage()
    props: {
      //la estructura del props la podemos crear a nuestro gusto y con los nombres que queramos
      //debido a que MongDb crea un ID por defecto que no es String, debemos usar un map para obtener los parametros
      //que queramos solamente.
      meetupsDummy: meetups.map((meetup) => ({
        id: meetup._id.toString(),
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
      })),
    },
    revalidate: 10,
    //el parametro revalidate, transforma la pagina en una ISG, es decir que cada 10 segundos regenera la pagina en busca
    //de novedades en el fetch de data. ajustaremos el numero de segundos segun necesitemos dependiendo de cuantas
    //veces debemos reenerear el contenido.
  };
}

//el Otro meodo para renderizar contenido pero es getServerSideProps.

//Basiamente siginifica preparar los props para nuestra pagina file component, pero en este caso lo hace desde el server.
//No se crea cunado hacemos el build de la App, si no que durante la pagina este live, escuchara cada request y reaccionará
//  haciendo una llamada a la api para sacar el contenido nuevo, o con lo que le hayamos dicho de hacer.

//! SOlo utilizar cuando tenemos informacion que cambia varias veces por segundo. Si no es mejor getStaticProps, ya que
//! es mejor para la velocidad de la pagina. El metodo server hace nuestra pagina lenta.

/*export async function getServerSideProps(context) {
  //el context nos permite acceder a req y res. de la siguiente forma.
  //!En getStaticprops, no podemos acceder a req y res

  const req = context.req;
  const res = context.res;
  //Aqui podemos conectar con API /DB

  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}*/
