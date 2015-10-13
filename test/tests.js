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
	it('404 everything else', function testPath(done) {
		request(server)
			.get('/foo/bar')
			.expect(404, done)
	})
})
