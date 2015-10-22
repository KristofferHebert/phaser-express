(function () {

    let ConfigDefault = {
        scoreUrl : '/score'
    }

    const Config = window.Config | ConfigDefault
    const Scores {}

    Scores.XHR = function XHR(method, url, data, callback) {
        let request = new XMLHttpRequest()

        // when request returns a result set state
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                // success
                callback(null, request)
            } else {
                // error callback
                callback(true, request)
            }
        }

        // configure method and url via props.data string
        request.open(method, url)

        if(!data){
            data = null
        }
        request.send(data)
    }

    Scores.getScores = function getScores(){
        XHR('GET', CONFIG.scoreUrl, function handleResponse(err, response){
            if(err){
                console.log(response)
                throw "something went wrong"
            }

            return JSON.parse(response.responseText)

        })
    }

    Scores.saveScores = function saveScores(scoreObject){
        XHR('POST', CONFIG.scoreUrl, scoreObject ,function handleResponse(err, response){
            if(err){
                console.log(response)
                throw "something went wrong"
            }

            return JSON.parse(response.responseText)

        })
    }

    return Scores


})(window);
