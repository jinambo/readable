const cron = require('node-cron');
const User = require('./models/user');
const Book = require('./models/book');

cron.schedule('* * * * *', async () => {
    console.log('Crone jobs are running ...');
    
    try {
        // Get all users 
        const users = await User.find({}).populate('rented.book');
        
        // Iterate over all users
        for (const user of users) {
            for (let i = 0; i < user.rented.length; i++) {
                
                // Check if the book was rented more than 6 days ago
                if (user.rented[i].createdAt < new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)) {
                    const book = await Book.findById(user.rented[i].book).populate('author');
                    
                    // Add returned book to history
                    user.history.push({
                        name: book.name,
                        author: book.author.name,
                        rentedAt: user.rented[i].createdAt
                    });

                    // Delete the book from user.rented array
                    user.rented.splice(i, 1);
                    await user.save();

                    // Increment returned book
                    book.licenceCount++;
                    await book.save();

                    console.log('book name: ' + book.name);
                    console.log('books licences: ' + book.licenceCount);
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}).start();