# Editin_ - Aplikasi Pengolahan Citra Digital
Editin_ adalah aplikasi pengolahan citra digital berbasis web yang memungkinkan pengguna untuk mengunggah gambar dan menerapkan berbagai teknik pengolahan citra seperti konversi grayscale, pengaturan brightness dan contrast, filter median, smoothing, dan deteksi tepi.

## Fitur Aplikasi
- Upload Gambar: Pengguna dapat mengunggah gambar dari perangkat mereka
- Konversi Grayscale: Mengubah gambar berwarna menjadi gambar abu-abu
- Pengaturan Brightness & Contrast: Mengatur tingkat kecerahan dan kontras gambar
- Filter Median: Mengurangi noise pada gambar dengan metode filter median
- Smoothing: Menghaluskan gambar dengan filter rerata (mean filter)
- Deteksi Tepi: Mendeteksi tepi pada gambar menggunakan operator Sobel
- Unduh Hasil: Pengguna dapat mengunduh gambar hasil pengolahan

## Alur Kerja Aplikasi
1. Upload Gambar:
   - Pengguna memilih file gambar melalui input file
   - Gambar ditampilkan pada canvas "Gambar Asli"
   - Tombol "Proses Gambar" diaktifkan

2. Pemilihan Operasi:
   - Pengguna memilih operasi pengolahan citra yang diinginkan (checkbox dan slider)
   - Setiap perubahan pada pengaturan akan langsung memproses gambar

3. Pemrosesan Gambar:
   - Gambar diproses sesuai dengan operasi yang dipilih
   - Hasil ditampilkan pada canvas "Hasil Pengolahan"
   - Informasi tentang operasi yang dipilih ditampilkan di bagian bawah

4. Unduh Hasil:
   - Pengguna dapat mengunduh gambar hasil pengolahan dengan mengklik tombol "Unduh Hasil"

## Struktur Website
1. HTML (index.html)
- Menggunakan Tailwind CSS untuk styling
- Struktur responsif dengan grid layout
- Terdiri dari header, main content, dan modal informasi
- Menggunakan Lucide Icons untuk ikon

2. JavaScript (app.js)
- Menangani interaksi pengguna
- Mengatur event listener untuk kontrol pengolahan citra
- Mengelola upload gambar dan preview
- Mengatur tampilan informasi pengolahan

3. Pengolahan Citra (imageProcessing.js)
- Implementasi algoritma pengolahan citra
- Fungsi untuk konversi grayscale
- Fungsi untuk pengaturan brightness dan contrast
- Fungsi untuk filter median dan rerata
- Fungsi untuk deteksi tepi dengan operator Sobel

## Penjelasan Algoritma Pengolahan Citra
### 1. Konversi Grayscale
Algoritma ini mengubah gambar berwarna menjadi gambar abu-abu dengan menghitung rata-rata nilai RGB setiap piksel.

\`\`\`javascript
function convertToGrayscale(imageData) {
    const data = imageData.data;
  
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
  
      // Calculate grayscale value (average method)
      const gray = Math.round((r + g + b) / 3);
  
      // Set RGB values to the grayscale value
      data[i] = gray;     // R
      data[i + 1] = gray; // G
      data[i + 2] = gray; // B
    }
  
    return imageData;
}
\`\`\`

Algoritma ini bekerja dengan:
1. Mengakses setiap piksel dalam gambar (setiap piksel terdiri dari 4 nilai: R, G, B, A)
2. Menghitung nilai rata-rata dari komponen R, G, dan B
3. Menetapkan nilai R, G, dan B ke nilai rata-rata tersebut (nilai A/alpha tetap)

### 2. Brightness dan Contrast
Algoritma ini mengatur tingkat kecerahan dan kontras gambar dengan memanipulasi nilai piksel.

\`\`\`javascript
function adjustBrightnessContrast(imageData, brightness, contrast) {
    const data = imageData.data;
  
    // Convert contrast to a multiplier
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness
      let r = data[i] + brightness;
      let g = data[i + 1] + brightness;
      let b = data[i + 2] + brightness;
  
      // Apply contrast
      r = contrastFactor * (r - 128) + 128;
      g = contrastFactor * (g - 128) + 128;
      b = contrastFactor * (b - 128) + 128;
  
      // Clamp values to 0-255 range
      data[i] = Math.max(0, Math.min(255, Math.round(r)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(g)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(b)));
    }
  
    return imageData;
}
\`\`\`

Algoritma ini bekerja dengan:
1. Mengkonversi nilai kontras (-100 hingga 100) menjadi faktor pengali
2. Untuk setiap piksel:
   - Menambahkan nilai brightness ke setiap komponen RGB
   - Menerapkan formula kontras: `factor * (value - 128) + 128`
   - Memastikan nilai tetap dalam rentang valid (0-255)

### 3. Filter Median
Filter median mengurangi noise pada gambar dengan mengganti nilai setiap piksel dengan nilai median dari piksel-piksel tetangganya.

\`\`\`javascript
function applyMedianFilter(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const resultData = new Uint8ClampedArray(data);
    const kernelSize = 3;
    const kernelRadius = Math.floor(kernelSize / 2);
  
    for (let y = kernelRadius; y < height - kernelRadius; y++) {
      for (let x = kernelRadius; x < width - kernelRadius; x++) {
        for (let c = 0; c < 3; c++) {
          const values = [];
  
          // Collect values from the kernel neighborhood
          for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
            for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              values.push(data[idx]);
            }
          }
  
          // Sort values and get the median
          values.sort((a, b) => a - b);
          const medianValue = values[Math.floor(values.length / 2)];
          
          const idx = (y * width + x) * 4 + c;
          resultData[idx] = medianValue;
        }
      }
    }
  
    return new ImageData(resultData, width, height);
}
\`\`\`

Algoritma ini bekerja dengan:
1. Untuk setiap piksel (kecuali piksel tepi):
   - Mengumpulkan nilai dari 9 piksel tetangga (kernel 3x3)
   - Mengurutkan nilai-nilai tersebut
   - Mengambil nilai tengah (median)
   - Mengganti nilai piksel dengan nilai median

### 4. Smoothing (Filter Rerata)
Filter rerata menghaluskan gambar dengan mengganti nilai setiap piksel dengan rata-rata nilai piksel-piksel tetangganya.

\`\`\`javascript
function applyMeanFilter(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const resultData = new Uint8ClampedArray(data);
    const kernelSize = 3;
    const kernelRadius = Math.floor(kernelSize / 2);
  
    for (let y = kernelRadius; y < height - kernelRadius; y++) {
      for (let x = kernelRadius; x < width - kernelRadius; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
  
          // Sum values from the kernel neighborhood
          for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
            for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += data[idx];
            }
          }
  
          // Calculate the mean value
          const meanValue = Math.round(sum / (kernelSize * kernelSize));
          
          const idx = (y * width + x) * 4 + c;
          resultData[idx] = meanValue;
        }
      }
    }
  
    return new ImageData(resultData, width, height);
}
\`\`\`

Algoritma ini bekerja dengan:
1. Untuk setiap piksel (kecuali piksel tepi):
   - Menjumlahkan nilai dari 9 piksel tetangga (kernel 3x3)
   - Menghitung nilai rata-rata (jumlah dibagi 9)
   - Mengganti nilai piksel dengan nilai rata-rata

### 5. Deteksi Tepi (Sobel)
Operator Sobel mendeteksi tepi dalam gambar dengan menghitung gradien intensitas gambar.

\`\`\`javascript
function applyEdgeDetection(imageData) {
    // Convert to grayscale if needed
    let processedData = imageData;
    // ... (check if grayscale) ...
  
    const width = processedData.width;
    const height = processedData.height;
    const inputData = processedData.data;
    const outputData = new Uint8ClampedArray(inputData.length);
  
    // Sobel kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0;
        let pixelY = 0;
  
        // Apply convolution
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const kernelIdx = (ky + 1) * 3 + (kx + 1);
  
            pixelX += inputData[idx] * sobelX[kernelIdx];
            pixelY += inputData[idx] * sobelY[kernelIdx];
          }
        }
  
        // Calculate gradient magnitude
        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
        const idx = (y * width + x) * 4;
        const edgeValue = Math.min(255, Math.max(0, Math.round(magnitude)));
  
        // Set RGB values to the edge value
        outputData[idx] = edgeValue;
        outputData[idx + 1] = edgeValue;
        outputData[idx + 2] = edgeValue;
        outputData[idx + 3] = inputData[idx + 3]; // Keep original alpha
      }
    }
  
    return new ImageData(outputData, width, height);
}
\`\`\`

Algoritma ini bekerja dengan:
1. Mengkonversi gambar ke grayscale jika belum (deteksi tepi bekerja lebih baik pada gambar grayscale)
2. Menggunakan dua kernel Sobel:
   - Kernel X untuk mendeteksi tepi vertikal
   - Kernel Y untuk mendeteksi tepi horizontal
3. Untuk setiap piksel:
   - Menerapkan konvolusi dengan kedua kernel
   - Menghitung besaran gradien menggunakan teorema Pythagoras
   - Menetapkan nilai piksel hasil sesuai dengan besaran gradien

## Alur Kerja Kode
### 1. Inisialisasi Aplikasi
- Mendapatkan referensi ke semua elemen DOM yang diperlukan
- Menambahkan event listener untuk interaksi pengguna
### 2. Upload Gambar
- Pengguna memilih file gambar
- File dibaca menggunakan FileReader
- Gambar ditampilkan pada canvas asli
- Tombol proses diaktifkan
### 3. Pemrosesan Gambar
- Pengguna memilih operasi pengolahan
- Gambar asli diambil dari canvas
- Operasi pengolahan diterapkan secara berurutan:
  1. Grayscale (jika dipilih)
  2. Brightness/Contrast (jika nilai tidak 0)
  3. Filter Median (jika dipilih)
  4. Smoothing (jika dipilih)
  5. Deteksi Tepi (jika dipilih)
- Hasil ditampilkan pada canvas hasil
- Tombol unduh diaktifkan
### 4. Unduh Hasil
- Pengguna mengklik tombol unduh
- Canvas hasil dikonversi ke data URL
- File gambar diunduh ke perangkat pengguna


## Pengembang
Muhammad Falleryan - 065122185 - Ilmu Komputer Universitas Pakuan
