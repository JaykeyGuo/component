const css = require('css');

module.exports = function(source, map) {
  let stylesheet = css.parse(source);
  let name = this.resourcePath.match(/([^/]+).css$/)[1];
  for (let rule of stylesheet.stylesheet.rules) {
    rule.selectors = rule.selectors.map(selecotor => {
      return selecotor.match(new RegExp(`^.${name}`)) ? selecotor :
      `.${name} ${selecotor}`
    });
  }
  return `
  let style = document.createElement('style');
  style.innerHTML = ${JSON.stringify(css.stringify(stylesheet))};
  document.documentElement.appendChild(style);
  `;
}