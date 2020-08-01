import { create, Text, Wrapper } from './createElement.js';

// import { TimeLine, Animation } from './animation';

export class Panel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }
  render() {

    let root = <div class='panel' style="border: 1px solid lightgreen; width: 300px">
      <h1 style="background-color: lightgreen; width: 300px; margin: 0;">{this.title}</h1>
      <div style="border: 1px solid lightgreen; width: 300px; min-height: 300px;">
        { this.children }
      </div>
    </div>;
    return root;
  }

  appendChild(child) {
    this.children.push(child);
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }
}