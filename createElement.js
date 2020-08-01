import { enableGesture } from './gusture';

export function create(Cls, attirbutes, ...children) {
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

  let visit = (children) => {
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
    this.children = [];
    this.root = document.createTextNode(text);
  }
  getAttribute(name) {
    return;
  }
  appendChild(child) {
    this.children.push(child);
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Wrapper {
  constructor(type) {
    this.children = [];
    this.root = document.createElement(type);
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);

    if (name.match(/^on([\s\S]+)$/)) {
      let eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLocaleLowerCase());
      this.addEventListener(eventName, value);
    }

    if (name === 'enableGesture') {
      enableGesture(this.root);
    }
  }

  getAttribute(name) {
    return this.root.getAttribute(name);
  }

  appendChild(child) {
    this.children.push(child);
  }

  addEventListener() {
    this.root.addEventListener(...arguments);
  }

  get style() {
    return this.root.style;
  }

  get classList() {
    return this.root.classList;
  }

  set innerText(text) {
    return this.root.innerText = text;
  }

  mountTo(parent) {
    parent.appendChild(this.root);

    for (let child of this.children) {
      child.mountTo(this.root);
    }
  }
}