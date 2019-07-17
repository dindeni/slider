
class ViewOptional{
    private divProgress: JQuery;
    private divProgressMin: JQuery;
    private divProgressMax: JQuery;
    private divTrack: JQuery;
    divLabel: JQuery;
    divLabelMin: JQuery;
    divLabelMax: JQuery;
    private divWrapper: JQuery;
    private labelOffsetLeft: number = 8;
    private labelOffsetTop: number = -30;
    private divThumb: JQuery;

    /*createProgress(range: boolean){
        !this.divTrack ? this.divTrack = $('.slider-track') : null;

        if (!range){
            $('<div class="slider-progress"></div>').appendTo(this.divTrack);
            this.divProgress = $('.slider-progress');
        }else {
            $('<div class="slider-progress" id="progress-min"></div>').appendTo(this.divTrack);
            $('<div class="slider-progress" id="progress-max"></div>').appendTo(this.divTrack);
        }

    }*/
    /*stylingProgress(divProgressWidth: number, type: 'min' | 'max' |
    'default', vertical: boolean){
        !this.divTrack ? this.divTrack = $('.slider-track') : null;

        switch (type) {
            case "default":
                !this.divProgress ?
                    this.divProgress = $('.slider-progress') : null;
                !vertical ? this.divProgress.css({
                    width: divProgressWidth + 'px'
                }) : this.divProgress.css({
                    height: divProgressWidth + 'px',
                    width: '5px'
                });
                break;
                case "min":
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
                })
        }

    }*/

    /*createLabel(initValue: number, vertical: boolean, range: boolean, max: number){

        this.divWrapper = $('.slider-wrapper');

        if (!range){
            this.divLabel = $('<div class="slider-label"></div>').appendTo(this.divWrapper);
            this.divLabel.text(initValue);
            vertical ? this.divLabel.css({
                top: this.labelOffsetTop +'px',
                left: this.labelOffsetTop / 2 + 'px'
            }) : null;
        }else {
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
        }
    }*/

 /*   updateLabelValue(range: boolean, element: 'min' | 'max' | 'default', value: number, coord: number,
                     vertical: boolean){

            switch (element) {
                case 'min':
                    !this.divLabelMin ? this.divLabelMin =  $('#label-min') : null;
                    this.divLabelMin.text(value);
                    !vertical ? this.divLabelMin.css({
                            left: coord - this.labelOffsetLeft}) :
                        this.divLabelMin.css({
                        top: coord + this.labelOffsetTop
                    });
                    break;
                case 'max':
                    !this.divLabelMax ? this.divLabelMax =  $('#label-max') : null;
                    this.divLabelMax.text(value);
                    !vertical ? this.divLabelMax.css({
                        left: coord - this.labelOffsetLeft}) :
                        this.divLabelMax.css({
                            top: coord + this.labelOffsetTop
                        });
                    break;
                case 'default':
                    !this.divLabel ? this.divLabel = $('.slider-label') : null;
                    this.divLabel.text(value);
                    !vertical ? this.divLabel.css({left: coord - this.labelOffsetLeft}) :
                    this.divLabel.css({top: coord + this.labelOffsetTop})
            }

    }*/

    createScale(scaleValue: number[], scaleCoords: number[], vertical: boolean){
        const scaleTopPositionCorrection = 5;
        !this.divWrapper ? this.divWrapper = $('.slider-wrapper') : null;
        const ul = $('<ul class="slider-scale"></ul>').appendTo(this.divWrapper);
        console.log('yes')
        scaleValue.map((item, i)=>{

                const itemElement = $(`<li class="slider__scale-item">${item}</li>`).appendTo(ul);

            !vertical ? itemElement.css({left: scaleCoords[i]}) :
                itemElement.css({top: scaleCoords[i] -
                        scaleTopPositionCorrection})
        })
    }
    createProgress(range: boolean, wrapper: JQuery){
        const track = wrapper.find('.slider-track');
        if (!range){
            $('<div class="slider-progress"></div>').appendTo(track);
        }else {
            $('<div class="slider-progress" id="progress-min"></div>').appendTo(track);
            $('<div class="slider-progress" id="progress-max"></div>').appendTo(track);
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

        /*if (thumb.is('#thumb-min') ||
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
                divProgress.style.height = divProgressWidth + 'px';
        }*/
        const stylingProgress = {
            default: ()=>{
                const divProgress = (divThumb.previousElementSibling as HTMLElement).
                    children[0] as HTMLElement;

                if (vertical){
                    divProgress.style.height = divProgressWidth + 'px';
                    divProgress.style.width = '5px';
                }else {
                    divProgress.style.width = divProgressWidth + 'px';
                }
            },
            range: ()=>{
                if (vertical){
                    if (thumb.is('#thumb-min')){
                        const divProgressMin = (divThumb.previousElementSibling as HTMLElement).
                            children[0] as HTMLElement;
                        divProgressMin.style.height = divProgressWidth + 'px';
                        divProgressMin.style.width = '5px';
                    }else {
                        const divProgressMax = thumb.siblings('.slider-track').children(
                            '#progress-max'
                        );
                        const divTrack = thumb.siblings('.slider-track');
                        divProgressMax.css({
                            height: (divTrack.height() || 0) - divProgressWidth + 'px',
                            width: '5px',
                            position: 'absolute',
                            right: '0px',
                            bottom: '0px'
                        });
                    }



                }else {
                    if (thumb.is('#thumb-min')){
                        const divProgressMin = (divThumb.previousElementSibling as HTMLElement).
                            children[0] as HTMLElement;
                        divProgressMin.style.width = divProgressWidth + 'px';
                    }else {
                        const divProgressMax = thumb.siblings('.slider-track').children(
                            '#progress-max'
                        );
                        const divTrack = thumb.siblings('.slider-track');
                        divProgressMax.css({
                            width: (divTrack.width() || 0) - divProgressWidth + 'px',
                            position: 'absolute',
                            right: '0px',
                            top: '0px'
                        });
                    }
                }
            }
        };

        (thumb.is('#thumb-min') ||
            thumb.is('#thumb-max')) ? stylingProgress.range() :
            stylingProgress.default()

    }

    makeVertical(range: boolean, wrapper: JQuery){

        /*!this.divTrack ? this.divTrack = $('.slider-track') : null;*/
        const divTrack = wrapper.find('.slider-track');


        const trackWidth: number | undefined = divTrack.width();
        let trackHeight: number | undefined = divTrack.height();

        divTrack.css({
            width: trackHeight + 'px',
            height: trackWidth + 'px'
        });

        if (!range){
            const divThumb = wrapper.find($('.slider-thumb'));

            divThumb.css({
                left: '-8px',
                top: '0px'
            })
        }else {
            const divThumbMin = wrapper.find('#thumb-min');
            const divThumbMax = wrapper.find('#thumb-max');
            trackHeight = divTrack.height();

            divThumbMin.css({
                left: '-8px',
                top: '0px'
            });
            divThumbMax.css({
                left: '-8px',
                top: trackHeight +'px'
            });
        }
    }
}

export {ViewOptional};
