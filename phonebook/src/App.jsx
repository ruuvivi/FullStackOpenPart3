import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [showFound, setShowFound] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };
    if (persons.some(existing => existing.name.toLowerCase() === newName.toLocaleLowerCase())) {
      changeNumber(personObject)
        setNewName('');
        setNewNumber('');
    } else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('');
        console.log('new person', personObject)
        setNotificationMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => {
          setNotificationMessage(null);
        }, 5000);
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      })
    }
  };

  const personsToShow = showFound
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(showFound.toLowerCase())
      )
    : persons;

  const deletePerson = id => {
    const person = persons.find(p => p.id.toLocaleLowerCase() === id.toLocaleLowerCase())
    const deletedPerson = { ... person}
    if (window.confirm(`Delete ${deletedPerson.name}?`)) {
      personService
        .remove(id, deletedPerson)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          console.log('Deleted person ', deletedPerson.name)
          
        })
        .catch(error => {
          console.log(error)
          setErrorMessage(`Information of ${deletedPerson.name} has already been removed from the server`)
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
          setPersons(persons.filter(p => p.id !== id))
        })
      }
  }

  const changeNumber = personObject => {
    const person = persons.find(p => p.name.toLocaleLowerCase() === personObject.name.toLocaleLowerCase())
    const changedNumber = { ... person, number: personObject.number}
    if (changedNumber) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personService
          .update(changedNumber.id, changedNumber)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== changedNumber.id ? p : returnedPerson))
            console.log('changed numbe of ', personObject)
            setNotificationMessage(`Changed number of ${returnedPerson.name}`)
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);
            })
      .catch(error => {
        console.log(error)
        alert(`The number of '${personObject.name}' could not be changed on the server`);
      })
    }
  }
}
   
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFoundChange = (event) => {
    setShowFound(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notificationMessage} error={errorMessage}/>
      <Filter showFound={showFound} handleFoundChange={handleFoundChange} />
      <h3>Add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
      personsToShow={personsToShow}
      deletePerson={deletePerson}
      changeNumber={changeNumber}
      />
    </div>
  );
};

export default App;