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

Scores.renderScores = function renderScores(scoresArray, nameArray){
    var results = scoresArray.map(function(value, index){
        return '<td>:' + value + ' </td><td>Name:' + nameArray[index] + '</td>'
    })
    console.log(results)
    return results
}

Scores.displayScores = function(selectorId) {
    function handleResponse(response) {
        var container document.getElementById(selectorId)
        var score = JSON.parse(response)
        container.appendChild(Scores.renderScores(score.scores, score.names))
    }

    function handleError(err) {
		console.error('Augh, there was an error!', err)
	}

    Scores.getScores()
		.then(handleResponse)
		.catch(handleError)
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
