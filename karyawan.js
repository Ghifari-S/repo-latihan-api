const http = require('http');
const url = require('url');
const { parse } = require('querystring');

let employees = [];
let employeeId = 1;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method.toUpperCase();

    // CREATE (POST): /api/employees
    if (method === 'POST' && path === '/api/employees') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const employee = JSON.parse(body);
                employee.employee_id = employeeId++;
                employees.push(employee);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: "Karyawan berhasil ditambahkan",
                    employee_id: employee.employee_id
                }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // READ (GET): /api/employees
    } else if (method === 'GET' && path === '/api/employees') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(employees));

    // READ by ID (GET): /api/employees/{employee_id}
    } else if (method === 'GET' && path.startsWith('/api/employees/')) {
        const id = parseInt(path.split('/')[3]);
        const employee = employees.find(e => e.employee_id === id);

        if (employee) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(employee));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Karyawan tidak ditemukan' }));
        }

    // UPDATE (PUT): /api/employees/{employee_id}
    } else if (method === 'PUT' && path.startsWith('/api/employees/')) {
        const id = parseInt(path.split('/')[3]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const updatedEmployee = JSON.parse(body);
                const index = employees.findIndex(e => e.employee_id === id);

                if (index !== -1) {
                    employees[index] = { ...employees[index], ...updatedEmployee };
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Karyawan berhasil diperbarui' }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Karyawan tidak ditemukan' }));
                }
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Bad Request: Invalid JSON' }));
            }
        });

    // DELETE (DELETE): /api/employees/{employee_id}
    } else if (method === 'DELETE' && path.startsWith('/api/employees/')) {
        const id = parseInt(path.split('/')[3]);
        const index = employees.findIndex(e => e.employee_id === id);

        if (index !== -1) {
            employees.splice(index, 1);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Karyawan berhasil dihapus' }));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Karyawan tidak ditemukan' }));
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Path tidak ditemukan' }));
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
