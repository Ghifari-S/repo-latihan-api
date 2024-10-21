const http = require("http");
const url = require("url");
const { parse } = require("querystring");

let products = [];
let productId = 1;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CREATE (POST): /api/products
  if (method === "POST" && path === "/api/products") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        console.log("Body Received:", body); // Tambahkan log ini untuk melihat isi body
        const product = JSON.parse(body); // Ini akan melempar error jika JSON tidak valid
        product.product_id = productId++;
        products.push(product);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Produk berhasil ditambahkan",
            product_id: product.product_id,
          })
        );
      } catch (error) {
        console.error("Error parsing JSON:", error); // Tampilkan pesan error parsing JSON
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Bad Request: Invalid JSON" }));
      }
    });
  } // READ (GET): /api/products
  else if (method === "GET" && path === "/api/products") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(products));

    // READ by ID (GET): /api/products/{product_id}
  } else if (method === "GET" && path.startsWith("/api/products/")) {
    const id = parseInt(path.split("/")[3]);
    const product = products.find((p) => p.product_id === id);

    if (product) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(product));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Produk tidak ditemukan" }));
    }

    // UPDATE (PUT): /api/products/{product_id}
  } else if (method === "PUT" && path.startsWith("/api/products/")) {
    const id = parseInt(path.split("/")[3]);
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const updatedProduct = JSON.parse(body);
      const index = products.findIndex((p) => p.product_id === id);

      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Produk berhasil diperbarui" }));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Produk tidak ditemukan" }));
      }
    });

    // DELETE (DELETE): /api/products/{product_id}
  } else if (method === "DELETE" && path.startsWith("/api/products/")) {
    const id = parseInt(path.split("/")[3]);
    const index = products.findIndex((p) => p.product_id === id);

    if (index !== -1) {
      products.splice(index, 1);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Produk berhasil dihapus" }));
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Produk tidak ditemukan" }));
    }
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Path tidak ditemukan" }));
  }
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
