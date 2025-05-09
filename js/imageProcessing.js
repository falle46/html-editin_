/**
 * Editin_ - Aplikasi Pengolahan Citra Web
 * Implementasi algoritma pengolahan citra
 */

/**
 * Konversi gambar ke grayscale
 * Fungsi ini mengubah gambar berwarna menjadi grayscale dengan merata-ratakan nilai RGB
 * @param {ImageData} imageData - Data gambar asli
 * @returns {ImageData} - Data gambar grayscale
 */
function convertToGrayscale(imageData) {
  const data = imageData.data

  // Loop melalui setiap piksel (4 nilai per piksel: R, G, B, A)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] // Nilai merah
    const g = data[i + 1] // Nilai hijau
    const b = data[i + 2] // Nilai biru

    // Hitung nilai grayscale menggunakan metode rata-rata
    // Metode lain termasuk rata-rata tertimbang (0.3R + 0.59G + 0.11B) untuk hasil yang lebih akurat secara perseptual
    const gray = Math.round((r + g + b) / 3)

    // Atur semua nilai RGB ke nilai grayscale yang sama
    data[i] = gray // R
    data[i + 1] = gray // G
    data[i + 2] = gray // B
    // Saluran alpha (data[i + 3]) tetap tidak berubah
  }

  return imageData
}

/**
 * Sesuaikan brightness dan contrast
 * Fungsi ini memodifikasi tingkat kecerahan dan kontras gambar
 * @param {ImageData} imageData - Data gambar asli
 * @param {number} brightness - Nilai penyesuaian brightness (-100 hingga 100)
 * @param {number} contrast - Nilai penyesuaian contrast (-100 hingga 100)
 * @returns {ImageData} - Data gambar yang disesuaikan
 */
function adjustBrightnessContrast(imageData, brightness, contrast) {
  const data = imageData.data

  // Konversi kontras menjadi faktor pengali
  // Rumus ini memetakan rentang kontras (-100 hingga 100) ke faktor yang bekerja dengan baik secara visual
  const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast))

  // Loop melalui setiap piksel
  for (let i = 0; i < data.length; i += 4) {
    // Terapkan brightness dengan menambahkan nilai brightness
    let r = data[i] + brightness
    let g = data[i + 1] + brightness
    let b = data[i + 2] + brightness

    // Terapkan contrast menggunakan rumus: factor * (nilai - 128) + 128
    // Rumus ini menyesuaikan nilai di sekitar titik tengah (128)
    r = contrastFactor * (r - 128) + 128
    g = contrastFactor * (g - 128) + 128
    b = contrastFactor * (b - 128) + 128

    // Batasi nilai ke rentang yang valid (0-255)
    data[i] = Math.max(0, Math.min(255, Math.round(r)))
    data[i + 1] = Math.max(0, Math.min(255, Math.round(g)))
    data[i + 2] = Math.max(0, Math.min(255, Math.round(b)))
    // Saluran alpha (data[i + 3]) tetap tidak berubah
  }

  return imageData
}

/**
 * Terapkan filter median untuk pengurangan noise
 * Filter ini menggantikan setiap piksel dengan nilai median dari lingkungan tetangganya
 * Efektif untuk menghilangkan noise "salt and pepper" sambil mempertahankan tepi
 * @param {ImageData} imageData - Data gambar asli
 * @returns {ImageData} - Data gambar yang difilter
 */
function applyMedianFilter(imageData) {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data

  // Buat salinan data gambar untuk menyimpan hasil
  const resultData = new Uint8ClampedArray(data)

  // Tentukan ukuran kernel (lingkungan 3x3)
  const kernelSize = 3
  const kernelRadius = Math.floor(kernelSize / 2) // Radius = 1 untuk kernel 3x3

  // Proses gambar (lewati piksel tepi)
  for (let y = kernelRadius; y < height - kernelRadius; y++) {
    for (let x = kernelRadius; x < width - kernelRadius; x++) {
      // Proses setiap saluran warna secara terpisah (R, G, B)
      for (let c = 0; c < 3; c++) {
        const values = []

        // Kumpulkan nilai dari lingkungan 3x3
        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
          for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c
            values.push(data[idx])
          }
        }

        // Urutkan nilai dan dapatkan median (nilai tengah)
        values.sort((a, b) => a - b)
        const medianValue = values[Math.floor(values.length / 2)]

        // Atur nilai median dalam hasil
        const idx = (y * width + x) * 4 + c
        resultData[idx] = medianValue
      }
    }
  }

  // Buat objek ImageData baru dengan data yang telah diproses
  return new ImageData(resultData, width, height)
}

/**
 * Terapkan filter rerata untuk penghalusan
 * Filter ini menggantikan setiap piksel dengan nilai rata-rata dari lingkungan tetangganya
 * Menciptakan efek pengaburan/penghalusan
 * @param {ImageData} imageData - Data gambar asli
 * @returns {ImageData} - Data gambar yang dihaluskan
 */
function applyMeanFilter(imageData) {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data

  // Buat salinan data gambar untuk menyimpan hasil
  const resultData = new Uint8ClampedArray(data)

  // Tentukan ukuran kernel (lingkungan 3x3)
  const kernelSize = 3
  const kernelRadius = Math.floor(kernelSize / 2) // Radius = 1 untuk kernel 3x3

  // Proses gambar (lewati piksel tepi)
  for (let y = kernelRadius; y < height - kernelRadius; y++) {
    for (let x = kernelRadius; x < width - kernelRadius; x++) {
      // Proses setiap saluran warna secara terpisah (R, G, B)
      for (let c = 0; c < 3; c++) {
        let sum = 0

        // Jumlahkan nilai dari lingkungan 3x3
        for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
          for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c
            sum += data[idx]
          }
        }

        // Hitung nilai rata-rata
        const meanValue = Math.round(sum / (kernelSize * kernelSize))

        // Atur nilai rata-rata dalam hasil
        const idx = (y * width + x) * 4 + c
        resultData[idx] = meanValue
      }
    }
  }

  // Buat objek ImageData baru dengan data yang telah diproses
  return new ImageData(resultData, width, height)
}

/**
 * Terapkan deteksi tepi Sobel
 * Filter ini mendeteksi tepi dengan menghitung gradien intensitas
 * @param {ImageData} imageData - Data gambar asli
 * @returns {ImageData} - Data gambar dengan tepi terdeteksi
 */
function applyEdgeDetection(imageData) {
  // Pertama konversi ke grayscale jika belum (deteksi tepi bekerja pada grayscale)
  let processedData = imageData

  // Periksa apakah gambar sudah grayscale
  const data = imageData.data
  let isGrayscale = true

  // Sampel beberapa piksel untuk memeriksa apakah R=G=B (grayscale)
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] !== data[i + 1] || data[i] !== data[i + 2]) {
      isGrayscale = false
      break
    }
  }

  // Konversi ke grayscale jika diperlukan
  if (!isGrayscale) {
    processedData = convertToGrayscale(imageData)
  }

  const width = processedData.width
  const height = processedData.height
  const inputData = processedData.data

  // Buat array baru untuk output
  const outputData = new Uint8ClampedArray(inputData.length)

  // Kernel Sobel untuk mendeteksi tepi horizontal dan vertikal
  // Kernel gradien horizontal (mendeteksi tepi vertikal)
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]

  // Kernel gradien vertikal (mendeteksi tepi horizontal)
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]

  // Terapkan operator Sobel (lewati piksel tepi)
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let pixelX = 0
      let pixelY = 0

      // Terapkan konvolusi dengan kedua kernel
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4
          const kernelIdx = (ky + 1) * 3 + (kx + 1)

          // Terapkan bobot kernel ke nilai piksel
          pixelX += inputData[idx] * sobelX[kernelIdx]
          pixelY += inputData[idx] * sobelY[kernelIdx]
        }
      }

      // Hitung besaran gradien menggunakan teorema Pythagoras
      const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY)

      // Normalisasi dan batasi nilai tepi
      const idx = (y * width + x) * 4
      const edgeValue = Math.min(255, Math.max(0, Math.round(magnitude)))

      // Atur nilai RGB ke nilai tepi (tepi putih pada latar belakang hitam)
      outputData[idx] = edgeValue // R
      outputData[idx + 1] = edgeValue // G
      outputData[idx + 2] = edgeValue // B
      outputData[idx + 3] = inputData[idx + 3] // Pertahankan alpha asli
    }
  }

  // Buat objek ImageData baru dengan data yang telah diproses
  return new ImageData(outputData, width, height)
}
