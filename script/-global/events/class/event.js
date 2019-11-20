// Event CLASS -----------------------------------------------------------------
class Event {

  // CONSTRUCTOR -----------------------------------------------------          // constructor
  constructor(data, i) {

    // The index number in the EVENTS.all array
    this._index = i

    // From database
    this._datetime = data[0];
    this.station = data[1];
    this._var = this.setVar_temp(data[1], data[2]);
    this._varOrg = data[2];
    this.comment = data[3];
    this.severity = data[4];
    this._state = parseInt(data[5]);

    // safe date parse of _datetime
    this._dt = sDateParse(this._datetime);

    // state text ON/OFF
    this.statetxt = ['OFF','ON'][this._state];

    // set zone and station full name
    this.getZoneStation(this.station)

    // set stationcode, modezone, object and description
    this.setParts(this._var)

    // set alarm type
    this.setAlarmType(this._var)

  }

  // Set alarm type --------------------------------------------------          // setAlarmType
  setAlarmType(v){

    // types oject ----------------------------------------------
    var types = {

      // MODE ----------------------------------------------
      mode: /.{0,}[^d]Mode/,

      // Second part with MODE
      autonotstarted: /[Mm]ode.{0,}[Aa]uto/,
      manual: /[Mm]ode.{0,}[Mm]an.{0,}[Mm]ode/,
      resseq: /[Mm]ode.{0,}Res.{0,}Seq/,
      restm: /[Mm]ode.{0,}Res.{0,}TM/,
      forced: /[Mm]ode.{0,}ForcedMan/,
      homerun: /[Mm]ode.{0,}HomeRun/,
      normalstop: /[Mm]ode.{0,}NormalStop/,


      // GENERAL -------------------------------------------
      'general interlock': /[Ii]nt.{0,}l.{0,}k/,
      'general keeppos': /KeepPos/,
      'general processtime': /ProcessTime/,
      'general overtime': /Ovt.{0,}Alm/,
      'general atlascopco': /AtlasCopco/,
      'general robot': /[0-9]R[0-9]{1,}/,
      'general com': /Com/,
      'general diag': /DiagPLC/,
      'general system': /LSystemVar/,


      // PRODUCTION ----------------------------------------
      production: /Prod/,

      // Second part with PRODUCTION
      prodmode: /ProdMode/, // eg. Empty cycle..
      inout: /[IiOo][un]t{0,1}feed/,
      andon: /[Aa]ndon/,
      controlroom: /StopCR/,


      // SAFETY --------------------------------------------
      safety: /Safety/,

      // Second part with SAFETY
      EStop: /EStop/,
      GStop: /GStop/,
      MStop: /MotionStop/,
      gate: /AS[0-9]{2}.{0,}SG/,
      button: /AS[0-9]{2}.{0,}SH/,
      overtravel: /CA[0-9]{2}.{0,}SG[0-9]{2}/,

    }

    // Type setting ---------------------------------------------
    this._type = '' // Init

    // Give types in types object which regex test true
    for (var t in types) {
      if (types[t].test(v)) {
        // Add a space when more then one type
        if (this._type.length > 0) {this._type += ' '}
        this._type += t // Add type to string
      }
    }

    // If no type is set, give it default type alarm
    // If only one type is set add ' other'
    if (this._type == '') {
      this._type = 'general other'
    } else if (this._type.split(' ').length == 1) {
      this._type += ' other'
    }

    // TEMP: add formatnok when there's no stationcode
    if(this._stcode == 'n/a'){ this._type += ' formatnok' }

  }


  // Parse stationcode, modezone, object and description ------------           // setParts
  setParts(v){

    // regExp
    var dsc = /.A[A-E]_.{0,}$/            // Description
    var stc = /^[0-9]{4}[a-zA-Z]/         // Stationcode
    var zm  = /^[0-9]{4}Z[M,S][0-9]{2,}/  // Modezone

    // Description ---------------------------------------------
    var description =   regExp(dsc, '    n/a')
    this.description =  description.substr(4) //without ".AA_"

    // Remove description from var (inclusive ".AA_")
    v = v.replace(description,'')

    // Stationcode & Modezone ----------------------------------
    this._stcode = regExp(stc, 'n/a'    ).substr(0,4)
    this.zone = regExp(zm,  '    General').substr(4)

    // Object --------------------------------------------------
    // - Set object to what is left by replace
    this.object = v.replace(this._stcode,'').replace(this.zone,'')

    // - Object empty => set n/a
    if (this.object.length == 0) { this.object = 'n/a' }

    // Regex find function -------------------------------------
    // - If regex test is false use fallback
    function regExp(rgx, fallback){
      if (rgx.test(v)) { return v.match(rgx)[0] } else { return fallback }
    }

  }


  // Get zone and station from TIA_GC object -------------------------          // getZoneStation
  getZoneStation(station){
    for (var zone in TIA_GC) {
      // Station present in zone -> set zone & name
      if (TIA_GC[zone].hasOwnProperty(station)) {
        this._zone = zone
        this._stntxt = TIA_GC[zone][station].name
      }
    }
  }


  // For "_var" without stationcode ----------------------------------          // setVar_temp
  // - TEMP: for vars without station code
  setVar_temp(station, v){

    var stationCode = /^[0-9]{3,}/; // stn number at start of string
    var stationNum = /[0-9]{3,}/;   // any number in station 3 or longer

    // - No stationcode: add station code between ()
    if (!v.match(stationCode)) {
      return '(' + station.match(stationNum) + ')' + v
    // - StationCode 3 numbers in stead of 4 add 0
    } else if (v.match(stationCode)[0].length == 3){
      return '0' + v
    // - Else return the _var as it was
    } else {
      return v
    }
  }
}
