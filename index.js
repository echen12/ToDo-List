const express = require("express")
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
const mongoose = require('mongoose')

const url = `mongodb+srv://projectList:project@cluster0.nt0wp.mongodb.net/projectList?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const projectSchema = new mongoose.Schema({
    projectName: String,
    id: Number,
    projects: [
        { task: String, _id: false }
    ],
})

projectSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
        delete returnedObject._id
    }
})

const Project = mongoose.model("Project", projectSchema)

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


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})