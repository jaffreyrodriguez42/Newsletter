const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.listen(process.env.PORT || 3000, function(req, res){
	console.log("Server has started successfully!");
});

app.use(bodyParser.urlencoded({extended: true})); //allows you to parse POST request to the server

app.use(express.static('public')); // we put on "public" folder the static files like css and images

app.get('/', function(req, res){
	res.sendFile(__dirname + "/signup.html"); // res.sendFile - lets you render a file  
});

app.post('/', function(req, res){
	// console.log(req.body);
	let fname = req.body.fname;
	let lname = req.body.lname;
	let email = req.body.email;

	const data = {  // api data from mailchimp api
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

	const jsonData = JSON.stringify(data); // converted to json

	const url = "https://us10.api.mailchimp.com/3.0/lists/02bdb17fc3"; // mailchimp api endpoint or url 

	const options = { // from the https node module
		method: "POST",
		auth: "jaffreyrodriguez42:7db77d17541c433328ed39bd69fe8332-us10"
	}

	const request = https.request(url, options, function(response){  // the https.request needs to be put on container "request"
		response.on("data", function(data){
			const dataObject = JSON.parse(data); // converted to javascript object
			console.log(response.statusCode); 
			if(response.statusCode === 200){ // if the request is successful
				res.sendFile(__dirname + "/success.html");
			}else{
				res.sendFile(__dirname + "/failure.html");
			}
		})
	});

	request.write(jsonData); // data sent to the mailchimp api
	request.end(); // end the request

});

app.post('/failure', function(req, res){  
	res.redirect('/');
});



// apikey = 7db77d17541c433328ed39bd69fe8332-us10

// audienceid = 02bdb17fc3

// 'https://server.api.mailchimp.com/3.0/lists/{list_id}?skip_merge_validation=<SOME_BOOLEAN_VALUE>&skip_duplicate_check=<SOME_BOOLEAN_VALUE>' \
//   -H 'authorization: Basic <USERNAME:PASSWORD>' \
//   -d '{"members":[],"update_existing":false}'