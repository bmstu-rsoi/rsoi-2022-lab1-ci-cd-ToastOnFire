const request = require('supertest');
const path = '/api/v1/';

var server = require('./server').server;

describe('Get "/persons" tests', function() {
	it('Response is expected JSON structure', function (done) {
	  request(server)
		.get(path+'/persons')
		.expect(200)
		.expect('Content-Type', 'application/json; charset=utf-8')
		.end(done);
	});
})

describe('Post "/persons" tests', function() {
	it('should return HTTP code 200', function (done) {
	  request(server)
		.post(path+'/persons')
		.send({name: 'John', age: 22, address: 'Test street 21', work: 'test work'})
		.expect(201)
		.end(done);
	});
	it('should return HTTP code 400', function (done) {
	  request(server)
		.post(path+'/persons')
		.send({name: 'John', age: 'hello', address: 'Test street 21', work: 'test work'})
		.expect(400)
		.expect({message: 'Invalid data'})
		.end(done);
	});
})

describe('Patch "/persons/{personId}" tests', function() {
	it('should return HTTP code 200', function (done) {
	  request(server)
		.patch(path+'/persons/1')
		.send({name: 'Johnn', age: 22, address: 'Test streeet 21', work: 'test workss'})
		.expect(200)
		.end(done);
	});
	it('should return HTTP code 400', function (done) {
	  request(server)
		.patch(path+'/persons/1')
		.send({name: 'John', age: 'hello', address: 'Test street 21', work: 'test work'})
		.expect(400)
		.expect({message: 'Invalid data'})
		.end(done);
	});
	it('should return HTTP code 404', function (done) {
	  request(server)
		.patch(path+'/persons/1000')
		.send({name: 'John', age: 32, address: 'Test street 21', work: 'test work'})
		.expect(404)
		.expect({message: 'Not found Person for ID'})
		.end(done);
	});
})

describe('Get "/persons/{personId}" tests', function() {
	it('should return HTTP code 200', function (done) {
	  request(server).get(path+'/persons/1').expect(200).end(done);
	});
	it('should return HTTP code 404', function (done) {
	  request(server).get(path+'/persons/1000').expect(404).end(done);
	  request(server).get(path+'/persons/1000').expect(404).end(done);
	});
})