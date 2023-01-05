import { BodyContent } from './../modules/create-document-qr/dto/create-create-document-qr.dto';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as handlebars from 'handlebars';
import path from 'path';
import * as puppeteer from 'puppeteer';
import { FileData } from 'src/modules/create-document-qr/dto/create-create-document-qr.dto';

export class PdfHelper {
  browser;

  fileOptions = {
    width: '21cm',
    height: '29.7cm',

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

  public functionsGenerationPdf = {
    templateBaseFondo: (data: FileData) => this.createDocumentPDFFondo(data),
    templateBase5x5: (data: FileData) => this.createDocumentPDF5x5(data),
    templateBase10x10: (data: FileData) => this.createDocumentPDF10x10(data),
  };

  public async createDocumentPDFFondo(dataFile: FileData): Promise<Buffer> {
    let finalPageContent = '';
    let contentHtml: BodyContent = {
      bodycap: '',
    };

    // Itera sobre el conjunto de datos y genera un PDF por cada iteración
    for (let i = 1; i <= dataFile.data.length; i++) {
      let datum = dataFile.data[i - 1]; // Obtiene el dato para la página actual
      contentHtml = datum;
      // Genera el contenido HTML para la página actual
      const html = await this.generatePagePdf(dataFile.template, contentHtml);
      // Agrega el contenido HTML de la página actual al contenido final del PDF
      finalPageContent += eval('`' + html + '`');
      contentHtml.bodycap = '';
      // console.log(finalPageContent);
    }
    return await this.generateDocumentPdf(finalPageContent);
  }

  public async createDocumentPDF5x5(dataFile: FileData): Promise<Buffer> {
    let finalPageContent = '';

    let contador = 1;
    let contentHtml: BodyContent = {
      bodycap: '',
    };

    const limitPage = 12;
    const limitData = this.obtenerLimite(dataFile.data.length, limitPage);
    // Itera sobre el conjunto de datos y genera un PDF por cada iteración

    for (let i = 1; i <= limitData; i++) {
      let datum = dataFile.data[i - 1]; // Obtiene el dato para la página actual

      if (datum === undefined) {
        datum = await this.getDataEmpty();
      }
      contentHtml.bodycap += await this.createCardsDiv5x5(datum);

      if (contador == limitPage) {
        // Genera el contenido HTML para la página actual
        const html = await this.generatePagePdf(dataFile.template, contentHtml);
        // Agrega el contenido HTML de la página actual al contenido final del PDF
        finalPageContent += eval('`' + html + '`');
        contador = 0;
        contentHtml.bodycap = '';
      }
      contador++;
    }

    return await this.generateDocumentPdf(finalPageContent);
  }

  public async createDocumentPDF10x10(dataFile: FileData): Promise<Buffer> {
    let finalPageContent = '';

    let contador = 1;
    let contentHtml: BodyContent = {
      bodycap: '',
    };
    const limitPage = 2;
    const limitData = this.obtenerLimite(dataFile.data.length, limitPage);
    //Itera sobre el conjunto de datos y genera un PDF por cada iteración

    for (let i = 1; i <= limitData; i++) {
      let datum = dataFile.data[i - 1]; // Obtiene el dato para la página actual

      if (datum === undefined) {
        datum = await this.getDataEmpty();
      }

      contentHtml.bodycap += await this.createCardsDiv10x10(datum);

      if (contador == limitPage) {
        // Genera el contenido HTML para la página actual
        const html = await this.generatePagePdf(dataFile.template, contentHtml);
        // Agrega el contenido HTML de la página actual al contenido final del PDF
        finalPageContent += eval('`' + html + '`');
        contador = 0;
        contentHtml.bodycap = '';
      }
      contador++;
    }

    return await this.generateDocumentPdf(finalPageContent);
  }

  async generatePagePdf(nameTemplate: string, contentHtml: BodyContent) {
    const templateHtml = await this.getTemplate(nameTemplate);
    const template = handlebars.compile(templateHtml);
    // Genera el contenido HTML para la página actual
    const htmlPage = template(contentHtml);
    // Agrega el contenido HTML de la página actual al contenido final del PDF
    return eval('`' + htmlPage + '`');
  }

  async generateDocumentPdf(finalPageContent: any) {
    if (!this.browser) {
      await this.startBrowser();
    }
    const page = await this.browser.newPage();

    await page.setContent(`${finalPageContent}`, {
      waitUntil: 'networkidle0',
    });
    // Genera el archivo PDF a partir del contenido final
    const file = await page.pdf(this.fileOptions);
    await page.close();
    return file;
  }

  async createCardsDiv10x10(datum: any) {
    return `
        <div class="contenedor-body-qrs">
        <div class="texto-vertical-1 ">
          <div class="texto-vertical-2">CX00001</div>
        </div>
        <div class="cards">
          <div class="content-qr">
            <div class="qr2">
              <img src=${datum.qr} style="height:100%; width: 100%;">
            </div>
          </div>
          <div class="text-qr">
            <strong>${datum.merchant}</strong>
          </div>
          <div class="text-footer-qr">${datum.branch}</div>
          <div class="text-footer-qr">${datum.cashierNumber}</div>
        </div>
        <div class="texto-vertical-1 ">
          <div class="texto-vertical-2">CX00001</div>
        </div>
      </div>
        `;
  }

  async createCardsDiv5x5(datum: any) {
    return `
        <div>
            <div class="cards">
                <div class="body-primary">
                    <div class="content-qr"> <img src=${datum.qr} style="height:100% ; width: 100%;"></div>
                    <div class="fotter-qr">
                        <div class="text">${datum.merchant}</div>
                        <div class="text">${datum.branch}</div>
                        <div class="text">${datum.cashierNumber}</div>
                    </div>
                </div>
                <div class="fotter-primary">CX00001</div>
            </div>
        </div> `;
  }

  async getTemplate(nameTemplate: string) {
    return fs.readFileSync(`./src/assets/templates/${nameTemplate}`, 'utf8');
  }

  async getDataEmpty() {
    return {
      merchant: '',
      branch: '',
      cashierNumber: '',
      qr: '',
    };
  }

  obtenerLimite(limitData: number, limitPage: number): number {
    if (limitData % limitPage === 0) {
      return limitData;
    }
    return limitData + (limitPage - (limitData % limitPage));
  }
}
