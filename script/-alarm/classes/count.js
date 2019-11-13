// COUNT CLASS -----------------------------------------------------------------
class CountObj {

  constructor(name) {
    this.count = 0
    this.duration = 0
    this.fromTL = {}
  }

  add(a){
    this.count++
    this.duration += a._duration
    this.durtxt = dhms(this.duration)

    if(a._timeline != undefined){
      for (var item in a._timeline.duration) {
        if(item.indexOf('_') != 0){

          var split = item.split('_')

          if (split.length == 1) {

            if (this.fromTL[item] == undefined) {this.fromTL[split[0]] = 0}
            this.fromTL[item] += a._timeline.duration[item]

          } else {
            //// NOTE: durtxt not needed here
            //this.fromTL[item] = dhms(this.fromTL[split[0]])
          }
        }
      }
    }

    this._timelineCorrect = this.dur === this.fromTL.TOTAL

  }
}
