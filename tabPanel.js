import { create, Text, Wrapper } from './createElement.js';

import { TimeLine, Animation } from './animation';
import { ease } from './cubicBezier';
const liner = (t) => t;

export class TabPanel {
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
    console.log(this);
    console.log(name);
    return name;
    // retrun this[name];
  }

  mountTo(parent) {
    this.render().mountTo(parent);
  }

  select(i) {
    for (let view of this.childViews) {
      view.style.display = 'none';
    }
    this.childViews[i].style.display = '';

    for (let view of this.titleViews) {
      view.classList.remove('selected');
    }
    this.titleViews[i].classList.add('selected');
  }

  render() {

    this.childViews = this.children.map(child => <div style="width: 300px; min-height: 300px;">{ child }</div>);

    this.titleViews = this.children.map((child, i) => <span onClick={() => this.select(i)} style="background: lightgreen; 
    height: 30px width: 30px; margin: 0 5px;">{child.getAttribute('title') || ' '}</span>);

    setTimeout(() => this.select(0), 16);

    let root = <div class='tab-panel' style="min-height: 300px; width: 300px; margin: 0">
      <h1 style="width:300px; margin: 0px; font-size: 20px">{this.titleViews}</h1>
      <div style="border: 1px solid lightgreen; box-shadow:0px 2px 4px 0px rgba(0, 0, 0, 0.2);">
        { this.childViews }
      </div>
    </div>;
    return root;
  }

}