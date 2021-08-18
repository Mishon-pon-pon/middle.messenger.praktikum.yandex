import { JSDOM } from "jsdom";
import { Router } from ".";
import { HYPO } from "../HYPO/HYPO";
import expect from "expect";

const { document, window } = new JSDOM(
  ` <html>
        <body>
            <div id="root"></div>
        </body>
    </html>`
).window;

afterEach(() => {
  const root = document.getElementById("root");
  root?.childNodes.forEach((node) => {
    node.remove();
  });
});

const textElement1 = "что-то 1";
const textElement2 = "что-то 2";
const templateName1 = "input.template.html";
const templateName2 = "elem2.template.html";
const root = document.getElementById("root");
const IDS = {
  One: "one",
  Two: "two",
};

//@ts-ignore
global.window = window;

const Component1 = () => {
  return new HYPO({
    renderTo: root as HTMLElement,
    templatePath: templateName1,
    data: {
      elemId1: IDS.One,
      content: textElement1,
    },
  });
};

const Component2 = () => {
  return new HYPO({
    renderTo: root as HTMLElement,
    templatePath: templateName2,
    data: {
      elemId1: IDS.Two,
      content: textElement2,
    },
  });
};

describe("ROUTER", () => {
  it("router start", () => {
    const router = new Router("#root")
      .use("/", Component1)
      .use("/test", Component2)
      .start();

    setTimeout(() => {
      expect(document.getElementById(IDS.One)?.textContent).toEqual(
        textElement1
      );
      router.go("/test");
    });

    setTimeout(() => {
      expect(document.getElementById(IDS.Two)?.textContent).toEqual(
        textElement2
      );
    }, 1000);
  });
});
