// DOM Elements
const imageUpload = document.getElementById("imageUpload")
const originalCanvas = document.getElementById("originalCanvas")
const resultCanvas = document.getElementById("resultCanvas")
const processButton = document.getElementById("processButton")
const downloadButton = document.getElementById("downloadButton")
const infoButton = document.getElementById("infoButton")
const infoModal = document.getElementById("infoModal")
const closeInfoModal = document.getElementById("closeInfoModal")
const processingInfo = document.getElementById("processingInfo")

// Sliders
const brightnessSlider = document.getElementById("brightness")
const contrastSlider = document.getElementById("contrast")
const brightnessValue = document.getElementById("brightnessValue")
const contrastValue = document.getElementById("contrastValue")

// Checkboxes
const grayscaleCheckbox = document.getElementById("grayscale")
const medianFilterCheckbox = document.getElementById("medianFilter")
const smoothingCheckbox = document.getElementById("smoothing")
const edgeDetectionCheckbox = document.getElementById("edgeDetection")

// Canvas contexts
const originalCtx = originalCanvas.getContext("2d")
const resultCtx = resultCanvas.getContext("2d")

// Original image data
let originalImage = null

// Image processing functions (stubs - replace with actual implementations)
function convertToGrayscale(imageData) {
  // Implementation for grayscale conversion
  return imageData
}

function adjustBrightnessContrast(imageData, brightness, contrast) {
  // Implementation for brightness/contrast adjustment
  return imageData
}

function applyMedianFilter(imageData) {
  // Implementation for median filter
  return imageData
}

function applyMeanFilter(imageData) {
  // Implementation for mean filter (smoothing)
  return imageData
}

function applyEdgeDetection(imageData) {
  // Implementation for edge detection
  return imageData
}

// Event listeners
imageUpload.addEventListener("change", handleImageUpload)
processButton.addEventListener("change", processImage)
downloadButton.addEventListener("click", downloadImage)
infoButton.addEventListener("click", () => infoModal.classList.remove("hidden"))
closeInfoModal.addEventListener("click", () => infoModal.classList.add("hidden"))

// Slider event listeners
brightnessSlider.addEventListener("input", updateSliderValue)
contrastSlider.addEventListener("input", updateSliderValue)

// Process image when any control changes
const controls = [
  brightnessSlider,
  contrastSlider,
  grayscaleCheckbox,
  medianFilterCheckbox,
  smoothingCheckbox,
  edgeDetectionCheckbox,
]

controls.forEach((control) => {
  control.addEventListener("change", () => {
    if (originalImage) {
      processImage()
      updateProcessingInfo()
    }
  })

  // For sliders, also update on input
  if (control.type === "range") {
    control.addEventListener("input", () => {
      if (originalImage) {
        processImage()
        updateProcessingInfo()
      }
    })
  }
})

// Handle image upload
function handleImageUpload(e) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    const img = new Image()
    img.onload = () => {
      // Set canvas dimensions
      originalCanvas.width = img.width
      originalCanvas.height = img.height
      resultCanvas.width = img.width
      resultCanvas.height = img.height

      // Draw original image
      originalCtx.clearRect(0, 0, originalCanvas.width, originalCanvas.height)
      originalCtx.drawImage(img, 0, 0)

      // Store original image
      originalImage = img

      // Enable process button
      processButton.disabled = false

      // Process image immediately
      processImage()
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(file)
}

// Process image with selected operations
function processImage() {
  if (!originalImage) return

  // Get image data from original canvas
  const imageData = originalCtx.getImageData(0, 0, originalCanvas.width, originalCanvas.height)

  // Create a copy of the image data for processing
  let processedData = new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height)

  // Apply operations in sequence

  // 1. Grayscale
  if (grayscaleCheckbox.checked) {
    processedData = convertToGrayscale(processedData)
  }

  // 2. Brightness and Contrast
  const brightnessValue = Number.parseInt(brightnessSlider.value)
  const contrastValue = Number.parseInt(contrastSlider.value)
  if (brightnessValue !== 0 || contrastValue !== 0) {
    processedData = adjustBrightnessContrast(processedData, brightnessValue, contrastValue)
  }

  // 3. Median Filter
  if (medianFilterCheckbox.checked) {
    processedData = applyMedianFilter(processedData)
  }

  // 4. Smoothing (Mean Filter)
  if (smoothingCheckbox.checked) {
    processedData = applyMeanFilter(processedData)
  }

  // 5. Edge Detection
  if (edgeDetectionCheckbox.checked) {
    processedData = applyEdgeDetection(processedData)
  }

  // Draw processed image on result canvas
  resultCtx.putImageData(processedData, 0, 0)

  // Enable download button
  downloadButton.disabled = false

  // Update processing info
  updateProcessingInfo()
}

// Update slider value display
function updateSliderValue(e) {
  if (e.target.id === "brightness") {
    brightnessValue.textContent = e.target.value
  } else if (e.target.id === "contrast") {
    contrastValue.textContent = e.target.value
  }
}

// Download processed image
function downloadImage() {
  if (!resultCanvas.width) return

  const link = document.createElement("a")
  link.download = "editin_result.png"
  link.href = resultCanvas.toDataURL("image/png")
  link.click()
}

// Update processing info based on selected operations
function updateProcessingInfo() {
  let infoHTML = ""

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

  if (infoHTML === "") {
    infoHTML = "<p>Pilih operasi pengolahan citra untuk melihat informasi.</p>"
  }

  processingInfo.innerHTML = infoHTML
}
