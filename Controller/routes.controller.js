const router = require("express").Router();
const db = require("../api/blog.json");
const fs = require("fs");
const fsPath = "api/blog.json";


// Route that will display all in POSTMAN
router.get("/", (req, res) => {
    try {
      res.status(200).json({
        results: db,
      });
    } catch (err) {
      res.status(500).json({
        error: err.message,
      });
    }
  }); 

// GET One By ID - Read
router.get("/:id", (req, res) => {
  try {
    const id = req.params.id;

    let blogPost = db.filter((obj) => obj.id == id);
//This status shows us the ID of the post, and should display the post as well. The status should be superfluous however because you're already pulling a specific post.
    res.status(200).json({
      status: `Found post at id: ${id}`,
      blogPost,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


// POST One - Create, http://localhost:4000/routes/create
router.post("/create", (req, res) => {
  try {
    // Object Destructuring to help individually grab the keys & values (properties) of our character object coming from req.body
    let { title, author, body, } = req.body;

    // Use math to create an id for the new character
    let newId = db.length + 1;

    // Declare and assign newChar object
    const newPost = {
      post_id: newId,
      title,
      author,
      body,
    };
    fs.readFile(fsPath, (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);

      // Create a way to make sure nothing has the same ID
      //  console.log(
      //    "ID values: ",
      //    database.filter((d) => {
      //      if (d) {
      //        return d.id;
      //      }
      //    })
      //  );

      let currentIDs = [];

      database.forEach((obj) => {
        currentIDs.push(obj.id);
      });

      if (currentIDs.includes(newId)) {
        let maxValue = Math.max(...currentIDs);
        newId = maxValue + 1;
        newPost.id = newId;
      }

      database.push(newPost);

      fs.writeFile(fsPath, JSON.stringify(database), (err) => console.log(err));

      res.status(200).json({
        status: `Created new post ${newPost.post_id}!`,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// DELETE One by ID - Delete, http://localhost:4001/characters/2
router.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    fs.readFile(fsPath, (err, data) => {
      if (err) throw err;

      const db = JSON.parse(data);

      const filteredDb = db.filter((i) => i.id !== id);

      fs.writeFile(fsPath, JSON.stringify(filteredDb), (err) =>
        console.log(err)
      );
// the res status shows whether there was an error or everything worked as intended.
      res.status(200).json({
        status: `ID: post at ${id} was successfully deleted.`,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// edit post by ID - Update, http://localhost:4001/characters/2
router.put("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    const updatedInfo = req.body;

    fs.readFile(fsPath, (err, data) => {
      if (err) throw err;

      const database = JSON.parse(data);

      let editedPost;

      database.forEach((obj, i) => {
        if (obj.id === id) {
          let buildObj = {};

          for (key in obj) {
            if (updatedInfo[key]) {
              console.log("Checked");
              buildObj[key] = updatedInfo[key];
            } else {
              buildObj[key] = obj[key];
            }
          }

          database[i] = buildObj;
          editedPost = buildObj;
        }
      });

      // Error message for if that id isn't in the DB
      if (Object.keys(character).length <= 0)
        res.status(404).json({ message: "No character in roster" });

      fs.writeFile(fsPath, JSON.stringify(database), (err) => console.log(err));
// by string interpolating the status, we can get the ID of the specific data that has been changed.
      res.status(200).json({
        status: `Modified character at ID: ${id}.`,
        character: character,
      });
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});




  module.exports = router;