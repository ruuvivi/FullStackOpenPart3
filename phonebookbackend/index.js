const express = require('express')
const app = express()
const morgan = require('morgan');

const cors = require('cors')

app.use(cors())

require('dotenv').config();

const mongoose = require('mongoose')

const Person = require('./models/person')

//const password = process.argv[2]

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

//const Person = mongoose.model('Person', personSchema)

let persons = [
  /*{
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }*/
]

app.use(express.json())

app.use(morgan('tiny'))

app.use(express.static('dist'))

morgan.token('body', function (req) {if (req.method === 'POST'){ return JSON.stringify(req.body) }})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

/*app.get('/api/persons', (request, response) => {
  response.json(persons)
})*/

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

const generateId = () => {
  return Math.floor(Math.random() * 20000)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number is missing' 
    })
  }

  const filterNames = persons.filter(person => person.name === body.name)
  const nameExists = filterNames.length > 0;
  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/info', (request, response) => {
  const numOfPeople = persons.length
  const currentTime = new Date()
  
  response.send(`
    <p>Phonebook has info for ${numOfPeople} people</p>
    <p>${currentTime}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    console.log('x')
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})