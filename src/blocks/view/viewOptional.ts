
class ViewOptional{
    private divProgress: JQuery;
    private divTrack: JQuery;
    divLabel: JQuery;
    private divWrapper: JQuery;
    private labelOffsetLeft: number = 8;
    private labelOffsetTop: number = -30;
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

    createLabel(initValue: number, vertical: boolean){
        this.divWrapper = $('.slider-wrapper');
        this.divLabel = $('<div class="slider-label"></div>').appendTo(this.divWrapper);
        this.divLabel.text(initValue);

        vertical ? this.divLabel.css({
            left: '-15px',
            top:  this.labelOffsetTop + 'px'
        }) : null
    }

    updateLabelValue(vertical, value: number, coord: number){
        !this.divLabel ? this.divLabel = $('.slider-label') : null;
        this.divLabel.text(value);
        !vertical ? this.divLabel.css({
            left: coord - this.labelOffsetLeft + 'px'
        }) : this.divLabel.css({
            top: coord + this.labelOffsetTop + 'px'
        })
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
