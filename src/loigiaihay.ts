import { Page } from "puppeteer";

export async function printPdfLoigiaihay(page: Page, i: number) {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await page.evaluate(() => {
    let footer = document.querySelector("#wrapper > div.footer-container");
    if (footer) {
      footer.parentNode?.removeChild(footer);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#wrapper > div.header-container");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#countdown");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#top_banner");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  // left menu
  await page.evaluate(() => {
    let header = document.querySelector("#event_tree_container");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  // right menu
  await page.evaluate(() => {
    let header = document.querySelector("#container > div > div > div > div.right.last");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#wrapper > a");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#top_banner");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#container > div > div > div.box_center.clearfix > div.left.left-3col > div.top-title");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#container > div > div > div.box_center.clearfix > div.left.left-3col > div > div.box > div:nth-child(3)");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#top_facebook_comment");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#s-scroll");
    if (header) {
      header.parentNode?.removeChild(header);
    }
  });

  await page.evaluate(() => {
    let content = document.querySelector("#box-content");
    if (content) {
      // back to parent of content and remove all element without content
      let parent = content.parentNode;
      if (parent) {
        const childNodesArray = Array.from(parent.childNodes);
        childNodesArray.forEach((childNode) => {
          if (childNode !== content) {
            parent.removeChild(childNode);
          }
        });
        let parentOfParent = parent.parentNode;
        if (parentOfParent) {
          const childNodesArrayOfParentOfParent = Array.from(parentOfParent.childNodes);
          childNodesArrayOfParentOfParent.forEach((childNodeOfParentOfParent) => {
            if (childNodeOfParentOfParent !== parent as Element) {
              parentOfParent.removeChild(childNodeOfParentOfParent);
            }
          });
        }
      }
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#container > div > div > div > div.left.left-3col");
    if (header) {
      // remove css of this element
      header.removeAttribute("class");
      header.removeAttribute("style");
      // Force reflow by accessing offsetHeight
      (header as HTMLElement).offsetHeight;
    }
  });

  await page.evaluate(() => {
    let header = document.querySelector("#container > div > div > div");
    if (header) {
      // remove css of this element
      header.removeAttribute("class");
      header.removeAttribute("style");
      (header as HTMLElement).offsetHeight;
    }
  });

  await page.evaluate(() => {
    document.body.offsetHeight; // Kích hoạt reflow
  });

  await page.waitForFunction(() => {
    return document.readyState === 'complete';
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
