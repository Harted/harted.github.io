// TIA stations in GC ----------------------------------------------------------// TIA_GC
var TIA_GC = {
  ZONE1: {
    CLF260: { active: false, name: 'Bodybuffer' },
    CLF280: { active: false, name: 'Doorline Assembly' },
    CLF285: { active: false, name: 'Doorline Buffer' },
    CSR2264: { active: false, name: 'Backup Panoroof CMA' },
    CSR2364: { active: false, name: 'Manual Panoroof SPA' },
    CSR265: { active: false, name: 'Sealing' },
    CSR266: { active: false, name: 'Fitting Panoroof 1' },
    CSR267: { active: false, name: 'Fitting Panoroof 2' },
    CMKE2100: { active: false, name: 'Bottom Cable Furnace' },
    CLF2028: { active: false, name: 'Pretrim 1' },
    CLF2029: { active: false, name: 'Pretrim 2' },
    CHL2922: { active: false, name: 'Headlining' },
    CDU220: { active: false, name: 'Robot Driving Unit' },
    CLF248: { active: false, name: 'Buffer to PT5' },
    CCP222: { active: false, name: 'Cockpit conveyor' },
    CCP2222: { active: false, name: 'Cockpit pre-assembly' },
  },
  ZONE2: {
    CMP305: { active: false, name: 'Wedding CMA/SPA' },
    CMP306: { active: false, name: 'Bolting CMA/SPA' },
    CMP310: { active: false, name: 'Bolt repair / Engine Bay' },
    CMP311: { active: false, name: 'Divorce' },
    CLF2000: { active: false, name: 'BAX' },
    CLF2030: { active: false, name: 'Rear wheel unit' },
    CLF4000: { active: false, name: 'FAX' },
    CLF4030: { active: false, name: 'Front suspension' },
    CLF3037: { active: false, name: 'Palletline 1' },
    CLF3038: { active: false, name: 'Palletline 2' },
    CFM2010: { active: false, name: 'Front compression unit' },
    CFM4010: { active: false, name: 'Rear compression unit' },
  },
  ZONE3: {
    CPU445: { active: false, name: 'PUR Panoroof' },
    CPU446: { active: false, name: 'PUR Glazing' },
    CPU447: { active: false, name: 'PUR Backup' },
    CLF448: { active: false, name: 'PUR Conveyor' },
    CVU462: { active: false, name: 'Brake Filling L' },
    CVU463: { active: false, name: 'Brake Filling R' },
    CVU465: { active: false, name: 'UREA' },
    CHSC810: { active: false, name: 'High Store IN' },
    CHSC811: { active: false, name: 'High Store OUT' },
  },
  ZONE4: {
    CBA4100: { active: false, name: 'Wheelshuttle' },
    CLF520: { active: false, name: 'Final 2' },
    CBU1001: { active: false, name: 'Bumper Connection' },
    CBU1002: { active: false, name: 'Bumper Assembly' },
  },
  OTHER: {},
}


// Filters default class -------------------------------------------------------// FILTERS
class DefaultFilters {
  constructor() {

    this.only = {
      active: false
    }

    this.sev = {
      A: true, B: true, C: true, D: true, E: false,
    }

    this.general = {
      interlock: true, keeppos: true, processtime: true, overtime: true,
      com: true, diag: true, system: true, robot: true,
      atlascopco: true, other: true,
    }

    this.safety = {
      EStop: true, GStop: true, MStop: true, overtravel: true,
      button: true, gate: true, other: true,
    }

    this.mode = {
      autonotstarted: true, manual: true, resseq: true, restm: true,
      forced: true, homerun: true, normalstop: true, other: true,
    }

    this.production = {
      prodmode: true, inout: true, andon: true, controlroom: true,
      other: true,
    }
  }
}; var FILTERS = new DefaultFilters
