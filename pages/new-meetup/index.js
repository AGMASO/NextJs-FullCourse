//Aqui vamos a añadir un form en el que poder añadir nuevos mettups

import { useRouter } from "next/router";
import NewMeetupForm from "../../components/meetups/NewMeetupForm";

export default function NewMeetupPage() {
  //! En el componente form, se ejecuta una function llamada onAddMeetup() cuando hacemos submit de la form.
  //! esta function la tenemos que declarar aquí, y crear un pointer hacia a ella cuando usemos nuestro componente form

  //Usamos useRouter() hook para salir a la pagina principal despues de submit el form

  const router = useRouter();

  async function addMeetUpHandler(enteredMeetupData) {
    //Esta function se ejecuta cuando hacemos submit del form. aqui vamos a añadir la llamada a la API que hemos creado
    //en el server-side. para ello lo primero, hacer async esta function

    const response = await fetch("api/new-meetup", {
      method: "POST",
      body: JSON.stringify(enteredMeetupData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    //Usamos router para salir despues del submit
    router.push("/");
  }

  return <NewMeetupForm onAddMeetup={addMeetUpHandler} />;
}
