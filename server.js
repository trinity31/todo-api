var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;  //Retrive port number used on heroku or use 3000
var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'Wash the dishes',
	completed: true
}]

app.get('/', function(req, res) {
	res.send('TODO API Root');
});

//GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});

//GET /todos/:id
app.get('/todos/:id', function(req,res) {
	var todoId = parseInt(req.params.id, 10);
	var matchdTodo;
	//Iterate over todos array. Find the match.

	todos.forEach(function(todo) {
		if(todoId === todo.id) {
			matchdTodo = todo;
		}
	});

	if(matchdTodo)
		res.json(matchdTodo);
	else
		res.status(404).send();

	//res.send('Asking for todo with id of ' + req.params.id)
});

app.listen(PORT, function() {
	console.log('Express listening on port' + PORT + '!!');
});