const express = require("express")
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors())
app.use(express.static('build'))

let projects = [
    {
        projectName: "first project",
        id: 1,
        firstdetail: "first detail"
    },
    {
        projectName: "second project",
        id: 2,
        seconddetail: "second detail"
    },
    {
        projectName: "third project",
        id: 3,
        thirddetail: "third detail"
    }
]

app.get('/api/projects', (request, response) => {
    response.json(projects)
})

app.get('/api/projects/:id', (request, response) => {
    const id = request.params.id
    const project = projects.filter(p => p.id === Number(id))

    if (project) {
        response.json(project)
    } else {
        response.status(404).end()
    }
})

// delete individual project
app.delete('/api/projects/:id', (request, response) => {
    const id = request.params.id
    projects = projects.filter(p => p.id !== Number(id))
    response.status(204).end()
})

// add individual project
app.post('/api/projects', (request, response) => {
    // get body of post request
    const body = request.body
    response.json(body)

    const project = {
        projectName: body.projectName,
        id: body.id
    }

    projects = projects.concat(project)
    //response.json(project)
})

// delete and add individual tasks
app.put('/api/projects/:id', (request, response) => {
    const id = request.params.id
    console.log(request.body)
    let index = projects.findIndex(p => p.id === Number(id))
    projects[index] = request.body
    response.json(projects[index])
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})