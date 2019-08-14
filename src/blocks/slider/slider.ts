import {View} from "../view/view";

const view = new View();

interface sliderOptions {
    progress?: boolean,
    max?: number,
    min?: number,
    label?: boolean,
    step?: number,
    vertical?: boolean,
    range?: boolean
}

declare global {
    interface JQuery {
        slider(options?: sliderOptions): JQuery
    }
}

const initSlider = (element: JQuery, progress: boolean, min: number,
                    max: number, label: boolean,
                    step: number | undefined, vertical: boolean,
                    range: boolean) =>{

    view.createElements(element, range, vertical, min, max, step, progress);

};

(function ($){
    $.fn.slider =  function(options?: sliderOptions): JQuery {
        const optionsDefault= {
            progress: false,
            min: 0,
            max: 100,
            label: true,
            step: undefined,
            vertical: false,
            range: false
        };

        const config = $.extend({}, optionsDefault, options);

        initSlider(this, config.progress, config.min, config.max, config.label,
            config.step, config.vertical, config.range);

        return this;
    };

}(jQuery));