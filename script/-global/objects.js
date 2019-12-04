// TIA stations in GC ----------------------------------------------------------// TIA_GC
var TIA_GC = {
  ZONE1: {
    CLF260: { active: false, name: 'Bodybuffer' },
    CLF264: { active: false, name: 'Adjust Panoroof'},
    CLF280: { active: false, name: 'Doorline Assembly' },
    CLF285: { active: false, name: 'Doorline Buffer' },
    CSR2264: { active: false, name: 'Backup Panoroof CMA' },
    CSR2364: { active: false, name: 'Manual Panoroof SPA' },
    CSR265: { active: false, name: 'Sealing' },
    CSR266: { active: false, name: 'Fitting Panoroof 1' },
    CSR267: { active: false, name: 'Fitting Panoroof 2' },
    CMKE2100: { active: false, name: 'Bottom Cable Furnace' },
    CMKE2210: { active: false, name: 'PT5 pre-assembly' },
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
    CVU453: { active: false, name: 'Filling ?' },
    CVU462: { active: false, name: 'Brake Filling L' },
    CVU463: { active: false, name: 'Brake Filling R' },
    CVU465: { active: false, name: 'UREA' },
    CVU466: { active: false, name: 'Backup UREA' },
    CVU467: { active: false, name: 'Cooling water' },
    CVU507: { active: false, name: 'Repair AC' },
    CVU508: { active: false, name: 'Repair Cooling water' },
    CVU509: { active: false, name: 'Repair UREA' },
    CVU510: { active: false, name: 'Repair Break' },
    CHSC810: { active: false, name: 'High Store IN' },
    CHSC811: { active: false, name: 'High Store OUT' },
    CFRL1101: { active: false, name: 'Control room?' },
  },
  ZONE4: {
    CBA4100: { active: false, name: 'Wheelshuttle' },
    CLF520: { active: false, name: 'Final 2' },
    CBU1001: { active: false, name: 'Bumper Connection' },
    CBU1002: { active: false, name: 'Bumper Assembly' },
    CRL4200: { active: false, name: 'Cal line' },
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


// SHIFTS ----------------------------------------------------------------------// SHIFTS
var SHIFTS = {
  1: {
    W: { s: '00:00:00', e: '05:14:59' },
    S1: { s: '05:15:00', e: '13:29:59' },
    S2: { s: '13:30:00', e: '21:29:59' },
    N1: { s: '21:30:00', e: '23:59:59' },
  },
  2: {
    N2: { s: '00:00:00', e: '05:14:59' },
    S1: { s: '05:15:00', e: '13:29:59' },
    S2: { s: '13:30:00', e: '21:29:59' },
    N1: { s: '21:30:00', e: '23:59:59' },
  },
  5: {
    N2: { s: '00:00:00', e: '05:14:59' },
    S1: { s: '05:15:00', e: '12:14:59' },
    S2: { s: '12:15:00', e: '18:59:59' },
    N1: { s: '19:00:00', e: '23:59:59' },
  },
  6: {
    N2: { s: '00:00:00', e: '03:14:59' },
    W: { s: '03:15:00', e: '23:59:59' },
  },
  7: {
    W:  { s: '00:00:00', e: '23:59:59' },
  },
}

SHIFTS[3] = SHIFTS[4] = SHIFTS[2]


// HOLIDAYs --------------------------------------------------------------------// HOLIDAYS
var HOLIDAYS = [
  new Date (2018,11,31),
  // Januari
  new Date (2019,00,01), new Date (2019,00,02),
  // February (STAKING)
  new Date (2019,01,13),
  // April
  new Date (2019,03,19), new Date (2019,03,22),
  // May
  new Date (2019,04,01), new Date (2019,04,30), new Date (2019,04,31),
  // June
  new Date (2019,05,10),
  // July (SSD)
  new Date (2019,06,22), new Date (2019,06,23), new Date (2019,06,24),
  new Date (2019,06,25), new Date (2019,06,26),
  // (SSD)
  new Date (2019,06,29), new Date (2019,06,30), new Date (2019,06,31),
  new Date (2019,07,01), new Date (2019,07,02),
  // (SSD)
  new Date (2019,07,05), new Date (2019,07,06),new Date (2019,07,07),
  new Date (2019,07,08), new Date (2019,07,09),
  // August
  new Date (2019,07,15),
  new Date (2019,07,16),
  // November
  new Date (2019,10,01), new Date (2019,10,11),
  // December (XSD)
  new Date (2019,11,23), new Date (2019,11,24), new Date (2019,11,25),
  new Date (2019,11,26), new Date (2019,11,27),
  // (XSD)
  new Date (2019,11,30), new Date (2019,11,31),
]


// LAY-OFF ---------------------------------------------------------------------// LAYOFF
var LAYOFF = [
  // Februari
  [new Date (2019,01,01), 'N'],
  [new Date (2019,01,06), 'S2'],
  // March
  [new Date (2019,02,13), 'S2'],
  [new Date (2019,02,29), 'N'],
  // April
  [new Date (2019,03,03), 'S2'],
  [new Date (2019,03,05), 'N'],
  [new Date (2019,03,10), 'S2'],
  [new Date (2019,03,12), 'N'],
  [new Date (2019,03,17), 'S2'],
  // May
  [new Date (2019,04,15), 'S2'],
  [new Date (2019,04,22), 'S2'],
  // June
  [new Date (2019,05,05), 'S2'],
  [new Date (2019,05,19), 'S2'],
  [new Date (2019,05,26), 'S2'],
  // July
  [new Date (2019,06,03), 'S2'],
  [new Date (2019,06,10), 'S2'],
  [new Date (2019,06,19), 'N'],
  // August
  [new Date (2019,07,13), 'S1'],
  [new Date (2019,07,14), 'S2'],
  [new Date (2019,07,20), 'S1'],
  [new Date (2019,07,21), 'S2'],
  [new Date (2019,07,28), 'S2'],
  [new Date (2019,07,30), 'N'],
  // September
  [new Date (2019,08,04), 'S2'],
  [new Date (2019,08,06), 'N'],
  [new Date (2019,08,11), 'S2'],
  [new Date (2019,08,13), 'N'],
  [new Date (2019,08,18), 'S2'],
  [new Date (2019,08,20), 'N'],
  [new Date (2019,08,24), 'S1'],
  [new Date (2019,08,25), 'S2'],
  // Oktober
  [new Date (2019,09,01), 'S1'],
  [new Date (2019,09,02), 'S2'],
  [new Date (2019,09,04), 'N'],
  [new Date (2019,09,08), 'S1'],
  [new Date (2019,09,09), 'S2'],
  [new Date (2019,09,11), 'N'],
  [new Date (2019,09,15), 'S1'],
  [new Date (2019,09,16), 'S2'],
  [new Date (2019,09,18), 'N'],
  [new Date (2019,09,23), 'S2'],
  [new Date (2019,09,25), 'N'],
  [new Date (2019,09,31), 'N'],
  // November
  [new Date (2019,10,05), 'S1'],
  [new Date (2019,10,06), 'S2'],
  [new Date (2019,10,13), 'S2'],
  [new Date (2019,10,15), 'N'],
  [new Date (2019,10,20), 'S2'],
  [new Date (2019,10,21), 'S2'], // Exception: Missing parts
  [new Date (2019,10,22), 'N'],
  [new Date (2019,10,27), 'S2'],
  [new Date (2019,10,29), 'N'],
  // December
  [new Date (2019,11,03), 'S1'],
  [new Date (2019,11,04), 'S2'],
  [new Date (2019,11,11), 'S2'],
  [new Date (2019,11,13), 'N'],
  [new Date (2019,11,18), 'S2'],
  [new Date (2019,11,20), 'N'],

]


// BREAK -----------------------------------------------------------------------// BREAK
var BREAK = {
  1: {
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '15:30:00', e: '15:44:59' },
    L2: { s: '17:30:00', e: '17:44:59' },
    L3: { s: '19:30:00', e: '19:39:59' },
    N3: {
      ZONE3: { s: '23:55:00', e: '23:59:59' },
      ZONE4: { s: '23:50:00', e: '23:59:59' },
    },
  },
  2: {
    N1: {
      ZONE1: { s: '00:10:00', e: '00:34:59' },
      ZONE2: { s: '00:00:00', e: '00:24:59' },
      ZONE3: { s: '00:00:00', e: '00:19:59' },
      ZONE4: { s: '00:00:00', e: '00:14:59' },
    },
    N2: { s: '03:00:00', e: '03:13:59' },
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '15:30:00', e: '15:44:59' },
    L2: { s: '17:30:00', e: '17:44:59' },
    L3: { s: '19:30:00', e: '19:39:59' },
    N3: {
      ZONE3: { s: '23:55:00', e: '23:59:59' },
      ZONE4: { s: '23:50:00', e: '23:59:59' },
    },
  },
  3: {
    N1: {
      ZONE1: { s: '00:10:00', e: '00:34:59' },
      ZONE2: { s: '00:00:00', e: '00:24:59' },
      ZONE3: { s: '00:00:00', e: '00:19:59' },
      ZONE4: { s: '00:00:00', e: '00:14:59' },
    },
    N2: { s: '03:00:00', e: '03:13:59' },
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '15:30:00', e: '15:44:59' },
    L2: { s: '17:30:00', e: '17:44:59' },
    L3: { s: '19:30:00', e: '19:39:59' },
    N3: {
      ZONE3: { s: '23:55:00', e: '23:59:59' },
      ZONE4: { s: '23:50:00', e: '23:59:59' },
    },
  },
  4: {
    N1: {
      ZONE1: { s: '00:10:00', e: '00:34:59' },
      ZONE2: { s: '00:00:00', e: '00:24:59' },
      ZONE3: { s: '00:00:00', e: '00:19:59' },
      ZONE4: { s: '00:00:00', e: '00:14:59' },
    },
    N2: { s: '03:00:00', e: '03:13:59' },
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '15:30:00', e: '15:44:59' },
    L2: { s: '17:30:00', e: '17:44:59' },
    L3: { s: '19:30:00', e: '19:39:59' },
    N3: {
      ZONE3: { s: '23:55:00', e: '23:59:59' },
      ZONE4: { s: '23:50:00', e: '23:59:59' },
    },
  },
  5: {
    N1: {
      ZONE1: { s: '00:10:00', e: '00:34:59' },
      ZONE2: { s: '00:00:00', e: '00:24:59' },
      ZONE3: { s: '00:00:00', e: '00:19:59' },
      ZONE4: { s: '00:00:00', e: '00:14:59' },
    },
    N2: { s: '03:00:00', e: '03:13:59' },
    E1: { s: '07:00:00', e: '07:14:59' },
    E2: { s: '09:00:00', e: '09:14:59' },
    E3: {
      ZONE1: { s: '11:25:00', e: '11:49:59' },
      ZONE2: { s: '11:15:00', e: '11:39:59' },
      ZONE3: { s: '11:10:00', e: '11:34:59' },
      ZONE4: { s: '11:05:00', e: '11:29:59' },
    },
    L1: { s: '14:15:00', e: '14:29:59' },
    L2: { s: '16:00:00', e: '16:09:59' },
    L3: { s: '17:30:00', e: '17:39:59' },
    N2: {
      ZONE1: { s: '21:40:00', e: '22:04:59' },
      ZONE2: { s: '21:30:00', e: '21:54:59' },
      ZONE3: { s: '21:25:00', e: '21:49:59' },
      ZONE4: { s: '21:20:00', e: '21:44:59' },
    },
  },
  6: {
    N1: { s: '00:00:00', e: '00:14:59' },
  },
  7: {},
}
