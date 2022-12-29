import * as fs from 'fs';
import * as handlebars from 'handlebars';
import path from 'path';
import * as puppeteer from 'puppeteer';
import { FileData } from 'src/modules/create-document-qr/dto/create-create-document-qr.dto';

export class PdfHelper {
    browser;

    fileOptions = {
        width: '21cm',
        height: '29.7cm',
        headerTemplate: '<p></p>',
        footerTemplate: '<p></p>',
        displayHeaderFooter: false,
        margin: {
            top: '0',
            bottom: '0',
        },
        printBackground: true,
        path: '',
    };
    constructor() {
        this.startBrowser();
    }

    async startBrowser() {
        this.browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });
    }


    public async createPDF(dataFile: FileData): Promise<Buffer> {

        const templateHtml = fs.readFileSync(`./src/assets/templates/${dataFile.template}`, 'utf8');

        const template = handlebars.compile(templateHtml);
        var mili = new Date();
        var milis = mili.getTime();

        const html = template(dataFile.data);

        const finalPageContent = eval('`' + html + '`');

        if (!this.browser) {
            await this.startBrowser();
        }
        const page = await this.browser.newPage();
        await page.setContent(`${finalPageContent}`, {
            waitUntil: 'networkidle0',
        });

        //this.fileOptions.path = path.join('pdf', `${'dato'}-${milis}.pdf`);

        const file = await page.pdf(this.fileOptions);
        await page.close();
        //  console.log(file);
        return file;

    }


    public async createDocumentPDF(dataFile: FileData): Promise<Buffer> {
        // ...
        var mili = new Date();
        var milis = mili.getTime();
        var finalPageContent = '';

        // Itera sobre el conjunto de datos y genera un PDF por cada iteración
        for (const datum of dataFile.data) {
            const templateHtml = fs.readFileSync(`./src/assets/templates/${dataFile.template}`, 'utf8');

            const template = handlebars.compile(templateHtml);
            // Genera el contenido HTML para la página actual
            const html = template(datum);

            // Agrega el contenido HTML de la página actual al contenido final del PDF
            finalPageContent += eval('`' + html + '`');

        }

        if (!this.browser) {
            await this.startBrowser();
        }
        const page = await this.browser.newPage();
        await page.setContent(`${finalPageContent}`, {
            waitUntil: 'networkidle0',
        });

        // this.fileOptions.path = path.join('pdf', `${'dato'}-${milis}.pdf`);
        // Genera el archivo PDF a partir del contenido final
        const file = await page.pdf(this.fileOptions);

        await page.close();

        return file;
    }








}
