/**
 * Editin_ - Aplikasi Pengolahan Citra Web
 * File aplikasi utama yang menangani interaksi UI dan alur kerja
 */

// Elemen DOM - Mendapatkan referensi ke semua elemen HTML yang perlu diinteraksikan
const imageUpload = document.getElementById("imageUpload")
const originalCanvas = document.getElementById("originalCanvas")
const resultCanvas = document.getElementById("resultCanvas")
const processButton = document.getElementById("processButton")
const downloadButton = document.getElementById("downloadButton")
const infoButton = document.getElementById("infoButton")
const infoModal = document.getElementById("infoModal")
const closeInfoModal = document.getElementById("closeInfoModal")
const processingInfo = document.getElementById("processingInfo")

// Slider - Mendapatkan referensi ke elemen slider dan tampilan nilainya
const brightnessSlider = document.getElementById("brightness")
const contrastSlider = document.getElementById("contrast")
const brightnessValue = document.getElementById("brightnessValue")
const contrastValue = document.getElementById("contrastValue")

// Checkbox - Mendapatkan referensi ke semua checkbox opsi pemrosesan
const grayscaleCheckbox = document.getElementById("grayscale")
const medianFilterCheckbox = document.getElementById("medianFilter")
const smoothingCheckbox = document.getElementById("smoothing")
const edgeDetectionCheckbox = document.getElementById("edgeDetection")

// Konteks canvas - Mendapatkan konteks 2D untuk menggambar pada kedua canvas
const originalCtx = originalCanvas.getContext("2d")
const resultCtx = resultCanvas.getContext("2d")

// Data gambar asli - Akan menyimpan gambar yang diunggah
let originalImage = null

// Fungsi pemrosesan gambar (diasumsikan didefinisikan di tempat lain atau diimpor)
// Untuk demonstrasi, mari kita definisikan fungsi placeholder:
function convertToGrayscale(imageData) {
  // Implementasi placeholder
  return imageData
}

function adjustBrightnessContrast(imageData, brightness, contrast) {
  // Implementasi placeholder
  return imageData
}

function applyMedianFilter(imageData) {
  // Implementasi placeholder
  return imageData
}

function applyMeanFilter(imageData) {
  // Implementasi placeholder
  return imageData
}

function applyEdgeDetection(imageData) {
  // Implementasi placeholder
  return imageData
}

// Event listener - Menyiapkan semua handler event untuk interaksi pengguna
imageUpload.addEventListener("change", handleImageUpload)
processButton.addEventListener("click", processImage) // Catatan: Diperbaiki dari "change" menjadi "click"
downloadButton.addEventListener("click", downloadImage)
infoButton.addEventListener("click", () => infoModal.classList.remove("hidden"))
closeInfoModal.addEventListener("click", () => infoModal.classList.add("hidden"))

// Event listener slider - Memperbarui nilai yang ditampilkan saat slider berubah
brightnessSlider.addEventListener("input", updateSliderValue)
contrastSlider.addEventListener("input", updateSliderValue)

// Proses gambar saat ada kontrol yang berubah - Kumpulkan semua kontrol ke dalam array
const controls = [
  brightnessSlider,
  contrastSlider,
  grayscaleCheckbox,
  medianFilterCheckbox,
  smoothingCheckbox,
  edgeDetectionCheckbox,
]

// Tambahkan event listener ke semua kontrol
controls.forEach((control) => {
  // Proses gambar saat nilai kontrol berubah
  control.addEventListener("change", () => {
    if (originalImage) {
      processImage()
      updateProcessingInfo()
    }
  })

  // Untuk slider, juga perbarui saat input (saat menyeret)
  if (control.type === "range") {
    control.addEventListener("input", () => {
      if (originalImage) {
        processImage()
        updateProcessingInfo()
      }
    })
  }
})

/**
 * Menangani unggahan gambar dari input file
 * Fungsi ini dipanggil saat pengguna memilih file gambar
 * @param {Event} e - Event perubahan dari input file
 */
function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new Image()
    img.onload = () => {
      // Atur dimensi canvas agar sesuai dengan gambar yang diunggah
      originalCanvas.width = img.width
      originalCanvas.height = img.height
      resultCanvas.width = img.width
      resultCanvas.height = img.height

      // Gambar gambar asli pada canvas pertama
      originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height)
      originalCtx.drawImage(img, 0, 0)

      // Simpan gambar asli untuk pemrosesan nanti
      originalImage = img

      // Aktifkan tombol proses sekarang karena sudah ada gambar
      processButton.disabled = false

      // Proses gambar segera dengan pengaturan default
      processImage()
    }
    img.src = event.target.result // Atur sumber gambar ke data file
  }
  reader.readAsDataURL(file) // Baca file sebagai URL data
}

/**
 * Proses gambar dengan operasi yang dipilih
 * Fungsi ini menerapkan semua operasi pemrosesan gambar yang dipilih secara berurutan
 */
function processImage() {
  if (!originalImage) return

  // Dapatkan data gambar dari canvas asli
  const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height)

  // Buat salinan data gambar untuk pemrosesan
  let processedData = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height)

  // Terapkan operasi secara berurutan - Urutan penting!

  // 1. Grayscale - Konversi ke grayscale terlebih dahulu jika dipilih
  if (grayscaleCheckbox.checked) {
    processedData = convertToGrayscale(processedData)
  }

  // 2. Brightness dan Contrast - Terapkan penyesuaian brightness/contrast
  const brightnessValue = Number.parseInt(brightnessSlider.value)
  const contrastValue = Number.parseInt(contrastSlider.value)
  if (brightnessValue !== 0 || contrastValue !== 0) {
    processedData = adjustBrightnessContrast(processedData, brightnessValue, contrastValue)
  }

  // 3. Filter Median - Terapkan pengurangan noise jika dipilih
  if (medianFilterCheckbox.checked) {
    processedData = applyMedianFilter(processedData)
  }

  // 4. Smoothing (Filter Rerata) - Terapkan penghalusan jika dipilih
  if (smoothingCheckbox.checked) {
    processedData = applyMeanFilter(processedData)
  }

  // 5. Deteksi Tepi - Terapkan deteksi tepi terakhir jika dipilih
  if (edgeDetectionCheckbox.checked) {
    processedData = applyEdgeDetection(processedData)
  }

  // Gambar gambar yang telah diproses pada canvas hasil
  resultCtx.putImageData(processedData, 0, 0)

  // Aktifkan tombol unduh sekarang karena sudah ada gambar yang diproses
  downloadButton.disabled = false

  // Perbarui tampilan info pemrosesan
  updateProcessingInfo()
}

/**
 * Perbarui tampilan nilai slider
 * Fungsi ini memperbarui nilai yang ditampilkan untuk slider brightness dan contrast
 * @param {Event} e - Event input dari slider
 */
function updateSliderValue(e) {
  if (e.target.id === "brightness") {
    brightnessValue.textContent = e.target.value
  } else if (e.target.id === "contrast") {
    contrastValue.textContent = e.target.value
  }
}

/**
 * Unduh gambar yang telah diproses
 * Fungsi ini membuat tautan unduhan untuk gambar yang telah diproses
 */
function downloadImage() {
  if (!resultCanvas.width) return

  // Buat elemen tautan sementara
  const link = document.createElement("a")
  link.download = "editin_result.png" // Atur nama file unduhan
  link.href = resultCanvas.toDataURL("image/png") // Konversi canvas ke URL data
  link.click() // Simulasikan klik untuk memicu unduhan
}

/**
 * Perbarui tampilan info pemrosesan
 * Fungsi ini memperbarui panel informasi dengan detail tentang operasi yang dipilih
 */
function updateProcessingInfo() {
  let infoHTML = ""

  // Tambahkan informasi untuk setiap operasi yang dipilih
  if (grayscaleCheckbox.checked) {
    infoHTML += `
      <div>
        <h3 class="font-medium text-gray-700 mb-1">Konversi ke Grayscale</h3>
        <p>Mengubah gambar berwarna menjadi gambar abu-abu dengan menghitung rata-rata nilai RGB setiap piksel. Proses ini mengurangi kompleksitas gambar dan sering digunakan sebagai langkah pra-pemrosesan untuk operasi pengolahan citra lainnya.</p>
      </div>
    `
  }

  if (brightnessSlider.value !== "0" || contrastSlider.value !== "0") {
    infoHTML += `
      <div>
        <h3 class="font-medium text-gray-700 mb-1">Brightness & Contrast</h3>
        <p>Brightness (${brightnessSlider.value}): Mengatur tingkat kecerahan gambar dengan menambah atau mengurangi nilai setiap piksel.</p>
        <p>Contrast (${contrastSlider.value}): Mengatur perbedaan antara area terang dan gelap pada gambar, meningkatkan atau mengurangi rentang nilai piksel.</p>
      </div>
    `
  }

  if (medianFilterCheckbox.checked) {
    infoHTML += `
      <div>
        <h3 class="font-medium text-gray-700 mb-1">Filter Median</h3>
        <p>Mengurangi noise pada gambar dengan mengganti nilai setiap piksel dengan nilai median dari piksel-piksel tetangganya. Filter ini sangat efektif untuk menghilangkan noise "salt and pepper" sambil mempertahankan tepi gambar.</p>
      </div>
    `
  }

  if (smoothingCheckbox.checked) {
    infoHTML += `
      <div>
        <h3 class="font-medium text-gray-700 mb-1">Smoothing (Filter Rerata)</h3>
        <p>Menghaluskan gambar dengan mengganti nilai setiap piksel dengan rata-rata nilai piksel-piksel tetangganya. Proses ini mengurangi variasi intensitas antara piksel yang berdekatan, menghasilkan gambar yang lebih halus.</p>
      </div>
    `
  }

  if (edgeDetectionCheckbox.checked) {
    infoHTML += `
      <div>
        <h3 class="font-medium text-gray-700 mb-1">Deteksi Tepi (Sobel)</h3>
        <p>Mengidentifikasi tepi dalam gambar dengan mendeteksi perubahan intensitas yang signifikan antara piksel-piksel yang berdekatan. Operator Sobel menggunakan dua kernel konvolusi untuk mendeteksi perubahan intensitas dalam arah horizontal dan vertikal.</p>
      </div>
    `
  }

  // Jika tidak ada operasi yang dipilih, tampilkan pesan default
  if (infoHTML === "") {
    infoHTML = "<p>Pilih operasi pengolahan citra untuk melihat informasi.</p>"
  }

  // Perbarui panel info dengan HTML yang dihasilkan
  processingInfo.innerHTML = infoHTML
}
