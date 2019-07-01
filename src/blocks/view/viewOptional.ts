
class ViewOptional{
    private divProgress: JQuery;
    private divTrack: JQuery;
    divLabel: JQuery;
    private divWrapper: JQuery;
    private labelOffset: number = 8;
    private divThumb: JQuery;

    createProgress(){
        !this.divTrack ? this.divTrack = $('.slider-track') : null;

        $('<div class="slider-progress"></div>').appendTo(this.divTrack);
        this.divProgress = $('.slider-progress');

    }
    stylingProgress(divProgressWidth: number){
        !this.divProgress ?
            this.divProgress = $('.slider-progress') : null;
        this.divProgress.css({
            width: divProgressWidth + 'px'
        });
    }

    createLabel(initValue: number){
        this.divWrapper = $('.slider-wrapper');
        this.divLabel = $('<div class="slider-label"></div>').appendTo(this.divWrapper);
        this.divLabel.text(initValue)
    }

    updateLabelValue(value: number, left: number){
        !this.divLabel ? this.divLabel = $('.slider-label') : null;
        this.divLabel.text(value);
        this.divLabel.css({
            left: left - this.labelOffset
        })
    }

    createScale(scaleValue: number[], scaleCoords: number[]){
        !this.divWrapper ? this.divWrapper = $('.slider-wrapper') : null;
        const ul = $('<ul class="slider-scale"></ul>').appendTo(this.divWrapper);

        scaleValue.map((item, i)=>{

                const itemElement = $(`<li class="slider__scale-item">${item}</li>`).appendTo(ul);

            itemElement.css({left: scaleCoords[i]})
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
