import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();


const db = new pg.Client({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port
})

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

async function getData(){
  const result = await db.query("SELECT * FROM items ORDER BY id ASC;");
  return result.rows
}


app.get("/", async(req, res) => {

  const items = await  getData()
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });

  try{
    await db.query("INSERT INTO items (title) VALUES ($1)",[item]);
  }catch (error){
    console.log(error);
  }

  res.redirect("/");
});

app.post("/edit", async(req, res) => {

  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;

  try{
    await db.query("UPDATE items SET title = $1 WHERE id = $2;", [title,id]);
    res.redirect("/");
  }catch (error){
    console.log(error);
  }
});

app.post("/delete", async(req, res) => {

  const deleteItemId = req.body.deleteItemId;

  try{
    await db.query("DELETE FROM items where id = $1",[deleteItemId]);
    res.redirect("/");
  }catch (error){
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


