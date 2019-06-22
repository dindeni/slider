
class ViewOptional{
    private divProgress: JQuery;
    private divTrack: JQuery;
    divLabel: JQuery;
    private divWrapper: JQuery;
    private labelOffset: number = 8;

    createProgress(){
        this.divTrack = $('.slider-track');

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
}

export {ViewOptional};
