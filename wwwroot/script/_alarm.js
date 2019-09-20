//ALARM OBJECT GENERATOR -------------------------------------------------------
function alarm(data) {

  //alarm part names for object in order of fetched data
  var alarmparts = [
    'datetime','station', '_var', 'comment', 'severity', '_state'
  ];

  var onoff = ['OFF','ON']

  var rgx = {
    st : RegExp(/^[0-9]{4}[a-zA-Z]/),
    z: {
      m: RegExp(/^[0-9]{4}ZM[0-9.]{2,}/),
      s: RegExp(/^[0-9]{4}ZS[0-9.]{2,}/),
      ms: RegExp(/Z[M,S][0-9.]{2,}/),
    },
    dsc: RegExp(/.A[A-E]_.{0,}$/),
    aa: RegExp(/.A[A-E]_/)
  };

  //alarm object
  this.alarm = {};

  //put alarm parts
  for (let i = 0; i < data.length; i++) {
    this.alarm[alarmparts[i]] = data[i]
  };

  this.alarm.statetxt = onoff[parseInt(this.alarm._state)]

  //Regexing ---------------------------------------------------------
  //part1 + description
  if (rgx.dsc.test(this.alarm._var)){

    //Example: 3037ZM02CR01.AD_TrfOutSetInterlock
    //     p2:             .AD_TrfOutSetInterlock
    this.p2 = this.alarm._var.match(rgx.dsc)[0]
    //     p1: 3037ZM02CR01
    this.p1 = this.alarm._var.replace(this.p2,'')
    //     p2:                 TrfOutSetInterlock
    this.p2 = this.p2.replace(this.p2.match(rgx.aa)[0],'')
    this.alarm['description'] = this.p2

  }

  //derived from part 1:                  3037ZM02CR01
  if (rgx.st.test(this.p1)){
    //          _stcode:                  3037
    this.alarm['_stcode'] = this.p1.substr(0,4)

    //is station is OK: extract zone
    if (rgx.z.m.test(this.p1)){
      //            zone:                     ZM02
      this.alarm['zone'] = this.p1.match(rgx.z.ms)[0] //ZM
      this.alarm['_type'] = 'alarm'
    } else if (rgx.z.s.test(this.p1)){
      //            zone:                     ZS02 (not in this example case)
      this.alarm['zone'] = this.p1.match(rgx.z.ms)[0] //ZS
      this.alarm['_type'] = 'safety'
    } else {
      //if no ZM of ZS
      this.alarm['zone'] = 'General'
      this.alarm['_type'] = 'general'
    };

    //remove stcode and zone to retain object:    CR01
    this.alarm['object'] = this.p1
    .replace(this.alarm._stcode,'').replace(this.alarm.zone,'')

    //if station is NOK do nothing and place p1 in desc. (for now)
  } else {
    this.alarm['_stcode'] = 'n/a'
    this.alarm['zone'] = 'n/a'
    this.alarm['object'] = 'n/a'
    this.alarm['description'] = this.alarm._var + ' (alarm format nok!!)'
  }

};
