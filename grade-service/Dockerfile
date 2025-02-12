# Gunakan image Node.js resmi
FROM node:18

# Tentukan working directory dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json untuk menginstal dependensi lebih dulu
COPY package.json package-lock.json ./

# Install dependensi
RUN npm install

# Salin seluruh kode sumber ke dalam container
COPY . .

# Tentukan port yang akan digunakan
EXPOSE 5002

# Jalankan aplikasi
CMD ["npm", "start"]
