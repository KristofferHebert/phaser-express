// (function () {

var Scores = {}

Scores.XHR = function XHR(method, url, data) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest()
		request.open(method, url)
		request.onreadystatechange = function() {
			request.onload = function() {
				if (this.status >= 200 && this.status < 300) {
					resolve(request.response)
				} else {
					reject({
						status: this.status,
						statusText: request.statusText
					})
				}
			}
			request.onerror = function() {
				reject({
					status: this.status,
					statusText: request.statusText
				})
			}

		}


		if (!data) {
			var data = null
		}
		request.send(data)
	})

}

Scores.getScores = function getScores() {
	return Scores.XHR('GET', '/scores', null)
}

Scores.displayScores = function() {
	Scores.getScores()
		.then(function handleResponse(response) {
			console.log(JSON.parse(response))
		})
		.catch(function(err) {
			console.error('Augh, there was an error!', err.statusText)
		})
}

Scores.saveScores = function saveScores(scoreObject) {
	XHR('POST', '/scores', scoreObject, function handleResponse(err, response) {
		if (err) {
			console.log(response)
			throw "something went wrong"
		}

		return JSON.parse(response.responseText)

	})
}

//     return Scores
//
//
// })(window)
