require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

morgan.token('obj', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :obj'));


app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    const currentDate = new Date(); 
    const formattedDate = currentDate.toString(); 
    const count = Person.countDocuments().then(count => {
        response.send(`
            <p>The phonebook has info for ${count} people</p>
            <p>${formattedDate}</p>
            `)
    })
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findByIdAndDelete(id).then(person => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

// add new person
app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "Name or number is missing"
        });
    }

    Person.findOne({name: body.name}).then(existingPerson => {
        if (existingPerson) {
            return response.status(400).json({
                error: "Name must be unique"
            })
        }

        const person = new Person({
            name: body.name,
            number: body.number,
        });

        return person.save()

    })
    .then(savedPerson => response.json(savedPerson))
    .catch(error => next(error))

})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.message == 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})