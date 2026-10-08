import pdfParse from 'pdf-parse';
import fs from 'fs';

export interface ExtractedPdf {
  text: string;
  numPages: number;
  info?: any;
}

export async function extractTextFromPdf(filePathOrBuffer: string | Buffer): Promise<ExtractedPdf> {
  try {
    let dataBuffer: Buffer;
    if (typeof filePathOrBuffer === 'string') {
      if (!fs.existsSync(filePathOrBuffer)) {
        throw new Error(`PDF file does not exist at path: ${filePathOrBuffer}`);
      }
      dataBuffer = fs.readFileSync(filePathOrBuffer);
    } else {
      dataBuffer = filePathOrBuffer;
    }

    if (!dataBuffer || dataBuffer.length === 0) {
      throw new Error('PDF file buffer is empty.');
    }

    const data = await pdfParse(dataBuffer);
    
    // Clean and normalize text
    const cleanText = data.text
      ? data.text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').trim()
      : '';

    if (cleanText.length < 20) {
      throw new Error('PDF contains insufficient readable text (likely scanned image without OCR).');
    }

    return {
      text: cleanText,
      numPages: data.numpages || 1,
      info: data.info || {}
    };
  } catch (err: any) {
    throw new Error(`PDF Extraction Error: ${err.message || 'Failed to parse PDF document'}`);
  }
}
