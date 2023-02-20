import Card from "../ui/Card";
import classes from "./MeetupItem.module.css";
import { useRouter } from "next/router";

function MeetupItem(props) {
  //Vamos a crear la conexion entre el boton Sho Details y la pagina [meetupId]
  //Esta página será dinámica y cambiara su URL segun el meetup que seleccionemos.
  //Lo vamos a conseguir con dos Approaches. El primer approach, simplemente pasandole una onClick function

  const router = useRouter();

  function showDetailsHandler() {
    //necesitmaos useRouter hook lo inicializamos en la root function, no dentro de esta.

    //Router.push() es igual a usar LINk
    //creamos una url dinamica, extrayendo el props.id
    router.push("/" + props.id);
  }

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
        </div>
        <div className={classes.actions}>
          <button onClick={showDetailsHandler}>Show Details</button>
        </div>
      </Card>
    </li>
  );
}

export default MeetupItem;
