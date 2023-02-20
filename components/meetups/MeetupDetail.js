import { Fragment } from "react";
//para el css especifico para este componente, utilizamos la feature de REACT module.css
//Al llamar al css de esta forma y al importarlo como ves abajo, se da css solo a este componente

import classes from "./MeetupDetail.module.css";

export default function MeetupDetail(props) {
  return (
    <Fragment>
      <section className={classes.detail}>
        <img src={props.image} />
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </section>
    </Fragment>
  );
}
