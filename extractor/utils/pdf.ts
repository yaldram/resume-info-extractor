import { getDocument } from 'pdfjs-dist';

export async function extractTextFromPdf(typedArray: Uint8Array) {
    const pdfDocument = await getDocument(typedArray).promise;

    let textContent = '';

    for (let i = 1; i <= pdfDocument.numPages; i++) {
        // Get each page
        const page = await pdfDocument.getPage(i);

        // Extract the text content from the page
        const textData = await page.getTextContent();

        // Combine all the items' strings into one string
        textContent += textData.items.map((item) => item.str).join(' ');
    }

    return textContent;
}
