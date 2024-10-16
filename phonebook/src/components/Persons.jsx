import Person from './Person'

const Persons = ({ personsToShow, deletePerson}) => {
    return (
      <>
        {personsToShow.map((person) => (
          <Person
          key={person.id}
          name={person.name}
          number={person.number}
          deletePerson={() => deletePerson(person.id)}/>
        ))}
      </>
    );
  };

  export default Persons