
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

    createProgress(range: boolean){
        !this.divTrack ? this.divTrack = $('.slider-track') : null;

        if (!range){
            $('<div class="slider-progress"></div>').appendTo(this.divTrack);
            this.divProgress = $('.slider-progress');
        }else {
            $('<div class="slider-progress" id="progress-min"></div>').appendTo(this.divTrack);
            $('<div class="slider-progress" id="progress-max"></div>').appendTo(this.divTrack);
        }

    }
    stylingProgress(divProgressWidth: number, type: 'min' | 'max' |
    'default'){
        !this.divTrack ? this.divTrack = $('.slider-track') : null;

        switch (type) {
            case "default":
                !this.divProgress ?
                    this.divProgress = $('.slider-progress') : null;
                this.divProgress.css({
                    width: divProgressWidth + 'px'
                });
                break;
                case "min":
                    !this.divProgressMin ?
                        this.divProgressMin = $('#progress-min') : null;
                    this.divProgressMin.css({
                        width: divProgressWidth + 'px'
                    });
                    break;
            case "max":
                !this.divProgressMax ?
                    this.divProgressMax = $('#progress-max') : null;
                this.divProgressMax.css({
                    width:  (this.divTrack.width() || 0) - divProgressWidth + 'px',
                    position: 'absolute',
                    right: '0px',
                    top: '0px'
                })
        }

    }

    createLabel(initValue: number, vertical: boolean, range: boolean, max: number){

        this.divWrapper = $('.slider-wrapper');

        if (!range){
            this.divLabel = $('<div class="slider-label"></div>').appendTo(this.divWrapper);
            this.divLabel.text(initValue);
        }else {
            this.divLabelMin = $('<div class="slider-label" id="label-min">' +
                '</div>').appendTo(this.divWrapper);
            this.divLabelMax = $('<div class="slider-label" id="label-max">' +
                '</div>').appendTo(this.divWrapper);

            !this.divTrack ? this.divTrack = $('.slider-track') : null;
            this.divLabelMax.css({
                left: (this.divTrack.width() || 0) - this.labelOffsetLeft +'px'
            });
            this.divLabelMin.text(initValue);
            this.divLabelMax.text(max);
        }


        vertical ? this.divLabel.css({
            left: '-15px',
            top:  this.labelOffsetTop + 'px'
        }) : null
    }

    updateLabelValue(range: boolean, element: 'min' | 'max' | 'default', value: number, coord: number){
            switch (element) {
                case 'min':
                    !this.divLabelMin ? this.divLabelMin =  $('#label-min') : null;
                    this.divLabelMin.text(value);
                    this.divLabelMin.css({left: coord - this.labelOffsetLeft});
                    break;
                case 'max':
                    !this.divLabelMax ? this.divLabelMax =  $('#label-max') : null;
                    this.divLabelMax.text(value);
                    this.divLabelMax.css({left: coord - this.labelOffsetLeft});
                    break;
                    case 'default':
                        !this.divLabel ? this.divLabel = $('.slider-label') : null;
                        this.divLabel.text(value);
                        this.divLabel.css({left: coord - this.labelOffsetLeft});
        }
    }

    createScale(scaleValue: number[], scaleCoords: number[], vertical: boolean){
        !this.divWrapper ? this.divWrapper = $('.slider-wrapper') : null;
        const ul = $('<ul class="slider-scale"></ul>').appendTo(this.divWrapper);

        scaleValue.map((item, i)=>{

                const itemElement = $(`<li class="slider__scale-item">${item}</li>`).appendTo(ul);

            !vertical ? itemElement.css({left: scaleCoords[i]}) :
                itemElement.css({top: scaleCoords[i]})
        })
    }

    makeVertical(vertical: boolean){
        !this.divTrack ? this.divTrack = $('.slider-track') : null;

        const trackWidth: number | undefined = this.divTrack.width();
        const trackHeight: number | undefined = this.divTrack.height();

        this.divTrack.css({
            width: trackHeight + 'px',
            height: trackWidth + 'px'
        });

        this.divThumb = $('.slider-thumb');

        this.divThumb.css({
            left: '-8px',
            top: '0px'
        })

    }
}

export {ViewOptional};
