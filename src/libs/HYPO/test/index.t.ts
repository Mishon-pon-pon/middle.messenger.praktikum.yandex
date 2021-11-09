import { HYPO } from "../HYPO";
import { JSDOM } from "jsdom";
import expect from "expect";

const { document, window } = new JSDOM(
  '<html><body><div id="root"></div></body></html>'
).window;

const root = document.getElementById("root");
const textElement1 = "что-то 1";
const textElement2 = "что-то 2";
const templateName1 = "input.template.html";
const templateName2 = "elem2.template.html";

describe("HYPO", () => {
  const IDS = {
    One: "one",
    Two: "two",
  };

  it("test render hypo", () => {
    if (root) {
      new HYPO({
        renderTo: root,
        templatePath: templateName1,
        data: {
          elemId1: IDS.One,
          content: textElement1,
        },
      })
        .render()
        .then(() => {
          expect(document.getElementById(IDS.One)?.textContent).toEqual(
            textElement1
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  it("test child hypo render", () => {
    if (root) {
      new HYPO({
        renderTo: root,
        templatePath: templateName1,
        data: {
          elemId1: IDS.One,
          content: textElement1,
        },
        children: {
          child: new HYPO({
            templatePath: templateName2,
            data: {
              elemId2: IDS.Two,
            },
          }),
        },
      })
        .render()
        .then(() => {
          expect(document.getElementById(IDS.One)?.textContent).toEqual(
            textElement1
          );
          expect(document.getElementById(IDS.Two)?.textContent).toEqual(
            textElement2
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  it("test handler hypo", () => {
    const verificationPhrase = "verification phrase";
    if (root) {
      new HYPO({
        renderTo: root,
        templatePath: templateName1,
        data: {
          elemId1: IDS.One,
          content: textElement1,
        },
        children: {
          child: new HYPO({
            templatePath: templateName2,
            data: {
              elemId2: IDS.Two,
            },
          }),
        },
      })
        .afterRender(() => {
          document.getElementById(IDS.Two)?.addEventListener("click", () => {
            const el = document.getElementById(IDS.One);
            if (el) el.textContent = verificationPhrase;
          });
        })
        .render()
        .then(() => {
          const el1 = document.getElementById(IDS.One);
          document.getElementById(IDS.Two)?.click();
          expect(el1?.textContent).toEqual(verificationPhrase);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  it("test hypo state", () => {
    if (root) {
      const newElemId = "newElemId";
      const component = new HYPO({
        renderTo: root,
        templatePath: templateName1,
        data: {
          elemId1: IDS.One,
          content: textElement1,
        },
        children: {
          child: new HYPO({
            templatePath: templateName2,
            data: {
              elemId2: IDS.Two,
            },
          }),
        },
      });

      component.afterRender(() => {
        setTimeout(() =>
          expect(document.getElementById(newElemId)?.textContent).toEqual(
            textElement1
          )
        );
      });

      component
        .render()
        .then(() => {
          const state = component.getState();
          state.elemId1 = newElemId;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
});

function MockFile(html: string) {
  var blob = new window.Blob([""], { type: "plain/txt" });
  blob.text = () => Promise.resolve(html);
  return blob;
}

global.fetch = (url: RequestInfo, init?: RequestInit) => {
  if (url === `./templates/${templateName1}`)
    return Promise.resolve({
      status: 200,
      blob: () =>
        Promise.resolve(
          MockFile(
            `<div>
              <div id={{elemId1}}>{{content}}</div>
              <div>-=child=-</div>
            </div>`
          )
        ),
    } as Response);

  if (url === `./templates/${templateName2}`) {
    return Promise.resolve({
      status: 200,
      blob: () =>
        Promise.resolve(MockFile(`<div id={{elemId2}}>${textElement2}</div>`)),
    } as Response);
  }

  return Promise.resolve({
    status: 500,
    blob: () => {
      Promise.resolve("");
    },
  } as Response);
};
