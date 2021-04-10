import Demo from './Demo';

const sliderSettings = [
  {}, {
    min: 0, max: 100, withProgress: true, isVertical: true, isRange: true, withLabel: true,
  }, {
    min: 0,
    max: 500,
    withProgress: true,
    isVertical: false,
    isRange: true,
    withLabel: true,
    step: 100,
    withScale: true,
  }, {
    min: 0,
    max: 1000,
    withProgress: false,
    isVertical: true,
    isRange: false,
    withLabel: true,
    step: 250,
  },
];

const demoElements = document.querySelectorAll('.js-demo');
demoElements.forEach((demoElement: HTMLElement, index: number) => {
  const demo = new Demo({ wrapper: demoElement, settings: sliderSettings[index] });
  demo.loadSliders();
});
