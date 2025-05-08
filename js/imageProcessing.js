// Convert image to grayscale
function convertToGrayscale(imageData) {
    const data = imageData.data
  
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
  
      // Calculate grayscale value (average method)
      const gray = Math.round((r + g + b) / 3)
  
      // Set RGB values to the grayscale value
      data[i] = gray // R
      data[i + 1] = gray // G
      data[i + 2] = gray // B
      // Alpha channel (data[i + 3]) remains unchanged
    }
  
    return imageData
  }
  
  // Adjust brightness and contrast
  function adjustBrightnessContrast(imageData, brightness, contrast) {
    const data = imageData.data
  
    // Convert contrast to a multiplier (0-100 -> 0-2)
    const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast))
  
    for (let i = 0; i < data.length; i += 4) {
      // Apply brightness
      let r = data[i] + brightness
      let g = data[i + 1] + brightness
      let b = data[i + 2] + brightness
  
      // Apply contrast
      r = contrastFactor * (r - 128) + 128
      g = contrastFactor * (g - 128) + 128
      b = contrastFactor * (b - 128) + 128
  
      // Clamp values to 0-255 range
      data[i] = Math.max(0, Math.min(255, Math.round(r)))
      data[i + 1] = Math.max(0, Math.min(255, Math.round(g)))
      data[i + 2] = Math.max(0, Math.min(255, Math.round(b)))
      // Alpha channel (data[i + 3]) remains unchanged
    }
  
    return imageData
  }
  
  // Apply median filter for noise reduction
  function applyMedianFilter(imageData) {
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data
  
    // Create a copy of the image data
    const resultData = new Uint8ClampedArray(data)
  
    // Kernel size (3x3)
    const kernelSize = 3
    const kernelRadius = Math.floor(kernelSize / 2)
  
    for (let y = kernelRadius; y < height - kernelRadius; y++) {
      for (let x = kernelRadius; x < width - kernelRadius; x++) {
        // Process each color channel separately
        for (let c = 0; c < 3; c++) {
          const values = []
  
          // Collect values from the kernel neighborhood
          for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
            for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c
              values.push(data[idx])
            }
          }
  
          // Sort values and get the median
          values.sort((a, b) => a - b)
          const medianValue = values[Math.floor(values.length / 2)]
  
          // Set the median value
          const idx = (y * width + x) * 4 + c
          resultData[idx] = medianValue
        }
      }
    }
  
    // Create a new ImageData object with the processed data
    return new ImageData(resultData, width, height)
  }
  
  // Apply mean filter for smoothing
  function applyMeanFilter(imageData) {
    const width = imageData.width
    const height = imageData.height
    const data = imageData.data
  
    // Create a copy of the image data
    const resultData = new Uint8ClampedArray(data)
  
    // Kernel size (3x3)
    const kernelSize = 3
    const kernelRadius = Math.floor(kernelSize / 2)
  
    for (let y = kernelRadius; y < height - kernelRadius; y++) {
      for (let x = kernelRadius; x < width - kernelRadius; x++) {
        // Process each color channel separately
        for (let c = 0; c < 3; c++) {
          let sum = 0
  
          // Sum values from the kernel neighborhood
          for (let ky = -kernelRadius; ky <= kernelRadius; ky++) {
            for (let kx = -kernelRadius; kx <= kernelRadius; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c
              sum += data[idx]
            }
          }
  
          // Calculate the mean value
          const meanValue = Math.round(sum / (kernelSize * kernelSize))
  
          // Set the mean value
          const idx = (y * width + x) * 4 + c
          resultData[idx] = meanValue
        }
      }
    }
  
    // Create a new ImageData object with the processed data
    return new ImageData(resultData, width, height)
  }
  
  // Apply Sobel edge detection
  function applyEdgeDetection(imageData) {
    // First convert to grayscale if not already
    let processedData = imageData
  
    // Check if the image is already grayscale
    const data = imageData.data
    let isGrayscale = true
  
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== data[i + 1] || data[i] !== data[i + 2]) {
        isGrayscale = false
        break
      }
    }
  
    if (!isGrayscale) {
      processedData = convertToGrayscale(imageData)
    }
  
    const width = processedData.width
    const height = processedData.height
    const inputData = processedData.data
  
    // Create a new array for the output
    const outputData = new Uint8ClampedArray(inputData.length)
  
    // Sobel kernels
    const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1]
  
    const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1]
  
    // Apply Sobel operator
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0
        let pixelY = 0
  
        // Apply convolution
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4
            const kernelIdx = (ky + 1) * 3 + (kx + 1)
  
            pixelX += inputData[idx] * sobelX[kernelIdx]
            pixelY += inputData[idx] * sobelY[kernelIdx]
          }
        }
  
        // Calculate gradient magnitude
        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY)
  
        // Normalize and threshold
        const idx = (y * width + x) * 4
        const edgeValue = Math.min(255, Math.max(0, Math.round(magnitude)))
  
        // Set RGB values to the edge value
        outputData[idx] = edgeValue // R
        outputData[idx + 1] = edgeValue // G
        outputData[idx + 2] = edgeValue // B
        outputData[idx + 3] = inputData[idx + 3] // Keep original alpha
      }
    }
  
    // Create a new ImageData object with the processed data
    return new ImageData(outputData, width, height)
  }
  