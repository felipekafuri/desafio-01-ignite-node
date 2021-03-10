const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const { username } = request.headers

  const userNameExists = users.find(user=> user.username === username)

  if(!userNameExists){
    return response.status(404).json({error:'User does not exists'})
  }

  request.user = userNameExists

  return next()
}

app.post('/users', (request, response) => {
  // Complete aqui
  const { name, username } = request.body


  const userNameExists = users.find(user=> user.username === username)

  if(userNameExists){
    return response.status(400).json({
      error: 'Mensagem do erro'
    })
  }

  const user = { 
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  
  users.push(user)

  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request

  return response.status(200).json(user.todos)
 });

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline} = request.body
  const {user} = request 

  const todo = { 
    id:  uuidv4(), // precisa ser um uuid
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todo)

  return response.status(201).send()

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params
  const {title, deadline} = request.body

  let todo = user.todos.find(todo => todo.id === id)
  if(!todo){
    return response.status(404).json({
      error: 'Mensagem do erro'
    })
  }

  todo = Object.assign(todo, {
    title,
    deadline: new Date(deadline)
  })

  return response.status(200).json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params
  const { user } = request
  let todo = user.todos.find(todo => todo.id === id)

  if(!todo){
    return response.status(404).json({
      error: 'Mensagem do erro'
    })
  }

  todo = Object.assign(todo, {
    done: true
  })

  return response.status(200).send()
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request
  const { id } = request.params
  let todo = user.todos.find(todo => todo.id === id)


  if(!todo){
    return response.status(404).json({
      error: 'Mensagem do erro'
    })
  }

  user.todos.splice(todo, 1)

  return response.status(204).send()

});

module.exports = app;