import dotenv from "dotenv";
import puppeteer from 'puppeteer-extra';
// import StealthPlugin from 'puppeteer-extra-plugin-stealth';
// import * as cheerio from 'cheerio';
import { PDFDocument } from "pdf-lib";
import * as fs from "fs";
import * as path from 'path';
import { Page } from "puppeteer";


const listPage = [
  "https://vietjack.com/toan-5-cd/bai-5-on-tap-va-bo-sung-va-cac-phep-tinh-voi-phan-so.jsp",
  "https://vietjack.com/toan-5-cd/bai-6-gioi-thieu-ve-ti-so.jsp",
  "https://vietjack.com/toan-5-cd/bai-7-tim-hai-so-khi-biet-tong-va-ti-so-cua-hai-so-do.jsp"
];



dotenv.config();

async function main() {
  // puppeteer.use(StealthPlugin());

  const extensionPath = path.resolve('./1.58.0_0');

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1912, height: 1004 });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );
  // page.setDefaultNavigationTimeout(60000);

  // Set cookies
  // await page.setCookie(...cookies);

  for (let i = 0; i < listPage.length; i++) {
    await page.goto(listPage[i], { timeout: 0 });
    await printPdf(page, i);
  }

  await browser.close();

  // Đường dẫn đến các tệp PDF cần gộp
  // const pdfPathsToMerge = ["output53.pdf", "output54.pdf"];
  const pdfPathsToMerge = createIncreasingArray(listPage.length).map((e) => {
    return path.resolve("./output/" + "output" + e + ".pdf");
  });

  // Đường dẫn đến tệp PDF sau khi gộp
  const outputPath = path.resolve('./output/output.pdf');

  // Gọi hàm mergePDFs với các đường dẫn và đầu ra
  mergePDFs(pdfPathsToMerge, outputPath);
}

async function printPdf(page: Page, i: number) {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.evaluate(() => {
    let linkElement = document.querySelectorAll("a");
    if (linkElement) {
      linkElement.forEach((anchor) => {
        const bElement = anchor.querySelector('b');
        
        if (bElement && bElement.style.color === 'blue') {
          anchor.parentNode?.removeChild(anchor);
        }
      });
    }
  })

  await page.evaluate(() => {
    let footer = document.querySelector("#footer_id");
    if (footer) {
      footer.parentNode?.removeChild(footer);
    }
  });

  await page.evaluate(() => {
    let sidebar = document.querySelector(".sidebar")?.parentNode;
    if (sidebar) {
      sidebar.parentNode?.removeChild(sidebar);
    }
  });

  await page.evaluate(() => {
    let rightBar = document.querySelector("#rightbar")?.parentNode;
    if (rightBar) {
      rightBar.parentNode?.removeChild(rightBar);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector(".top-header");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let fixHeader = document.querySelector(".fix-header");
    if (fixHeader) {
      fixHeader.parentNode?.removeChild(fixHeader);
    }
  });

  await page.evaluate(() => {
    let content = document.querySelector(".content")?.firstElementChild;
    if (content) {
      content.removeAttribute("class");
      content.removeAttribute("style");

      const childNodesArray = Array.from(content.childNodes);

      // clear advertise
      childNodesArray.forEach((childNode: any) => {
        if (
          childNode.nodeType === 1 &&
          (childNode.classList.contains("ads_txt") ||
            childNode.classList.contains("ads_ads"))
        ) {
          childNode.remove();
        }
      });
    }
  });

  await page.evaluate(() => {
    let content = document.querySelector(".content")?.firstElementChild;
    if (content) {
      let check = false;
      const childNodesArray = Array.from(content.childNodes);

      childNodesArray.forEach((childNode: any) => {
        if (
          !(childNode.nodeType === 1 && childNode.classList.contains("sub-title"))
        ) {
          if (check == true) {
          } else {
            content.removeChild(childNode);
          }
        } else {
          console.log("found");
          console.log(childNode);
          check = true;
        }
      });
    }
  });

  await page.evaluate(() => {
    let content = document.querySelector(".content")?.firstElementChild;
    if (content) {
      let found = false;
      const childNodesArray = Array.from(content.childNodes);

      childNodesArray.forEach((childNode: any) => {
        if (!(childNode.nodeType === 1 && childNode.classList.contains("list"))) {
          if (found == true) {
            content.removeChild(childNode);
          } else {
          }
        } else {
          found = true;
          console.log("found");
          console.log(childNode);
          content.removeChild(childNode);
        }
      });
    }
  });

  await page.evaluate(() => {
    let ads = document.querySelector(".sp-widescreen-google-ads");
    if (ads) {
      ads.parentNode?.removeChild(ads);
    }
  });

  await page.emulateMediaType("print");

  await page.pdf({
    path: "./output/output" + i + ".pdf",
    format: "Letter",
    margin: {
      top: 20,
      bottom: 20,
      left: 70,
      right: 70,
    },
    scale: 0.8,
    displayHeaderFooter: false,
  });
}

async function mergePDFs(pdfPaths: Array<string>, outputPath: string) {
  // Tạo một tài liệu PDF mới
  const mergedPdf = await PDFDocument.create();

  for (const pdfPath of pdfPaths) {
    // Đọc tệp PDF từ đường dẫn
    const pdfBytes = fs.readFileSync(pdfPath);

    // Thêm trang từ tệp PDF vào tài liệu mới
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices()
    );
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  // Tạo một tệp PDF mới từ tài liệu đã gộp
  const mergedPdfBytes = await mergedPdf.save();

  // Ghi tệp PDF đã gộp ra đĩa
  fs.writeFileSync(outputPath, mergedPdfBytes);

  console.log("Merge successful! The merged PDF has been created.");
}

function createIncreasingArray(n: number) : Array<number> {
  if (n <= 0) {
    return [];
  }

  const result: Array<number> = [];

  for (let i = 0; i < n; i++) {
    result.push(i);
  }

  return result;
}


main();
