import puppeteer from "puppeteer";
import { Readable } from "stream";

export default function handler(req, res) {
  const pageToConvert = Object.keys(req.query)[0];
  console.log("pageToConvert:", pageToConvert);

  generatePdf(pageToConvert).then((pdfBuffer) => {
    console.log("pdfBuffer:", pdfBuffer);
    res.setHeader("Content-Type", "application/pdf");
    // bufferToStream(pdfBuffer).pipe(res);
    res.send(pdfBuffer);
  });
  // res.setHeader("Content-Type", "application/pdf");
  // res.setHeader("Content-Length", pdfBuffer.length);
  // // res.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
  // console.log("headers:", res);
  // const stream = Readable.from(pdfBuffer.toString());
  // file.pipe(res);
  // res.send(stream);
  // stream.pipe(res);
  //   });
  //   generatePdf(pageToConvert).toBuffer(function (err, buffer) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log(buffer);
  //       //   var pdfBuffer = new Buffer(buffer)
  //       res.setHeader("Content-disposition", 'inline; filename="test.pdf"');
  //       res.setHeader("Content-type", "application/pdf");
  //       res.send(pdfBuffer);
  //     }
  //   });
}

async function generatePdf(pageToConvert) {
  try {
    // Set target website
    const url = pageToConvert;
    console.log("passedUrl:", pageToConvert);
    const dimensions = { width: 2550, height: 3300 };

    // Note: "headless" necessary for pdf generation
    const browser = await puppeteer.launch({
      headless: true,
      args: [`--window-size=${dimensions.width},${dimensions.height}`],
    });
    // Open a tab/page:
    const page = await browser.newPage();

    // Set viewport size
    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
    });

    // Alternative viewport dimension setting:
    const windowDimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio,
      };
    });
    console.log("windowDimensions:", windowDimensions);

    await page.goto(url, { waitUntil: "networkidle0" });

    // await page.setContent(html);
    await page.emulateMediaType("screen"); // Assuming pdfs are for digital use rather than print

    // const pdfBuffer = await page.pdf({
    //   width: dimensions.width,
    //   height: dimensions.height,
    // }); // Sign-post to pup2 internal api targeting
    // const fileName = `./${url}.pdf`;
    // path: `./your-page.pdf`,
    const pdfBuffer = await page.pdf({
      width: dimensions.width,
      height: dimensions.height,
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("Error:", error);
  }
}
