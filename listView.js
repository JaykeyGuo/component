import { create, Text, Wrapper } from './createElement.js';

import { TimeLine, Animation } from './animation';
import { ease } from './cubicBezier';
const liner = (t) => t;

export class ListView {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
    this.state = Object.create(null);
  }

  appendChild(child) {
    this.children.push(child);
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  getAttribute(name) {
    return this[name];
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }

  render() {
    let data = this.getAttribute('data');
    let root = <div class='list-view' style="width: 300px;">
      {
        data.map(this.children[0])
      }
    </div>;
    return root;
  }

}