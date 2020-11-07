const express = require('express');
const app = express();
const request = require('request');
const url = 'https://dare-nodejs-assessment.herokuapp.com';
const bodyParser = require('body-parser');
var token, type;

app.use(bodyParser.urlencoded({ extended: true }));

//pre: you get a statusCode, depending what error the api responded.
//post: you get the response to get shown.
function getHandleError(statusCode){
    switch (statusCode) {
        case 401:
          return {"code": 401,"message": "Unauthorized error"};
          break;
        case 403:
          return {"code": 403,"message": "Forbidden error"};
          break;
        case 404:
          return {"code": 404,"message": "Not Found error"};
          break;
      }
}

//pre: it gets the username and password from req.body.
//post: it return the authoritzation token.
app.post('/login', (req, res) => {
    username = req.body.username;
    password = req.body.password;
    request.post({
        url:     url + '/api/login',
        headers: {
            'Content-Type': 'application/json'
        },
        json:    { 
            client_id: username,
            client_secret: password }
      }, function(error, response, body){
          if (body.statusCode){
                res.send(getHandleError(body.statusCode));
          } else {
                token = body.token;
                type = body.type;
                res.send({type:body.type, token:body.token});
          }
      });
});

//pre: it gets the querylimit and the authoritzation token.
//post: it return the list of policies.
app.get('/policies', (req, res) => {
    var data = [];
    limit = req.query.limit;
    request.get({
        url:     url + '/api/policies',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : type + ' ' + token,
        },
      }, function(error, response, body){
        body = JSON.parse(body);
        if (body.statusCode){
            res.send(getHandleError(body.statusCode));
        } else {
            for(var i=0; i<limit; ++i){
                data.push(body[i]);
                console.log(data);
            }
        }
        res.send(data);
      });
});

//pre: it gets the id of the policies and the authoritzation token.
//post: it return the list of policies with that id.
app.get('/policies/:id', (req, res) => {
    var data = [];
    id = req.params.id;
    request.get({
        url:     url + '/api/policies',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : type + ' ' + token,
        },
      }, function(error, response, body){
        body = JSON.parse(body);
        if (body.statusCode){
            res.send(getHandleError(body.statusCode));
        } else {
            for(var i=0; i<body.length; ++i){
                if(body[i].id == id){
                    data.push(body[i]);
                }
            }
        }
        res.send(data);
      });
});


//pre: it gets the limit  from req.query of the clients and the authoritzation token.
//post: it return the list of clients.
app.get('/clients', (req, res) => {
    var data = [];
    var police = [];
    limit = req.query.limit;
    request.get({
        url:     url + '/api/clients',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : type + ' ' + token,
        },
      }, function(error, response, body){
        body = JSON.parse(body);
        if (body.statusCode){
            res.send(getHandleError(body.statusCode));
        } else {
            for(var i=0; i<limit; ++i){
                data.push(body[i]);
            }
        }
        res.send(data);
      });
});

//pre: it gets the id from req.params of the clients and the authoritzation token.
//post: it return the list of clients with that id.
app.get('/clients/:id', (req, res) => {
    var data = [];
    id = req.params.id;
    request.get({
        url:     url + '/api/clients',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : type + ' ' + token,
        },
      }, function(error, response, body){
        body = JSON.parse(body);
        if (body.statusCode){
            res.send(getHandleError(body.statusCode));
        } else {
            for(var i=0; i<body.length; ++i){
                if(body[i].id == id){
                    data.push(body[i]);
                }
            }
        }
        res.send(data);
      });
});


//pre: it gets the id from req.params of the clients and the authoritzation token.
//post: it return the list of clients that are policies with that id.
app.get('/clients/:id/policies', (req, res) => {
    var data = [];
    id = req.params.id;
    request.get({
        url:     url + '/api/policies',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : type + ' ' + token,
        },
      }, function(error, response, body){
        body = JSON.parse(body);
        if (body.statusCode){
            res.send(getHandleError(body.statusCode));
        } else {
            for(var i=0; i<body.length; ++i){
                if(body[i].clientId == id){
                    data.push(body[i]);
                }
            }
        }
        res.send(data);
      });
});


app.listen(3000);