'use strict'
import request from 'supertest'

describe('loading express', function() {
	let server
	beforeEach(function() {
		delete require.cache[require.resolve('../server/server')]
		server = require('../server/server')
	})
	afterEach(function(done) {
		server.close(function () {
			done()
		})
	})
	it('responds to /', function testSlash(done) {
		request(server)
			.get('/')
			.expect(200, done)
	})
	it('responds 500 to get scores', function testScores(done) {
		request(server)
			.get('/scores')
			.expect(500, done)
	})
	it('responds 500 to post scores', function testScores(done) {
		request(server)
			.post('/scores')
			.expect(500, done)
	})
	it('404 everything else', function testPath(done) {
		request(server)
			.get('/foo/bar')
			.expect(404, done)
	})
})
