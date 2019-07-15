
class View {
    private divTrack: JQuery;
    private divThumb: JQuery;
    private divWrapper: JQuery;
    private divThumbMin: JQuery;
    private divThumbMax: JQuery;
    private labelOffsetLeft: number = 8;
    private labelOffsetTop: number = -30;

    createElements(element: JQuery, range: boolean, initValue: number,
                   vertical: boolean, max: number){
        this.divWrapper = $('<div class="slider-wrapper"></div>').
        appendTo(element);
        this.divTrack = $('<div class="slider-track"></div>').
        appendTo(this.divWrapper);

        this.createThumb(range);
        this.stylingElements(range);
        this.createLabel(initValue, vertical, range, max);
        this.createProgress(range);
    }
    createThumb(range: boolean){
        if (!range){
            this.divThumb = $('<div class="slider-thumb" draggable="true"></div>').
            appendTo(this.divWrapper);
        }else {
            this.divThumbMin = $('<div class="slider-thumb" id="thumb-min" draggable="true">' +
                '</div>').appendTo(this.divWrapper);
            this.divThumbMax = $('<div class="slider-thumb" id="thumb-max" draggable="true">' +
                '</div>').appendTo(this.divWrapper);
        }
    }
    stylingElements(range: boolean){
        if (!range){
            this.divThumb.css({
                left: 0
            });
        }else {
            this.divThumbMin.css({
                left: 0
            });
            this.divThumbMax.css({
                left: this.divTrack.width() +'px'
            });
        }

    }
    createLabel(initValue: number, vertical: boolean, range: boolean, max: number){

        if (!range){
            const divLabel = $('<div class="slider-label"></div>').appendTo(this.divWrapper);
            divLabel.text(initValue);
            vertical ? divLabel.css({
                top: this.labelOffsetTop +'px',
                left: this.labelOffsetTop / 2 + 'px'
            }) : null;
        }else {
            const divLabelMin = $('<div class="slider-label"' +
                ' id="label-min"></div>').appendTo(this.divWrapper);
            vertical ? divLabelMin.css({
                left: this.labelOffsetTop / 2 + 'px',
                top: this.labelOffsetTop + 'px'
            }) : null;
            divLabelMin.text(initValue);

            const divLabelMax = $('<div class="slider-label"' +
                ' id="label-max"></div>').appendTo(this.divWrapper);
            !vertical ? divLabelMax.css({
                left: (this.divTrack.width() || 0) - this.labelOffsetLeft +'px'
            }) : divLabelMax.css({
                top: (this.divTrack.height() || 0) + this.labelOffsetTop +'px',
                left: this.labelOffsetTop / 2 + 'px'
            });
            divLabelMax.text(max);

        }/*else {
            this.divLabelMin = $('<div class="slider-label" id="label-min">' +
                '</div>').appendTo(this.divWrapper);
            this.divLabelMax = $('<div class="slider-label" id="label-max">' +
                '</div>').appendTo(this.divWrapper);

            !this.divTrack ? this.divTrack = $('.slider-track') : null;

            !vertical ? this.divLabelMax.css({
                left: (this.divTrack.width() || 0) - this.labelOffsetLeft +'px'
            }) : this.divLabelMax.css({
                top: (this.divTrack.height() || 0) + this.labelOffsetTop +'px',
                left: this.labelOffsetTop / 2 + 'px'
            });
            vertical ? this.divLabelMin.css({
                left: this.labelOffsetTop / 2 + 'px',
                top: this.labelOffsetTop + 'px'
            }) : null;
            this.divLabelMin.text(initValue);
            this.divLabelMax.text(max);
        }*/

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

    createProgress(range: boolean){
        if (!range){
            $('<div class="slider-progress"></div>').appendTo(this.divTrack);
        }else {
            $('<div class="slider-progress" id="progress-min"></div>').appendTo(this.divTrack);
            $('<div class="slider-progress" id="progress-max"></div>').appendTo(this.divTrack);
        }

    }

    stylingProgress(divProgressWidth: number, vertical: boolean,
                    divThumb: HTMLElement){

        /*switch (type || vertical) {
            case "default" && !vertical:
                divProgress.style.width = divProgressWidth + 'px';
                   /!* divProgress.css({
                    height: divProgressWidth + 'px',
                    width: '5px'
                })*!/
              console.log(divProgress);

                break;
          /!*  case "min":
                !this.divProgressMin ?
                    this.divProgressMin = $('#progress-min') : null;
                !vertical ? this.divProgressMin.css({
                    width: divProgressWidth + 'px'
                }) : this.divProgressMin.css({
                    height: divProgressWidth + 'px',
                    width: '5px'
                });
                break;
            case "max":
                !this.divProgressMax ?
                    this.divProgressMax = $('#progress-max') : null;
                !vertical ? this.divProgressMax.css({
                    width:  (this.divTrack.width() || 0) - divProgressWidth + 'px',
                    position: 'absolute',
                    right: '0px',
                    top: '0px'
                }) : this.divProgressMax.css({
                    height:  (this.divTrack.height() || 0) - divProgressWidth + 'px',
                    width: '5px',
                    position: 'absolute',
                    right: '0px',
                    bottom: '0px'
                })*!/
        }*/
        const thumb = $(divThumb);

        if (thumb.is('#thumb-min') ||
            thumb.is('#thumb-max')){

            if (thumb.is('#thumb-min')){
                const divProgressMin = (divThumb.previousElementSibling as HTMLElement).
                    children[0] as HTMLElement;
                !vertical ? divProgressMin.style.width = divProgressWidth + 'px' :
                    null;
            }else {
                const divProgressMax = thumb.siblings('.slider-track').children(
                    '#progress-max'
                );
                const divTrack = thumb.siblings('.slider-track');
                !vertical ? divProgressMax.css({
                        width: (divTrack.width() || 0) - divProgressWidth + 'px',
                        position: 'absolute',
                        right: '0px',
                        top: '0px'
                }) :
                    null;

            }
        }else {
            const divProgress = (divThumb.previousElementSibling as HTMLElement).
                children[0] as HTMLElement;
            !vertical ? divProgress.style.width = divProgressWidth + 'px' :
                null;
        }

    }

    /*async createSlider(element: JQuery, range: boolean){
        await this.createElements(element, range);
       /!* await this.createThumb(range);*!/
        /!*await this.stylingElements(range);*!/
    }*/
}

export {View}

