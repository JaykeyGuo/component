export function create(Cls, attirbutes, ...children) {
  // console.log(Cls, '---------')
  // console.log(attirbutes, '---------')
  let o;

  if (typeof Cls === 'string') {
    o = new Wrapper(Cls);
  } else  {
    o = new Cls({
      config: "99",
    });
  }

  for (let name in attirbutes) {
    o.setAttribute(name, attirbutes[name]);
  }

  // for (let child of children) {
  //   if (typeof child === 'string') {
  //     child = new Text(child);
  //   }
  //   o.appendChild(child);
  //   // o.children.push(child);
  // }

  // // console.log(children);

  let visit = (children) => {
    // console.log('----=-=-=-=-=-=');
    // console.log(children);
    for (const child of children) {
      if (typeof child === 'object' && child instanceof Array) {
        visit(child);
        continue;
      } else if (typeof child === 'string') {
        child = new Text(child);
      }

      if (!Array.isArray(child)) {
        o.appendChild(child);
      }
    }
  }

  visit(children);

  return o;
}

export class Text {
  constructor(text) {
    // console.log(config);
    this.children = [];
    this.root = document.createTextNode(text);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Wrapper {
  constructor(type) {
    // console.log(config);
    this.children = [];
    this.root = document.createElement(type);
  }
  // set id(val) {
  //   console.log("Parent::class", val);
  // }
  setAttribute(name, value) {
    // console.log(name, value);
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    // console.log("Parent::appendChild", child);
    this.children.push(child);
  }

  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  get style() {
    return this.root.style;
  }

  mountTo(parent) {
    parent.appendChild(this.root);

    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
}