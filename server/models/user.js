const mongoose = require('mongoose');
const Book = require('./book');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        verified: {
            type: Boolean,
            default: false
        },
        banned: {
            type: Boolean,
            default: false
        }
    },
    rented: {
        type: [{
            book: {
                type: mongoose.Schema.ObjectId,
                ref: 'Book'
            },
            createdAt: {
                type: Date,
                default: Date.now(),
                expires: '6d'
            }
        }],
        default: []
    },
    history: {
        type: [{
            name: {
                type: String,
                required: true
            },
            author: {
                type: String,
                required: true
            },
            rentedAt: {
                type: Date,
                required: true
            }
        }]
    }
});


// userSchema.pre('save', async function (next) {
//     const expiredRentals = this.rented.filter(r => r.createdAt <= Date.now() - 60 * 1000);

//     for (const rental of expiredRentals) {
//         const index = this.rented.indexOf(rental);
//         this.rented.splice(index, 1);

//         const book = await Book.findById(rental.book);
//         let licenceCount = Number(book.licenceCount);
//         let incremented = licenceCount + 1;
        
//         book.licenceCount = incremented;

//         await book.save();
//         //await Book.findByIdAndUpdate(rental.book, { $inc: { licenceCount: 1 } });
//     }

//     next();
// });


// const User = mongoose.model('User', userSchema);
// User.createIndexes( [{ "rented.createdAt": 1 }, { expireAfterSeconds: 30 }], (err)=>{
//     if(err) throw err;
//     console.log('TTL index created');
// });

// const bookLimit = val => {
//     return val.length <= 6;
// }

// User.watch().on('change', (data) => {
//      const { rentedBooks } = data;
//      rentedBooks.forEach(book => {
//          console.log('createdAt:' + book?.createdAt);
//      });

//     console.log('User data changed:' + data);
// });

module.exports = mongoose.model('User', userSchema);