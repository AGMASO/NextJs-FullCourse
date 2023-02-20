import { Fragment } from "react";
//EL fragment nos permite añadir varios archivos o componentes jsx
import Head from "next/head";

import { MongoClient, ObjectId } from "mongodb";

import MeetupDetail from "../../components/meetups/MeetupDetail";

export default function MeetupDetails(props) {
  //Hemos creado un nuevo componente especifico para la pagina de DEtails de los meetups. Asi siempre compartilizamos todo
  // y es mucho mas organizado.
  //! Como le hemos dado en el componete la informacion mediante Props, aqui estamos hardcoding la informacion(ahora con props)
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description}></meta>
      </Head>
      <MeetupDetail
        image={props.meetupData.image}
        title={props.meetupData.title}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

//En el caso de pagina dinamicas en las que no hace falta fetch data cada pocos segundos, utilizaremos getStatisProps
//cabe destacar que lo haremos un poco diferente al Index principal de la web debido a que es una pagina Dinamica

//EN primer lugar debemos PREGENERAR las rutas dinamicas que se van a crear. Recuerda que con getStaticProps,
//generamos la pagina durante el BUILD.

//Existe una function predeterminada en nextJs para este cometido getStaticPaths()

export async function getStaticPaths() {
  //aqui deberemos return un objeto array llamado paths que contendrá las urls que se van a genrear por el cliente
  // cuando clicque estas paginas dinamicas. Aqui lo vamos a hardcore

  //Conexion con mongoDb
  const client = await MongoClient.connect(process.env.MONGODB_KEY);

  //Iniciamos la database conectada al cliente.
  const dataBase = client.db();
  console.log("You are coneccted to the dataBase");
  //Nos conectamos a la colecion que deseamos
  const conectToMeetupsCollection = dataBase.collection("meetups");

  const meetups = await conectToMeetupsCollection
    .find({}, { _id: 1 })
    .toArray();
  //El primer bracket es para estipular si queremos algun tipo de filtro.
  //en el segundo {}, si lo dejamos vacio, extraerá todos los campos de nuestro Object. Si le decimos _id: 1, solo cogera el _id

  client.close();

  return {
    //Dentro de paths crearemos params y dentro de el estarán todas las urls que queramos crear ,precedidas del nombre dinamico
    //que le hemos asignado entre braquets. EN este caso [meetupId]

    //!Debemos añadir tambien fallback:true/false.
    //Si es false, le estamos diciendo que todas las urls que indicamos aqui son las unicas válidas.
    //si es true, le decimos que solo hemos creado algunas, y nextjs se encargra de intentar crear dinamicamente otras que
    //no están creadas aqui.

    fallback: "blocking",
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}
export async function getStaticProps(context) {
  //Aqui incluiremos el fetch data for a single meetup

  //! Si hacemos lo mismo que en index.js principal en una pagina dinamica, no funcionará.
  //debemos añadir el parametro predefinido CONTEXT. Este a diferencia de en getserverSideProps() no nos sirve para
  // usar el req y res. pero nos sirve para linkearnos con el getStaticsPaths params y coger la urls de las paginas dinamicas

  const meetupId = context.params.meetupId;

  //Conexion con mongoDb
  const client = await MongoClient.connect(
    "mongodb+srv://guind0:pepe2539@cluster0.54d6isu.mongodb.net/?retryWrites=true&w=majority"
  );

  //Iniciamos la database conectada al cliente.
  const dataBase = client.db();
  console.log("You are coneccted to the dataBase");
  //Nos conectamos a la colecion que deseamos
  const conectToMeetupsCollection = dataBase.collection("meetups");

  //!En este caso, queeremos solo encontrar un meetup especifico para dar detalles solo de el meetup seleccionado
  // para ello debemos buscar por el Id del meetup. que ya l hemos extraido de contex.params.meetupId.

  const selectedMeetup = await conectToMeetupsCollection.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        image: selectedMeetup.image,
        description: selectedMeetup.description,
      },
    },
  };
}
