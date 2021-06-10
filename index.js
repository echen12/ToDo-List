require('dotenv').config()
const express = require("express")
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())
app.use(express.static('build'))

const Project = require('./models/project')

// get all projects
app.get('/api/projects', (request, response) => {
    Project.find({}).then(projects => {
        response.json(projects)
    })
})

// get individual project
app.get('/api/projects/:id', (request, response) => {
    Project.find({ id: request.params.id }).then(projects => {
        response.json(projects)
    })
})

// delete individual project
app.delete('/api/projects/:id', (request, response) => {
    Project.deleteOne({ id: request.params.id }).then(project => response.json(project))
})

// add individual project
app.post('/api/projects', (request, response) => {
    // get body of post request
    const body = request.body

    if (body.projectName === undefined) {
        return response.status(400).json({ error: "content missing" })
    }

    const project = new Project({
        projectName: body.projectName,
        id: body.id
    })

    project.save().then(savedProject => {
        response.json(savedProject)
        console.log(body)
    })
})

// delete and add individual tasks
app.put('/api/projects/:id', (request, response) => {
    const body = request.body
    const bodyArray = Object.entries(body)
    const filterBody = bodyArray.filter(([key, value]) => key !== "id" && key !== "projectName")
    //console.log(filterBody)
    const toObj = Object.values(Object.fromEntries(filterBody))

    if (bodyArray.length == 1) {
        Project.findOneAndUpdate(
            { id: request.params.id },
            { $pull: { "projects": { task: toObj[0] } } }
        ).then(task => {
            response.json(task)
        })
    }

    if (bodyArray.length != 1) {
        Project.findOneAndUpdate(
            { id: request.params.id },
            { $addToSet: { "projects": { task: toObj[toObj.length - 1] } } }
        ).then(task => {
            response.json(task)
        })
    }

})


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})