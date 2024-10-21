const http = require('http');
const url = require('url');
const { parse } = require('querystring');

let books = [];
let bookId = 1;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    // CREATE (POST): /api/books
    if (method === 'POST' && path === '/api/books') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const book = JSON.parse(body);
                book.book_id = bookId++;
                books.push(book);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Buku berhasil ditambahkan",
                    book_id: book.book_id
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // READ (GET): /api/books
    } else if (method === 'GET' && path === '/api/books') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(books));

    // READ by ID (GET): /api/books/{book_id}
    } else if (method === 'GET' && path.startsWith('/api/books/')) {
        const id = parseInt(path.split('/')[3]);
        const book = books.find(b => b.book_id === id);

        if (book) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(book));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Buku tidak ditemukan' }));
        }

    // UPDATE (PUT): /api/books/{book_id}
    } else if (method === 'PUT' && path.startsWith('/api/books/')) {
        const id = parseInt(path.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updatedBook = JSON.parse(body);
                const index = books.findIndex(b => b.book_id === id);

                if (index !== -1) {
                    books[index] = { ...books[index], ...updatedBook };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Buku berhasil diperbarui' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Buku tidak ditemukan' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // DELETE (DELETE): /api/books/{book_id}
    } else if (method === 'DELETE' && path.startsWith('/api/books/')) {
        const id = parseInt(path.split('/')[3]);
        const index = books.findIndex(b => b.book_id === id);

        if (index !== -1) {
            books.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Buku berhasil dihapus' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Buku tidak ditemukan' }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Path tidak ditemukan' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
