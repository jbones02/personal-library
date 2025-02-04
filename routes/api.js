/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const { Book } = require('../models');

const BookModel = require('../models').Book;
const mongoose = require('mongoose');

module.exports = function (app) {

  const findBookById = async (bookId) => {
    return await BookModel.findOne({ _id: bookId });
  }

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      try {
        const books = await BookModel.find({});

        const formattedBooks = books.map(book => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }));

        return res.status(200).json(formattedBooks);
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server error' });
      }
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        return res.send('missing required field title');
      }

      try {
        const book = new BookModel({
          title: title,
          comments: []
        });
        await book.save();
        return res.status(200).json({ _id: book._id, title: book.title });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'server error' });
      }  
    })
    
    // Complete delete
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      try {
        const result = await BookModel.deleteMany({});
      
        if (!result) {
          return res.status(400).json({ error: 'failed to complete delete' });
        }

        return res.status(200).send('complete delete successful');

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookId = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(200).send('no book exists');
      }

      try {
        const book = await findBookById(bookId);
        
        if (!book) {
          return res.status(200).send('no book exists');
        }

        return res.status(200).json(book);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
      }
    })
    
    .post(async (req, res) => {
      let bookId = req.params.id;
      let comment = req.body.comment;

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(200).send('no book exists');
      }
      //json res format same as .get
      try {
        if (!comment) {
          return res.status(200).send('missing required field comment');
        }

        const book = await BookModel.findByIdAndUpdate(
          bookId,
          { $push: { comments: comment} },
          { new: true }
        );

        if (!book) {
          return res.status(200).send('no book exists');
        }

        return res.status(200).json(book);

      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error' });
      }
    })
    
    .delete(async (req, res) => {
      let bookId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(200).send('no book exists');
      }
      //if successful response will be 'delete successful'
      try {
        const book = await Book.findByIdAndDelete(bookId);
        if (!book) {
          return res.status(200).send('no book exists');
        }
        return res.status(200).send('delete successful');
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'server error'});
      }
    });
};
