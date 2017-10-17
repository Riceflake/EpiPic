var minify = require('express-minify');
const express = require('express');
var my_json = require('./1500-random-images.json');
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }))
app.use(minify());

var fs = require('fs');
var validUrl = require('valid-url');

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/pictures', (req, res) => {
    var cursor = parseInt(req.query.cursor);
    var amount = parseInt(req.query.amount);
    
    if (Number.isInteger(cursor) && Number.isInteger(amount))
    {
        var last_index = my_json[my_json.length - 1].index;
        if (cursor > last_index)
            res.status(404).send("Sorry maximum index is : " + last_index);
        else
        {
            var filtered_json = my_json.filter(function(obj) { return obj.index >= cursor && obj.index <= cursor + amount });
            res.send(filtered_json);
        }
    }
    else if (Number.isInteger(amount))
        var filtered_json = my_json.filter(function(obj) { return obj.index < amount});
    else
        res.status(404).send("Sorry can't find that!");
});

app.post('/api/pictures', (req, res) => {
    const json_data = req.body;
    if (!("picture" in json_data))
        res.status(500).send("Please specify a \"picture\" in your json ");
    else 
    {
        if (!validUrl.isUri(json_data.picture))
            res.status(500).send("picture URL not valid in your json");
        else
        {
            var last_index = my_json[my_json.length - 1].index;
            json_data["index"] = last_index + 1;
            my_json.push(json_data);
            res.send(JSON.stringify(my_json));
            //fs.writeFileSync("./1500-random-images.json", JSON.stringify(my_json));
        }
            
    }
});


app.get('/api/pictures/:id', (req, res) => {
    var id = req.params.id;
    my_json = my_json.filter(function(obj) { return obj.index != id });
    res.send(my_json);
});


app.listen(4242, () => {
  console.log('Example app listening on port 4242!');
});
 
                   
                 
     
   