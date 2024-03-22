import { createWorker } from "tesseract.js";

async function handler(event) {
    try {
        const { base64image, lang, url } = JSON.parse(event.body);

        if (!base64image && !url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Either base64image or url should be specified. Lang is optional (default 'eng')." }),
            };
        }
        
        const data = base64image || url;
        const language = lang || "eng";

        const extractedImageData = await extractImageData(data, language);

        const { text, bboxes } = await processImageData(extractedImageData);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ text, bboxes }),
        };

      
    } catch (error) {
        console.error("Error in handler:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal server error." }),
        };
    }
}

async function extractImageData(data, lang) {
    const worker = await createWorker(lang );

    const result = await worker.recognize(data);

    await worker.terminate();

    return result;
}

async function processImageData(data) {
    const text = data.data.words.map(word => word.text).join(" ");

    const bboxes = data.data.words.reduce((acc, word) => {
        acc[word.text] = word.bbox;
        return acc;
    }, {});

    return { text, bboxes };
}

// Example usage
// const base64image = "your_base64_encoded_image_data_here";
// const lang = "eng";
// handler({
//     body: JSON.stringify({ base64image, lang }),
// })
//     .then(res => console.log(res))
//     .catch(err => console.error(err));

export { handler };

