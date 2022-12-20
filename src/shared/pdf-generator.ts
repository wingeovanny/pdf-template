import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
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
        this.registerHelpers();
    }

    async startBrowser() {
        this.browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });
    }

    async registerHelpers() {
        handlebars.registerHelper('switch', function (value, options) {
            this.switch_value = value;
            this.switch_break = false;
            return options.fn(this);
        });

        handlebars.registerHelper('case', function (value, options) {
            if (value == this.switch_value) {
                this.switch_break = true;
                return options.fn(this);
            }
        });

        handlebars.registerHelper('default', function (value, options) {
            if (this.switch_break == false) {
                return value;
            }
        });
    }

    async closeBrowser() {
        await this.browser.close();
    }

    public async createPDF(dataFile: FileData) {
        const templateHtml = fs.readFileSync(dataFile.template, 'utf8');
        const template = handlebars.compile(templateHtml);
        const html = template(dataFile.data);
        const finalPageContent = eval('`' + html + '`');
        if (!this.browser) {
            await this.startBrowser();
        }
        const page = await this.browser.newPage();
        await page.setContent(`${finalPageContent}`, {
            waitUntil: 'networkidle0',
        });
        //await page.addStyleTag({ path: 'src/assets/bootstrap.min.css' });
        const file = await page.pdf(this.fileOptions);
        await page.close();
        return file;
    }


}
