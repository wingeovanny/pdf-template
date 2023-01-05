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

  public async createPDF(dataFile: FileData): Promise<Buffer> {
    const templateHtml = fs.readFileSync(
      `./src/assets/templates/${dataFile.template}`,
      'utf8',
    );

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
      const templateHtml = fs.readFileSync(
        `./src/assets/templates/${dataFile.template}`,
        'utf8',
      );

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

    // Genera el archivo PDF a partir del contenido final
    const file = await page.pdf(this.fileOptions);

    await page.close();

    return file;
  }

  // public async createDocumentPDFNveces(
  //   dataFile: FileData,
  //   limitData: number,
  //   limitePage: number,
  // ): Promise<Buffer> {
  //   let finalPageContent = '';

  //   let contador = 1;
  //   let contentHtml: BodyContent = {
  //     bodycap: '',
  //   };
  //   // Itera sobre el conjunto de datos y genera un PDF por cada iteración

  //   for (let i = 1; i <= limitData; i++) {
  //     let datum = dataFile.data[i - 1]; // Obtiene el dato para la página actual

  //     if (datum === undefined) {
  //       datum = {
  //         branch: '',
  //         sitebranch: '',
  //         codesite: '',
  //         coderedmainsite: '',
  //         qr: '',
  //       };
  //     }

  //     if (limitePage != 1) {
  //       contentHtml.bodycap += await this.createCardsDiv(datum);
  //     } else {
  //       contentHtml = datum;
  //     }

  //     if (contador == limitePage) {
  //       const templateHtml = fs.readFileSync(
  //         `./src/assets/templates/${dataFile.template}`,
  //         'utf8',
  //       );

  //       const template = handlebars.compile(templateHtml);

  //       // Genera el contenido HTML para la página actual
  //       const html = template(contentHtml);

  //       // Agrega el contenido HTML de la página actual al contenido final del PDF
  //       finalPageContent += eval('`' + html + '`');

  //       contador = 0;
  //       contentHtml.bodycap = '';
  //       // console.log(finalPageContent);
  //     }
  //     contador++;
  //   }

  //   if (!this.browser) {
  //     await this.startBrowser();
  //   }
  //   const page = await this.browser.newPage();

  //   await page.setContent(`${finalPageContent}`, {
  //     waitUntil: 'networkidle0',
  //   });

  //   // Genera el archivo PDF a partir del contenido final
  //   const file = await page.pdf(this.fileOptions);

  //   await page.close();

  //   return file;
  // }

  public functionsGenerationPdf = {
    templateBase: (data: FileData, limiteData: number) =>
      this.createDocumentPDFFondo(data, limiteData),
    templateBase5x5: (data: FileData, limiteData: number, limitPage: number) =>
      this.createDocumentPDF5x5(data, limiteData, limitPage),
    templateBase10x10: (
      data: FileData,
      limiteData: number,
      limitPage: number,
    ) => this.createDocumentPDF10x10(data, limiteData, limitPage),
  };

  public async createDocumentPDFFondo(
    dataFile: FileData,
    limitData: number,
  ): Promise<Buffer> {
    let finalPageContent = '';

    let contentHtml: BodyContent = {
      bodycap: '',
    };
    // Itera sobre el conjunto de datos y genera un PDF por cada iteración
    for (let i = 1; i <= limitData; i++) {
      let datum = dataFile.data[i - 1]; // Obtiene el dato para la página actual
      contentHtml = datum;
      const templateHtml = await this.getTemplate(dataFile.template);
      const template = handlebars.compile(templateHtml);
      // Genera el contenido HTML para la página actual
      const html = template(contentHtml);
      // Agrega el contenido HTML de la página actual al contenido final del PDF
      finalPageContent += eval('`' + html + '`');
      contentHtml.bodycap = '';
      // console.log(finalPageContent);
    }

    // if (!this.browser) {
    //   await this.startBrowser();
    // }
    // const page = await this.browser.newPage();

    // await page.setContent(`${finalPageContent}`, {
    //   waitUntil: 'networkidle0',
    // });
    // // Genera el archivo PDF a partir del contenido final
    // const file = await page.pdf(this.fileOptions);
    // await page.close();
    // return file;
    return await this.generateDocumentPdf(finalPageContent);
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

  public async createDocumentPDF5x5(
    dataFile: FileData,
    limitData: number,
    limitePage: number,
  ): Promise<Buffer> {
    let finalPageContent = '';

    let contador = 1;
    let contentHtml: BodyContent = {
      bodycap: '',
    };
    // Itera sobre el conjunto de datos y genera un PDF por cada iteración

    for (let i = 1; i <= limitData; i++) {
      let datum = dataFile.data[i - 1]; // Obtiene el dato para la página actual

      if (datum === undefined) {
        datum = await this.getDataEmpty();
      }
      contentHtml.bodycap += await this.createCardsDiv5x5(datum);

      if (contador == limitePage) {
        const templateHtml = await this.getTemplate(dataFile.template);

        const template = handlebars.compile(templateHtml);

        // Genera el contenido HTML para la página actual
        const html = template(contentHtml);

        // Agrega el contenido HTML de la página actual al contenido final del PDF
        finalPageContent += eval('`' + html + '`');

        contador = 0;
        contentHtml.bodycap = '';
        // console.log(finalPageContent);
      }
      contador++;
    }

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

  public async createDocumentPDF10x10(
    dataFile: FileData,
    limitData: number,
    limitePage: number,
  ): Promise<Buffer> {
    let finalPageContent = '';

    let contador = 1;
    let contentHtml: BodyContent = {
      bodycap: '',
    };
    // Itera sobre el conjunto de datos y genera un PDF por cada iteración

    for (let i = 1; i <= limitData; i++) {
      let datum = dataFile.data[i - 1]; // Obtiene el dato para la página actual

      if (datum === undefined) {
        datum = await this.getDataEmpty();
      }

      contentHtml.bodycap += await this.createCardsDiv10x10(datum);

      if (contador == limitePage) {
        const templateHtml = await this.getTemplate(dataFile.template);
        const template = handlebars.compile(templateHtml);
        // Genera el contenido HTML para la página actual
        const html = template(contentHtml);
        // Agrega el contenido HTML de la página actual al contenido final del PDF
        finalPageContent += eval('`' + html + '`');
        contador = 0;
        contentHtml.bodycap = '';
        // console.log(finalPageContent);
      }
      contador++;
    }

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
          <div class="texto-vertical-2">${datum.coderedmainsite}</div>
        </div>
        <div class="cards">
          <div class="content-qr">
            <div class="qr2">
              <img src=${datum.qr} style="height:100%; width: 100%;">
            </div>
          </div>
          <div class="text-qr">
            <strong>${datum.branch}</strong>
          </div>
          <div class="text-footer-qr">${datum.sitebranch}</div>
          <div class="text-footer-qr">${datum.codesite}</div>
        </div>
        <div class="texto-vertical-1 ">
          <div class="texto-vertical-2">${datum.coderedmainsite}</div>
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
                        <div class="text">${datum.branch}</div>
                        <div class="text">${datum.sitebranch}</div>
                        <div class="text">${datum.codesite}</div>
                    </div>
                </div>
                <div class="fotter-primary">${datum.coderedmainsite}</div>
            </div>
        </div> `;
  }

  async getTemplate(nameTemplate: string) {
    return fs.readFileSync(`./src/assets/templates/${nameTemplate}`, 'utf8');
  }

  async getDataEmpty() {
    return {
      branch: '',
      sitebranch: '',
      codesite: '',
      coderedmainsite: '',
      qr: '',
    };
  }
}
