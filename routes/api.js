const router = require('express').Router();
const res = require('express/lib/response');
const bookModel = require('../model/book_model');

router.get('/books', async function (req, res) {
    const bookList = await bookModel.find();
    console.log(bookList);
    res.send(bookList);
});

router.get('/books/:id', async function (req, res){
    const { id } = req.params;
    const book = await bookModel.findOne({isbn : id});
    if(!book) return res.send("Book Not Found");
    res.send(book);
});

router.post('/books', async function(req, res) {
    const title = req.body.title;
    const isbn = req.body.isbn;
    const author = req.body.author;

    const bookExist = await bookModel.findOne({isbn : isbn});

    if(bookExist) return res.send("Book Already Exists");

    var data = await bookModel.create({title, isbn, author});
    data.save();

    res.send("Book Uploaded");
});

router.put('/books/:id',async function(req, res) {
    const {id} = req.params;
    const {
        title, 
        author,
    } = req.body;

    const bookExists = bookModel.findOne({isbn : id});
    if(!bookExists) return res.send("Book Do Not Exists");

    const updateField = (val, prev) => !val ? prev : val;

    const updateBook = {
        ...bookExists,
        title : updateField(title, bookExists.title),
        author : updateField(author, bookExists.author)
    };

    await bookModel.updateOne({isbn : id}, {$set : {title : updateBook.title}}, {$set : {author : updateBook.author}});

    return res.status(200).send("Book Updated");
});

router.delete('/books/:id', async function(req, res) {
    const {id} = req.params;

    const bookExits = bookModel.findOne({isbn : id});

    if(!bookExits) return res.send("Book Do Not Exists");
    console.log(bookExits);

    await bookModel.deleteOne({isbn : id}).then(function(){
        console.log("Data deleted");
        return res.send("Book Record Deleted Succesfully");
    }).catch(function(err){
        console.log(err);
    });
});

module.exports = router;