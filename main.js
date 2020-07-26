import { create, Text, Wrapper } from './createElement.js';

// import { Carousel } from './carousel.vue';

import { TimeLine, Animation } from './animation';
import { ease, line } from './cubicBezier';

class Carousel {
  constructor(config) {
    this.children = [];
    this.attributes = new Map();
    this.properties = new Map();
  }
  render() {
    let children = this.data.map(url => {
      let element = <img src={url} />
      console.log(element)
      element.addEventListener('dragstart', event => event.preventDefault());
      return element;
    });

    let root = <div class='carousel'>
      { children }
    </div>;

    let position = 0;

    let timeline = new TimeLine();


    let nextPic = () => {
      let nextPostion = (position + 1) % this.data.length;
      let current = children[position];
      let next = children[nextPostion];

      let currentAnimation = new Animation(current.style,
        'transition',
        - 100 * position,
        - 100 - 100 * position,
        500, 0 , ease,
        v => `translateX(${v}%)`);
      let nextAnimation = new Animation(current.style,
        'transition',
        100 - 100 * nextPostion,
        -100 * nextPostion,
        500, 0 , ease,
        v => `translateX(${v}%)`);

      timeline.add(currentAnimation);
      timeline.add(nextAnimation);
      // current.style.transition = 'ease 0s';
      // next.style.transition = 'ease 0s';

      // current.style.transform = `translateX(${- 100 * position}%)`;
      // next.style.transform = `translateX(${100 - 100 * nextPostion}%)`;

      setTimeout(() => {
        // current.style.transition = ''; // = '' means use css rule to move
        // next.style.transition = '';

        // current.style.transform = `translateX(${- 100 - 100 * position}%)`;
        // next.style.transform = `translateX(${-100 * nextPostion}%)`;

        position = nextPostion;

      }, 16);

      setTimeout(nextPic, 2000);

      // 使用RAF实现
      // requestAnimationFrame(() => {
      //   requestAnimationFrame(() => {
      //     current.style.transition = 'ease 0.5s';
      //     next.style.transition = 'ease 0.5s';

      //     current.style.transform = `translateX(${- 100 - 100 * position}%)`;
      //     next.style.transform = `translateX(${-100 * nextPostion}%)`;

      //     position = nextPostion;
      //   });
      // })

    }
    setTimeout(nextPic, 3000);

    root.addEventListener('mousedown', (event) => {
      let startX = event.clientX, startY = event.clintY;

      let lastPostion = (position - 1 + this.data.length) % this.data.length;
      let nextPostion = (position + 1) % this.data.length;

      let current = children[position];
      let last = children[lastPostion];
      let next = children[nextPostion];

      current.style.transition = 'ease 0s';
      last.style.transition = 'ease 0s';
      next.style.transition = 'ease 0s';

      current.style.transform = `translateX(${-500 * position}px)`;
      last.style.transform = `translateX(${-500 - 500 * lastPostion}px)`;
      next.style.transform = `translateX(${500 - 500 * nextPostion}px)`;

      let move = (event) => {
        current.style.transform = `translateX(${event.clientX - startX - 500 * position}px)`;
        last.style.transform = `translateX(${event.clientX - startX - 500 - 500 * lastPostion}px)`;
        next.style.transform = `translateX(${event.clientX - startX + 500 - 500 * nextPostion}px)`;
      }

      let up = (event) => {
        let offset = 0;

        if (event.clientX - startX > 250) {
          offset = 1;
        } else if (event.clientX - startX < -250) {
          offset = -1;
        }

        current.style.transition = '';
        last.style.transition = '';
        next.style.transition = '';

        current.style.transform = `translateX(${offset * 500 -500 * position}px)`;
        last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPostion}px)`;
        next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPostion}px)`;

        position = (position + offset + this.data.length) % this.data.length;

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      }
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);

    })
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

console.log(Carousel)

let component = <Carousel data={[
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]}>
</Carousel>;

component.mountTo(document.body);
