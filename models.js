const mongoose = require("mongoose");
const { Schema } = mongoose;
const BookSchema = new Book({
    title: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
    }
})

const Book = mongoose.model("Book", BookSchema);

exports.Book = Book;