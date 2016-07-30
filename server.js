var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000; //Retrive port number used on heroku or use 3000
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('TODO API Root');
});

//GET /todos?completed=false&q=work
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if(query.hasOwnProperty('completed') && query.completed == 'true') {
		where.completed = true;
	} else if(query.hasOwnProperty('completed') && query.completed == 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		}
	}

	db.todo.findAll({where: where}).then(function(todos) {
		res.json(todos);
	}, function(e) {
		res.status(500).send();	
	});
});

//GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if(!!todo) { 
			res.json(todo.toJSON());
		} else {
			res.status(404).send();	
		}
	}, function(e) {
		res.status(500).send();	
	});
});

//POST /todos(
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed');
	
	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(400).json(e);
	});
});

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var id = parseInt(req.params.id, 10);
	var where = {};
	where.id = id;

	db.todo.destroy({where: where}).then(function(todo) {
		res.json(todo.toJSON());
	}, function(e) {
		res.status(404).json( {
			"error": "no todo found with that id"
		});
	});

/*
	var matchedToDelete = _.findWhere(todos, {
		id: idToDelete
	});
	//console.log('matchedToDelete: ' + matchedToDelete);
	if (matchedToDelete) {
		todos = _.without(todos, matchedToDelete);
		res.json(matchedToDelete);
	} else
		res.status(404).json({
			"error": "no todo found with that id"
		});
		*/
});


//PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		console.log('No match for id ' + todoId);
		return res.status(404).send();
	}
	console.log('matchedTodo: ' + matchedTodo);
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		console.log('completed property is not known');
		return res.status(404).send();
	}

	if (body.hasOwnProperty('description') && _isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		console.log('description property is not known');
		return res.status(404).send();
	}

	//Update
	_.extend(matchedTodo, validAttributes);
	res.json(matchedTodo);
});

db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port' + PORT + '!!');
	});	
})


