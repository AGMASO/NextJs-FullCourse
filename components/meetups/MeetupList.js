import MeetupItem from "./MeetupItem";
import classes from "./MeetupList.module.css";

//MeetupList le estamos pasando un parametro props y que debemos dar tambein a este componente cuando lo llamemos en
//la pagina que lo utilicemos.

function MeetupList(props) {
  return (
    <ul className={classes.list}>
      {props.meetups.map((meetup) => (
        <MeetupItem
          key={meetup.id}
          id={meetup.id}
          image={meetup.image}
          title={meetup.title}
          address={meetup.address}
        />
      ))}
    </ul>
  );
}

export default MeetupList;
