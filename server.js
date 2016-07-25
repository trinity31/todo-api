var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;  //Retrive port number used on heroku or use 3000
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

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

/*	var matchdTodo;
	//Iterate over todos array. Find the match.

	todos.forEach(function(todo) {
		if(todoId === todo.id) {
			matchdTodo = todo;
		}
	});
*/
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if(matchedTodo)
		res.json(matchedTodo);
	else
		res.status(404).send();

	//res.send('Asking for todo with id of ' + req.params.id)
});

//POST /todos(
app.post('/todos', function(req, res) {
	var body = req.body; //use _.pick to only pick description and completed.
	var body = _.pick(req.body, 'description','completed');
	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	// set body.description to be trimmed value
	body.description = body.description.trim();

	//ADD id field
	body.id = todoNextId;
	todoNextId = todoNextId + 1;

	//push body into array
	todos.push(body);

	//console.log('description: ' + body.description);
	res.json(body);
});

app.listen(PORT, function() {
	console.log('Express listening on port' + PORT + '!');
});