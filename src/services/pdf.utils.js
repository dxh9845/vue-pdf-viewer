// eslint-disable-next-line import/prefer-default-export
export const readFileToBuffer = (inputFile) => {
  const temporaryFileReader = new FileReader()

  return new Promise((resolve, reject) => {
    temporaryFileReader.onerror = () => {
      temporaryFileReader.abort()
      reject(new DOMException('Problem parsing input file.'))
    }

    temporaryFileReader.onload = () => {
            // Return a typed Unsigned int array
      resolve(new Uint8Array(temporaryFileReader.result))
    }

        // Read the file as an array buffer
    temporaryFileReader.readAsArrayBuffer(inputFile)
  })
}

export const SLIDE_NOT_LOADED = 0
export const SLIDE_LOADING = 1
export const SLIDE_LOADED = 2
