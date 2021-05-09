import { getAllByTestId } from "@testing-library/dom";
import { HYPO } from "./HYPO";

let container: null | HTMLDivElement = null;

beforeEach(() => {
  container = document.createElement("div");
  container.id = "root";
  document.body.append(container);
});

afterEach(() => {
  if (container) {
    document.body.removeChild(container);
    container?.remove();
  }
  container = null;
});

function MockFile(html: string) {
  var blob = new Blob([""], { type: "plain/txt" });
  blob.text = () => Promise.resolve(html);
  return blob;
}

const template1 = "<div>" + "-=HUI=-" + "</div>`";

const template2 = '<div data-testid="{{testId}}>' + "{{surname}}" + "</div>";

global.fetch = jest.fn().mockImplementation((paht: string) => {
  let html: string;
  if (paht === "./templates/one") {
    html = template1;
  } else if (paht === "./templates/two") {
    html = template2;
  }
  return Promise.resolve({
    status: 200,
    blob: () => Promise.resolve(MockFile(html)),
  } as Response);
});

describe("Tests of HYPO", () => {
  it("First test", async () => {
    const h = await new HYPO({
      templatePath: "one",
      renderTo: document.getElementById("root") as HTMLElement,
      data: {
        name: "Ivan",
        testId: "one",
      },
      children: {
        HUI: new HYPO({
          templatePath: "two",
          data: {
            surname: "Ivanov",
            testId: "two",
          },
        }),
      },
    })
      .render()
      .then((hypo) => {
        expect(document.body).toMatchInlineSnapshot(`
          <body>
            <div
              id="root"
            >
              <div>
                <span
                  hypo="1585bf51-80d9-4d1c-982f-65005a366b89"
                />
              </div>
            </div>
          </body>
        `);
        const testid = getAllByTestId(document.body, "two");
        testid.forEach((item) => {
          expect(item.textContent).toBe("Hello");
        });
        return hypo;
      });

    const store = h.getState();
    store.test = "Mossss";

    await new Promise((resolve) => {
      setTimeout(() => {
        const testid = getAllByTestId(document.body, "one");
        testid.forEach((item) => {
          expect(item.textContent).toBe("Mossss");
        });
        resolve(0);
      }, 0);
    });
  });
});
