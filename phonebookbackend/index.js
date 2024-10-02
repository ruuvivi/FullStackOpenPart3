const express = require('express')
const app = express()

let persons = [
  {
    id: "1",
    content: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    content: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    content: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    content: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const numOfPeople = persons.length
  const currentTime = new Date()
  
  response.send(`
    <p>Phonebook has info for ${numOfPeople} people</p>
    <p>${currentTime}</p>
  `)
})

/*app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    console.log('x')
    response.status(404).end()
  }
}) */

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})