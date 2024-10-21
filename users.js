const http = require('http');
const url = require('url');
const { parse } = require('querystring');

let users = [];
let userId = 1;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    // CREATE (POST): /api/users
    if (method === 'POST' && path === '/api/users') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const user = JSON.parse(body);
                user.user_id = userId++;
                users.push(user);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Pengguna berhasil ditambahkan",
                    user_id: user.user_id
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // READ (GET): /api/users
    } else if (method === 'GET' && path === '/api/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));

    // READ by ID (GET): /api/users/{user_id}
    } else if (method === 'GET' && path.startsWith('/api/users/')) {
        const id = parseInt(path.split('/')[3]);
        const user = users.find(u => u.user_id === id);

        if (user) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(user));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Pengguna tidak ditemukan' }));
        }

    // UPDATE (PUT): /api/users/{user_id}
    } else if (method === 'PUT' && path.startsWith('/api/users/')) {
        const id = parseInt(path.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updatedUser = JSON.parse(body);
                const index = users.findIndex(u => u.user_id === id);

                if (index !== -1) {
                    users[index] = { ...users[index], ...updatedUser };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Pengguna berhasil diperbarui' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Pengguna tidak ditemukan' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // DELETE (DELETE): /api/users/{user_id}
    } else if (method === 'DELETE' && path.startsWith('/api/users/')) {
        const id = parseInt(path.split('/')[3]);
        const index = users.findIndex(u => u.user_id === id);

        if (index !== -1) {
            users.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Pengguna berhasil dihapus' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Pengguna tidak ditemukan' }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Path tidak ditemukan' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
