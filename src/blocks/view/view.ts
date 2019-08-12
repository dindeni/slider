import {ViewOptional} from "./viewOptional";
import {ViewDnD} from "./viewDnD";

class View {
    private divTrack: JQuery;
    private divThumb: JQuery;
    private divThumbMin: JQuery;
    private divThumbMax: JQuery;
    private labelOffsetLeft: number = 8;
    private labelOffsetTop: number = -30;

    viewOptional: ViewOptional;
    viewDnD: ViewDnD;

    createElements(element: JQuery, range: boolean,
                   vertical: boolean, min: number, max: number,
                   step: number | undefined, progress: boolean){

        let divWrapper: JQuery;
        step ? divWrapper = $('<div class="slider-wrapper step"></div>').
        appendTo(element) : divWrapper = $('<div class="slider-wrapper"></div>').
        appendTo(element);
        this.divTrack = $('<div class="slider-track"></div>').
        appendTo(divWrapper);

        this.viewOptional = new ViewOptional();

        this.createThumb(range, vertical, divWrapper);
        this.stylingElements(range, vertical, divWrapper);
        this.createLabel(min, vertical, range, max, divWrapper);
        progress ? this.viewOptional.createProgress(range, divWrapper) : null;

        step ? this.viewOptional.createScale(vertical, min, max, step,
            this.divTrack.width() || 0, this.divTrack.height() || 0,
            divWrapper) : null;

        this.viewDnD = new ViewDnD();
        this.viewDnD.addDnD(step, vertical, range, progress, min, max,
            divWrapper);
    }

    createThumb(range: boolean, vertical, wrapper){
        if (!range){
            vertical ? this.divThumb = $('<div class="slider-thumb vertical"' +
                ' draggable="true"></div>').
            appendTo(wrapper) :  this.divThumb = $('<div class="slider-thumb"' +
                ' draggable="true"></div>').
            appendTo(wrapper);
        }else {
            vertical ? this.divThumbMin = $('<div class="slider-thumb vertical" id="thumb-min" draggable="true">' +
                '</div>').appendTo(wrapper) :
                this.divThumbMin = $('<div class="slider-thumb" id="thumb-min" draggable="true">' +
                '</div>').appendTo(wrapper);
            vertical ? this.divThumbMax = $('<div class="slider-thumb vertical" id="thumb-max" draggable="true">' +
                '</div>').appendTo(wrapper) :
                this.divThumbMax = $('<div class="slider-thumb" id="thumb-max" draggable="true">' +
                    '</div>').appendTo(wrapper);
        }
    }
    stylingElements(range: boolean, vertical: boolean, wrapper: JQuery){
        if (!range && !vertical){
            this.divThumb.css({
                left: 0
            });
        }else if (range && !vertical) {
            this.divThumbMin.css({
                left: 0
            });
            this.divThumbMax.css({
                left: this.divTrack.width() +'px'
            });
        }

        vertical ? this.viewOptional.makeVertical(range, wrapper) : null;

    }
    createLabel(initValue: number, vertical: boolean, range: boolean,
                max: number, wrapper){

        if (!range){
            const divLabel = $('<div class="slider-label"></div>').
            appendTo(wrapper);
            divLabel.text(initValue);
            vertical ? divLabel.css({
                top: this.labelOffsetTop +'px',
                left: this.labelOffsetTop / 2 + 'px'
            }) : null;
        }else {
            const divLabelMin = $('<div class="slider-label"' +
                ' id="label-min"></div>').appendTo(wrapper);
            vertical ? divLabelMin.css({
                left: this.labelOffsetTop / 2 + 'px',
                top: this.labelOffsetTop + 'px'
            }) : null;
            divLabelMin.text(initValue);

            const divLabelMax = $('<div class="slider-label"' +
                ' id="label-max"></div>').appendTo(wrapper);
            !vertical ? divLabelMax.css({
                left: (this.divTrack.width() || 0) - this.labelOffsetLeft +'px'
            }) : divLabelMax.css({
                top: (this.divTrack.height() || 0) + this.labelOffsetTop +'px',
                left: this.labelOffsetTop / 2 + 'px'
            });
            divLabelMax.text(max);

        }
    }

    updateLabelValue(value: number, coord: number, vertical: boolean,
                     divThumb: HTMLElement | JQuery){

        const thumb = $(divThumb);

        if (thumb.is('#thumb-min') ||
            thumb.is('#thumb-max')){

            if (thumb.is('#thumb-min')){
                const labelMin: JQuery = $(divThumb).siblings('#label-min');
                labelMin.text(value);
                !vertical ? labelMin.css({left: coord - this.labelOffsetLeft}) :
                    labelMin.css({top: coord + this.labelOffsetTop})
            }else {
                const labelMax: JQuery = $(divThumb).siblings('#label-max');
                labelMax.text(value);
                !vertical ? labelMax.css({left: coord - this.labelOffsetLeft}) :
                    labelMax.css({top: coord + this.labelOffsetTop});
            }
        }else {
            const label = $(divThumb).next();
            label.text(value);

            !vertical ? label.css({left: coord - this.labelOffsetLeft}) :
                label.css({top: coord + this.labelOffsetTop})
        }

    };

}

export {View}

