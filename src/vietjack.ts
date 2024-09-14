import { Page } from "puppeteer";

export async function printPdfVietjack(page: Page, i: number) {
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