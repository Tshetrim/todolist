//requiring packages
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const _=require("lodash");

const date = require(__dirname + "/date.js");
//setting up express
const app = express();

app.use(express.urlencoded({extended: true}));
//app.use(express.json({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

//creating to MongoDB database
mongoose.connect(process.env.MONGO_SRV_URL+"/todolistDB?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
},(err)=> err ? console.log(err) : console.log("Connected to mongod server"));

const itemsSchema = new mongoose.Schema({
  name: {
    type: {String},
    required: true,
    //unique: true
  }
});

const listSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  items: [itemsSchema]
});

const List = mongoose.model("list",listSchema);
const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "This is your new list"
});
const item2 = new Item({
  name: "⬅ Check me to delete"
});
const item3 = new Item({
  name: "⬇ Write down a new item"
});
const item4 = new Item({
  name: "Make a custom list by adding '/' and whatever 'list name' in the search bar"
});

const defaultItems = [item1, item2, item3, item4];

//Item.insertMany(defaultItems,(err)=> err ? console.log(err) : console.log("Sucessfully default items Into collection"));

//global variables
// const items = ["Buy food", "Cook food", "Eat Food"];
// const workItems=["Do Homework","Catch up on Reading","Send File"];

//Server
app.get("/", (req, res) => {
  const day = date.getDate();

  Item.find({}, (err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err)
          console.log(err.code);
        else
          console.log("Sucessfully loaded default items into collection");
      });
      res.redirect("/");
    } else {
      if (err)
        console.log(err);
      else {
        res.render("list", {
          listHeading: day,
          newListItems: items,
          route: "/",
        });
      }
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  if(customListName==="deleteItem"){
    res.send("<h1>Please go back, can not render a delete page</h1>");
  }
  else{
    List.findOne({name:customListName},(err,foundList)=>{
      if(err)
        console.log(err);
      else{
        if(!foundList){
          const list = new List({
            name: customListName,
            items: defaultItems.slice(0,3),
          });
          list.save((err)=>{
            res.redirect("/"+customListName);
          });

        }
        else{
          //console.log(foundList);
          res.render("list",{
            listHeading: customListName,
            newListItems: foundList.items,
            route: customListName,
          });
        }
      }
    });
  }
});

app.post("/", (req, res) => {
  const newItemName = req.body.newItem;
  const itemAddition = new Item({
    name: newItemName
  });
  itemAddition.save();
  res.redirect("/");
});

app.post("/deleteItem", (req, res) => {
  let item = JSON.parse(req.body.checkDelete);
  console.log(item);
  if(req.body.route==="/"){
    Item.deleteOne({name:item.name}, (err)=>{
      if(err)
        console.log(err);
      else{
        console.log("Item sucessfully Deleted");
      }
      res.redirect("/");
    });
  }else{
    List.findOneAndUpdate({name:req.body.route},{$pull:{items:{name:item.name}}},(err)=>{
      if(err)
        console.log(err);
      else{
        console.log("sucessfully deleted");
      }
      res.redirect(req.body.route);
    });
  }
});

app.post("/:customListName", (req, res) => {
  const customListName = req.params.customListName;
  const newItemName = req.body.newItem;
  const itemAddition = new Item({
    name: newItemName
  });

  List.updateOne({name:customListName},{$push: {items:itemAddition}},(err)=>{
    if(err)
      console.log(err);
    else{
      console.log("tried to post to custom list name");
    }
  });
  res.redirect("/"+req.params.customListName);
});



app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000");
});
