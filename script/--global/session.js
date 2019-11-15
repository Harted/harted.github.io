// CURRENT SET Class ----------------------------------------------------------- CurrentSet
class CurrentSet {
  constructor(URI) {
    URI = URI || false
    if (URI) {
      this.TIA_GC = this.toBinTIAGC(TIA_GC)
      this.FILTERS = this.toBinFILTERS(FILTERS)
    } else {
      this.TIA_GC = TIA_GC
      this.FILTERS = FILTERS
    }
    this.TIME = {
      rel: TIME.rel,
      rt: TIME.rt,
      lbt: TIME.lbt(),
      sta: TIME.sta(),
      end: TIME.end(),
    }
  }

  toBinTIAGC(TIA){
    var binStr = '';
    for (var zone in TIA) {
      for (var stn in TIA[zone]) {
        if (TIA[zone][stn].hasOwnProperty('sel')) {
          switch (TIA[zone][stn].sel) {
            case true: binStr += '1'
            break;
            case false: binStr += '0'
            break;
          }
        }
      }
    }; return binStr;
  }

  toBinFILTERS(F){
    var binStr = '';
    for (var top in F) {
      for (var sub in F[top]) {
        switch (F[top][sub]) {
          case true: binStr += '1'; break;
          case false: binStr += '0'; break;
        }
      }
    }; return binStr;
  }
}


// FROM CURRENT SET Class ------------------------------------------------------ fromCurrentSet
class fromCurrentSet {
  constructor(session) {
    this.TIA_GC = this.fromBinTIAGC(session.TIA_GC)
    this.FILTERS = this.fromFILTERS(session.FILTERS)
    this.TIME = session.TIME
  }

  fromBinTIAGC(ses) {
    for (var zone in TIA_GC) {
      for (var stn in TIA_GC[zone]) {
        if (stn.indexOf('_') != 0 && TIA_GC[zone][stn].hasOwnProperty('active')) {
          var bin = ses.slice(0,1)
          var ses = ses.slice(1)

          switch (bin) {
            case '1': TIA_GC[zone][stn].sel = true
            break;
            case '0': TIA_GC[zone][stn].sel = false
            break;
          }
        }
      }
    }; return TIA_GC;
  }

  fromFILTERS(ses){
    for (var top in FILTERS) {
      for (var sub in FILTERS[top]) {

        var bin = ses.slice(0,1)
        var ses = ses.slice(1)

        switch (bin) {
          case '1': FILTERS[top][sub] = true
          break;
          case '0': FILTERS[top][sub] = false
          break;
        }
      }
    }; return FILTERS
  }

}
