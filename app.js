//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

//connecting to mongodb database
mongoose.connect("mongodb://localhost:27017/babluDB");

//Creating the mongoose Schema
const itemsSchema = new mongoose.Schema({
  name: String
});

//creating the model for the schema
const Item = mongoose.model("Items", itemsSchema);

//creating 3 new items using our Mongoose model
const item1 = new Item({
  name: "Welcome to your BabluBodmas ToDoList!"
});

const item2 = new Item({
  name: "Hit the + button to get a new task."
});

const item3 = new Item({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

//making the schema for list

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

//making the model for list

const List = mongoose.model("List", listSchema);




//inserting the above array into our Items collection using the .insertMany() method
// Item.insertMany(defaultItems).then(function(){
//   console.log("Successfully saved all files into babluDB");
// })
// .catch(function(err){
//   console.log(err);
// });

//Enabling the date and inserting datas
app.get("/", function(req, res) {
  const day = date.getDate();
  Item.find({}).then(function(foundItems){

    if(foundItems.length === 0){
      Item.insertMany(defaultItems).then(function(){
        console.log("Successfully saved all files into babluDB");
      })
      .catch(function(err){
        console.log(err);
      });

      res.redirect("/"); //this will go to the root route and again check if foundItems.length == 0 or not, failing will lead this to the else case and rendering it on the browser
    } else {
      res.render("list", {listTitle: "Today", kindOfItems: foundItems});
    }

  })
  .catch(function(err){
    console.log(err);
  })
  
});


app.post('/', function(req, res){
  const day = date.getDate();
  const listName = req.body.list;
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today"){
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}).then(function(foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

  item.save(); //it will save the added item into our babluDB
  res.redirect("/"); //this will show the added item in our browser
});

app.get("/:customListName", function(req, res){
  const customListName = req.params.customListName;
  
  List.findOne({name: customListName}).then(function(foundList){
    if(!foundList){
      //create a new list
      const list = new List({
        name: customListName,
        items: defaultItems
      })
    
      list.save();
      res.redirect("/" + customListName);
    } else{
      // show an existing list
      res.render("list", {listTitle: foundList.name, kindOfItems: foundList.items});
    }
  });

  

});

app.post("/delete", function(req, res){
  const checkedItemId = (req.body.checkbox);
  Item.findByIdAndRemove(checkedItemId).then(function(checkedItemId){
    console.log("Succesfully deleted the checked item!");
    res.redirect("/");
  })
  .catch(function(err){
    console.log(err);
  });

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