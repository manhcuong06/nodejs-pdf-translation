require('dotenv').config();
const fs = require('fs');
const pdfParse = require('pdf-parse');
const translate = require('translate');

translate.engine = 'google';
translate.key = process.env.TRANSLATE_KEY;

const PDF_PATH = `./files/${process.env.PDF_FILE}.pdf`;
const FORMATTED_PATH = './files/formatted.txt';
const TRANSLATED_PATH = './files/translated.txt';
const FROM_PAGE = 116;
const TO_PAGE = 226;
const DESTINATION_LANGUAGE = 'vi';

const initPages = text => {
    const pages = text.split(/\n{2}/g).slice(FROM_PAGE, TO_PAGE);
    pages.forEach((page, index) => {
        var pageNum = index + FROM_PAGE;
        fs.appendFileSync(FORMATTED_PATH, `${page}\nPage: ${pageNum}\n\n`);
    });

    return pages;
};

const printInfo = pages => {
    const numOfPages = pages.length;

    console.log('Total pages after formatted: ', numOfPages);
    console.log('Total characters: ', pages.join('\n').length);
    console.log('\n---------- From page ----------\n', pages[0]);
    console.log('\n---------- To page ----------\n', pages[numOfPages - 1]);
};

const translatePages = async pages => {
    const pageLength = pages.length;
    for (let index = 0; index < pageLength; index++) {
        var pageNum = index + FROM_PAGE;
        const translatedText = await translate(pages[index], DESTINATION_LANGUAGE);
        fs.appendFileSync(TRANSLATED_PATH, `${translatedText}\nPage: ${pageNum}\n\n`);
    }
};

/* Main Process. */
fs.writeFileSync(FORMATTED_PATH, '');
fs.writeFileSync(TRANSLATED_PATH, '');

const pdfDataBuffer = fs.readFileSync(PDF_PATH);
pdfParse(pdfDataBuffer).then(async pdfData => {
    const { numpages, text } = pdfData;
    console.log('Total pages: ', numpages);

    /* Initial pages. */
    const pages = initPages(text);

    /* Print out the infomation. */
    printInfo(pages);

    /* Remove comments to translate. */
    // await translatePages(pages);
});
/* END Main Process. */
