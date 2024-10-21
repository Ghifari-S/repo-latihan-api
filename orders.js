const http = require('http');
const url = require('url');
const { parse } = require('querystring');

let orders = [];
let orderId = 1;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    // CREATE (POST): /api/orders
    if (method === 'POST' && path === '/api/orders') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const order = JSON.parse(body);
                order.order_id = orderId++;
                orders.push(order);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Pesanan berhasil ditambahkan",
                    order_id: order.order_id
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // READ (GET): /api/orders
    } else if (method === 'GET' && path === '/api/orders') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(orders));

    // READ by ID (GET): /api/orders/{order_id}
    } else if (method === 'GET' && path.startsWith('/api/orders/')) {
        const id = parseInt(path.split('/')[3]);
        const order = orders.find(o => o.order_id === id);

        if (order) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(order));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Pesanan tidak ditemukan' }));
        }

    // UPDATE (PUT): /api/orders/{order_id}
    } else if (method === 'PUT' && path.startsWith('/api/orders/')) {
        const id = parseInt(path.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updatedOrder = JSON.parse(body);
                const index = orders.findIndex(o => o.order_id === id);

                if (index !== -1) {
                    orders[index] = { ...orders[index], ...updatedOrder };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Pesanan berhasil diperbarui' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Pesanan tidak ditemukan' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // DELETE (DELETE): /api/orders/{order_id}
    } else if (method === 'DELETE' && path.startsWith('/api/orders/')) {
        const id = parseInt(path.split('/')[3]);
        const index = orders.findIndex(o => o.order_id === id);

        if (index !== -1) {
            orders.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Pesanan berhasil dihapus' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Pesanan tidak ditemukan' }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Path tidak ditemukan' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
