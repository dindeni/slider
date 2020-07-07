import Demo from './Demo';

const sliderSettings = [
  {
    min: 100, max: 500, progress: true, vertical: false, range: true, label: true,
  }, {
    min: 0, max: 100, progress: true, vertical: true, range: true, label: true,
  }, {
    min: 0, max: 500, progress: true, vertical: false, range: true, label: true, step: 100,
  }, {
    min: 0, max: 1000, progress: false, vertical: true, range: false, label: true, step: 250,
  },
];

const demoElements = document.querySelectorAll('.js-demo');
demoElements.forEach((demoElement, index) => {
  const demo = new Demo({ wrapper: demoElement, settings: sliderSettings[index] });
  demo.loadSliders();
});
