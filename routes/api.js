/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const BookModel = require('../models').Book;

module.exports = function (app) {

  const findBookById = async (bookId) => {
    return await BookModel.findOne({ _id: bookId });
  }

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.send("missing required field title");
      }

      try {
        const book = new BookModel({
          title: title,
          comments: []
        });
        await BookModel.save();
        res.status(200).json({ _id: book._id, title: book.title });
      } catch (err) {
        console.err(err);
        res.status(500).json({ error: 'server error' });
      }
    })
    
    // Complete delete
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        const result = await BookModel.deleteMany({});
      
        if (!result) {
          return res.status(400).json({ error: "failed to complete delete" });
        }

        return res.status(200).send("complete delete successful");

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookId = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      try {
        const book = await findBookById({ _id: bookId });
        if (!book) {
          return res.status(200).send("no book exists");
        }
        return res.status(200).json(book);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
      }
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });
  
};
