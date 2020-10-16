const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.listen(3000, function(req, res){
	console.log("Server is runnning on port 3000");
});

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + "/signup.html");
});

app.post('/', function(req, res){
	// console.log(req.body);
	let fname = req.body.fname;
	let lname = req.body.lname;
	let email = req.body.email;

	const data = {
		method: "post",
		members:[
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: fname,
					LNAME: lname
				}
			}
		]
	}

	const jsonData = JSON.stringify(data);

	const url = "https://us10.api.mailchimp.com/3.0/lists/02bdb17fc3";

	const options = {
		method: "POST",
		auth: "jaffreyrodriguez42:7db77d17541c433328ed39bd69fe8332-us10"
	}

	const request = https.request(url, options, function(response){
		response.on("data", function(data){
			const dataObject = JSON.parse(data);
			console.log(response.statusCode);
			if(response.statusCode === 200){
				res.sendFile(__dirname + "/success.html");
			}else{
				res.sendFile(__dirname + "/failure.html");
			}
		})
	});

	request.write(jsonData);
	request.end();

});

app.post('/failure', function(req, res){
	res.redirect('/');
});



// apikey = 7db77d17541c433328ed39bd69fe8332-us10

// audienceid = 02bdb17fc3

// 'https://server.api.mailchimp.com/3.0/lists/{list_id}?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE>' \
//   -H 'authorization: Basic <USERNAME:PASSWORD>' \
//   -d '{"members":[],"update_existing":false}'