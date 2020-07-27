export class TimeLine {
  constructor() {
    this.animations = new Set;
    this.finishedAnimations = new Set; // TODO:
    this.addTime = new Map;
    // this.pauseTime = null;
    this.rafId = null;
    this.state = 'inited'
    // TODO: Tthis.acitveAnimation
    // this.startTime = null;
    this.tick = () => {
      // let animations = this.animations.filter(animation => !animation.finished);
      let t = Date.now() - this.startTime; // FIXME: 放在方法中的时候存在 this 丢失的问题

      for (let animation of this.animations) {
        let { object, property, template, start, end, duration, delay, timingFunction } = animation;

        let startTime = this.addTime.get(animation);

        if (t < delay + startTime) {
          continue;
        }

        let progression = timingFunction((t - delay - startTime) / duration);

        if (t > duration + delay + startTime) {
          progression = 1;
          // animation.finished = true;
          this.animations.delete(animation);
        }

        let value = animation.valueFromPreogression(progression);

        object[property] = template(value);

        // object[property] = template(timingFunction(start, end)(t - delay));
      }
      if (this.animations.size) {
        this.rafId = requestAnimationFrame(() => this.tick())
      } else {
        this.rafId = null;
      }
    }
  }


  start() {
    if (this.state !== 'inited') {
      return;
    }
    this.state = 'playing'
    this.startTime = Date.now();
    this.tick();
  }

  pause() {
    if (this.state !== 'playing') {
      return;
    }
    this.state = 'paused'
    this.pauseTime = Date.now();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resume() {
    if (this.state !== 'paused') {
      return;
    }
    this.state = 'playing'
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

  reset() {
    if (this.state === 'playing') {
      this.pause();
    }
    this.animations = new Set;
    this.addTime = new Map;
    this.rafId = null;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.state = 'inited'
  }

  restart() {
    if (this.state === 'playing') {
      this.pause();
    }
    for (let anmation of this.finishedAnimations) {
      this.animations.add(anmation);
    }
    this.finishedAnimations = new Set;
    this.rafId = null;
    this.state = 'playing';
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }

  add(animation, startTime) {
    this.animations.add(animation);
    this.finishedAnimations.add(animation);
    // animation.finished = false;
    if (this.state === 'playing' && this.rafId === null) {
      this.tick();
    }
    if (this.state === 'playing') {
      this.addTime.set(animation, startTime !== void 0 ? startTime : Date.now() - this.startTime);
    } else {
      this.addTime.set(animation, startTime !== void 0 ? startTime : 0);
    }
  }
}

export class Animation {
  constructor(object, property, start, end, duration, delay, timingFunction, template) {
    this.object = object;
    this.property = property;
    this.template = template;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    // this.timingFunction = timingFunction || ((start, end) => {
    //   return (t) => start + (t / duration) * (end - start);
    // })
    this.timingFunction = timingFunction;
  }

  valueFromPreogression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}

export class ColorAnimation {
  constructor(object, property, template, start, end, duration, delay, timingFunction) {
    this.object = object;
    this.property = property;
    this.template = template || ((v) => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`);
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    // this.timingFunction = timingFunction || ((start, end) => {
    //   return (t) => start + (t / duration) * (end - start);
    // })
    this.timingFunction = timingFunction;
  }

  valueFromPreogression(progression) {
    return {
      r: this.r + progression * (this.end.r - this.start.r),
      g: this.g + progression * (this.end.g - this.start.g),
      b: this.b + progression * (this.end.b - this.start.b),
      a: this.a + progression * (this.end.a - this.start.a),
    }
  }
}

/*

let animation = new Animation(object, property, start, end, duration, delay, timingFunction);
let  = new Animation(object2, property2, start, end, duration, delay, timingFunction);

let timeline = new TimeLine;

timeline.add(animation);
timeline.add(animation2);

timeline.start();
timeline.pause();
timeline.resume();
timeline.stop();

setTimeout
setInterval
requestAnimationFrame

 */