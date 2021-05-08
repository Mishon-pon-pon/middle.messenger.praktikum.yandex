export class HYPOnew {
  private children?: Record<string, HYPOnew>;
  template: string;
  HypoArr: Promise<Record<string, string>>[] = [];
  constructor(template: string, children?: Record<string, HYPOnew>) {
    this.children = children;
    this.template = template;
  }

  recursive(h: HYPOnew, name: string): HYPOnew {
    if (h.children) {
      Object.keys(h.children).forEach((childName) => {
        if (h.children) {
          return this.recursive(h.children[childName], childName);
        }
      });
    }
    this.HypoArr.push(this.getTemplateHTML(name, h));

    return h;
  }

  private getTemplateHTML(
    key: string,
    hypo: HYPOnew
  ): Promise<Record<string, string>> {
    return new Promise<Record<string, string>>((resolve, reject) => {
      setTimeout(() => {
        const result: Record<string, string> = {
          html: hypo.template,
          name: key,
        };
        resolve(result);
      }, Math.random());
    });
  }
}

const H = new HYPOnew("<div>1</div><div>2</div>", {
  "1": new HYPOnew("<div>1.1</div><div>1.2</div>", {
    "1.1": new HYPOnew("<div>1.1.1</div>", {
      "1.1.1": new HYPOnew("<div>last</div>"),
    }),
    "1.2": new HYPOnew("<div>last</div>"),
  }),
  "2": new HYPOnew("<div>2.1</div><div>2.2</div>", {
    "2.1": new HYPOnew("<div>last</div>"),
    "2.2": new HYPOnew("<div>2.2.1</div>", {
      "2.2.1": new HYPOnew("<div>last</div>"),
    }),
  }),
});

Promise.all(H.recursive(H, "root").HypoArr).then((values) => {
  let resultHTML: string = values[values.length - 1].html;
  for (let i = values.length - 1; i >= 0; i--) {
    resultHTML = resultHTML.replace(values[i].name, values[i].html);
  }

  console.log(resultHTML);
});

const obj = {
  id: 1,
  user: {
    name: "Ivan",
    surname: "Ivanov",
  },
};

let path: string[] = [];
let o: any = {};

function fn(obj: any, name: string = "") {
  for (let key in obj) {
    path.push(key);
    if (typeof obj[key] === "object") {
      fn(obj[key], key);
    } else {
      o[path.join(".")] = obj[key];
      path.pop();
    }
  }
}

fn(obj);
console.log(path);
console.log(o);
