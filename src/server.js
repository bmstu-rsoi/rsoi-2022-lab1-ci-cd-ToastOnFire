function userDataFine(values, type) {
	if (type == 'post' && (!values.name || !Number.isInteger(values.age))) {
		return false;
	} else if (type == 'patch' && !Number.isInteger(values.age)) {
		return false;
	}
	
	return true;
}

const path = '/api/v1';
const serverPortNumber = 8080;
const errors = {error404: {message: 'Not found Person for ID'},
				error400: {message: 'Invalid data'},
}

const { Pool } = require('pg');
const express = require('express');
const server = express();
const pool = new Pool({
	user: 'qpajqeniwodtzn',
	database: 'd5b3d9cm914epo',
	password: '798135733b98c36ba0bd96cb808ff63a3f586402d215c199679a2dde1e0ce7ee',
	port: 5432,
	host: 'ec2-99-80-170-190.eu-west-1.compute.amazonaws.com',
	ssl: {
        rejectUnauthorized: false,
    },
});

const bodyParser = require('body-parser')
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: true
})); 

server.get(path+'/persons', function(request, response) {
	pool.query('SELECT * FROM persons_table', (err, res) => {
		response.status(200).json(res.rows);
	})
});

server.get(path+'/persons/:id', function(request, response) {
	params = request.params;
	values = [params.id];
	pool.query('SELECT * FROM persons_table WHERE id=$1', values, (err, res) => {
		if (res.rows.length == 1)  {
			response.status(200).json(res.rows[0]);
		} else if (res.rows == 0) {
			response.status(404).json(errors.error404);
		}
	})
});

server.post(path+'/persons', function(request, response) {
	new Promise(function(resolve, reject) {
		pool.query('SELECT MAX(id) AS maxid FROM persons_table', (err, res) => {
			let newId = 1;
			if (res.rows.length == 1) {
				newId = res.rows[0].maxid + 1;
			}
			resolve(newId);
		})
	}).then(function(result) {
		if (userDataFine(request.body, 'post')) {
			pool.query('INSERT INTO persons_table (id, name, age, address, work) VALUES ($1,$2,$3,$4,$5)', 
			[result].concat(Object.values(request.body)), (err, res) => {
				response.status(201).header('Location', '/api/v1/persons/'+result).send();
			})
		} else {
			response.status(400).json(errors.error400);
		}
	})
});

server.patch(path+'/persons/:id', function(request, response) {
	params = request.params;
	new Promise(function(resolve, reject) {
		values = [params.id];
		pool.query('SELECT * FROM persons_table WHERE id=$1', values, (err, res) => {
			resolve(res.rows);
		})
	}).then(function(result) {
		if (result.length == 1 && userDataFine(request.body, 'patch')) {
			
			let resRow = result[0];
			for (let param in request.body) {
				if (param in resRow) {
					resRow[param] = request.body[param];
				}
			}
			
			pool.query('UPDATE persons_table SET (id, name, age, address, work) = ($1,$2,$3,$4,$5) WHERE id=$1', 
			Object.values(resRow), (err, res) => {
				response.status(200).json(resRow);
			})
		} else {
			if (result.length != 1)
				response.status(404).json(errors.error404);
			else
				response.status(400).json(errors.error400);
		}
	})
});

server.delete(path+'/persons/:id', function(request, response) {
	params = request.params;
	values = [params.id];
	pool.query('DELETE FROM persons_table WHERE id=$1', values, (err, res) => {
		response.status(204).send();
	})
});

server.listen(serverPortNumber, () => {
	console.log('server works on port '+serverPortNumber);
})

module.exports.server = server;