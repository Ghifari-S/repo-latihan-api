const http = require("http"); // Modul bawaan Node.js untuk membuat server HTTP.
const url = require("url"); // Modul untuk mem-parsing URL, berguna untuk memisahkan path dan query parameters.
const { parse } = require("querystring"); //  Modul yang digunakan untuk mem-parsing query string (meski dalam kode ini belum dipakai secara eksplisit)

// Array untuk menyimpan produk dan variabel productId untuk memberikan ID unik ke setiap produk
let products = [];
let productId = 1;

// Membuat server HTTP
const server = http.createServer((req, res) => {
  // Parsing URL request untuk mendapatkan path dan query parameters
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CREATE (POST): Menambah produk baru di /api/products
  if (method === "POST" && path === "/api/products") {
    let body = "";

    // Menerima data yang dikirimkan di body request
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        console.log("Body Received:", body); // Logging body untuk debugging
        const product = JSON.parse(body); // Parse body menjadi JSON, bisa error jika formatnya salah
        product.product_id = productId++; // Menambahkan ID unik ke produk
        products.push(product); // Menyimpan produk ke array products

        // Mengirimkan response sukses dengan status 200 dan ID produk baru
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Produk berhasil ditambahkan",
            product_id: product.product_id,
          })
        );
      } catch (error) {
        console.error("Error parsing JSON:", error); // Logging jika terjadi error saat parsing JSON
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Bad Request: Invalid JSON" }));
      }
    });

    // READ ALL (GET): Mengambil semua produk di /api/products
  } else if (method === "GET" && path === "/api/products") {
    // Mengirimkan semua produk yang tersimpan di array products
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(products));

    // READ BY ID (GET): Mengambil produk berdasarkan ID di /api/products/{product_id}
  } else if (method === "GET" && path.startsWith("/api/products/")) {
    // Mendapatkan product_id dari URL
    const id = parseInt(path.split("/")[3]);
    const product = products.find((p) => p.product_id === id); // Mencari produk berdasarkan ID

    if (product) {
      // Jika produk ditemukan, kirimkan produk dalam response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(product));
    } else {
      // Jika produk tidak ditemukan, kirimkan pesan error 404
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Produk tidak ditemukan" }));
    }

    // UPDATE (PUT): Memperbarui produk berdasarkan ID di /api/products/{product_id}
  } else if (method === "PUT" && path.startsWith("/api/products/")) {
    const id = parseInt(path.split("/")[3]);
    let body = "";

    // Menerima data body yang berisi produk yang diperbarui
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const updatedProduct = JSON.parse(body); // Parse data yang dikirim menjadi JSON
      const index = products.findIndex((p) => p.product_id === id); // Mencari produk berdasarkan ID

      if (index !== -1) {
        // Jika produk ditemukan, perbarui dengan data baru
        products[index] = { ...products[index], ...updatedProduct };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Produk berhasil diperbarui" }));
      } else {
        // Jika produk tidak ditemukan, kirimkan pesan error 404
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Produk tidak ditemukan" }));
      }
    });

    // DELETE (DELETE): Menghapus produk berdasarkan ID di /api/products/{product_id}
  } else if (method === "DELETE" && path.startsWith("/api/products/")) {
    const id = parseInt(path.split("/")[3]);
    const index = products.findIndex((p) => p.product_id === id); // Mencari produk berdasarkan ID

    if (index !== -1) {
      // Jika produk ditemukan, hapus dari array products
      products.splice(index, 1);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Produk berhasil dihapus" }));
    } else {
      // Jika produk tidak ditemukan, kirimkan pesan error 404
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Produk tidak ditemukan" }));
    }

    // Jika path tidak sesuai dengan API yang ada, kirimkan pesan error 404
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Path tidak ditemukan" }));
  }
});

// Menjalankan server di port 3000
server.listen(3000, () => {
  console.log("Server running on port 3000");
});
