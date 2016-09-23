var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	/*force:true*/
}).then(function() {
	console.log('Everything is synced');
	var where = {
		completed: true
	};

	User.findById(1).then(function(user) {
		user.getTodos({where: {
			completed: false
		}}).then(function(todos) {  //getTodos -> function created automatically
			todos.forEach(function(todo) {

				console.log(todo.toJSON());
			});

/*			Todo.findAll({where: where}).then(function(todo) {
				console.log(todo);;
			}, function(e) {
				console.log('None');
			});*/
		});
	});
/*	User.create({
			email:"andrew@example.com"
		}).then(function() {
			return Todo.create({
				description: "Clean yard"
			});
		}).then(function(todo) {
			return User.findById(1).then(function(user) {
				user.addTodo(todo);    //addTodo -> function created automatically
		});
	})*/
});

