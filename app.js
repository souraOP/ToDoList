//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();


let items = ["Buy the Food", "Cook the Food", "Eat the Food"];   //making global variable
let workItems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  let today = new Date();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };
  let day = today.toLocaleDateString("hi-IN", options);

  res.render('list', {
    listTitle: day,
    kindOfItems: items
  });    //dont put key and value as the same name
});


app.post('/', function(req, res){
  console.log(req.body);
  let item = req.body.newItem;

  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res){  //we are targetting the work route
  res.render("list", {
    listTitle: "Work List",
    kindOfItems: workItems
  });
});

app.get("/about", function(req, res){
  res.render("about");
})

app.listen(3000, function(){
  console.log("App running on port 3000");
});