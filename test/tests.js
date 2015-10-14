'use strict'
import request from 'supertest'

describe('loading express', ()=> {
	let server
	beforeEach(()=> {
		delete require.cache[require.resolve('../server/server')]
		server = require('../server/server')
	})
	afterEach((done) => {
		server.close(()=> {
			done()
		})
	})
	it('responds to /', (done) => {
		request(server)
			.get('/')
			.expect(200, done)
	})
	it('responds 500 to get scores', (done) => {
		request(server)
			.get('/scores')
			.expect(500, done)
	})
	it('responds 500 to post scores', (done) => {
		request(server)
			.post('/scores')
			.expect(500, done)
	})
	it('404 everything else', (done) => {
		request(server)
			.get('/foo/bar')
			.expect(404, done)
	})
})
