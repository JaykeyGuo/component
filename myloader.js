const parser = require('./parse');

module.exports = function(source, map) {
  let tree = (parser.parseHTML(source));
  // console.log(tree.children[2].children[0].content);


  let template = null;
  let script = null;

  for (let node of tree.children) {
    if (node.tagName === 'template') {
      template = node;
    }
    if (node.tagName === 'script') {
      script = node.children[0].content;
    }
  }

  let createCode = '';

  // console.log(template);
  // console.log(script);

  let visit = (node) => {
    console.log(node, '!!!!! node !!!!!!');
    console.log(node.attributes);

    if (node.type === 'text') {
      return JSON.stringify(node.content);
    }

    let attrs = {};
    for (let attribute of node.attributes) {
      attrs[attribute.name] = attribute.value;
    }

    let children = node.children.map(nd => visit(nd))
    return `create('${node.tagName}', ${JSON.stringify(attrs)}, ${children})`
  }

  // visit(template);


  let r = `
import { create, Text, Wrapper } from './createElement.js';
export class Carousel {
  render() {
    return ${visit(template)}
  }
  setAttribute(name, value) {
    this[name] = value;
  }
  mountTo(parent) {
    this.render().mountTo(parent);
  }
}
  `;

  console.log(r);
  return r
}