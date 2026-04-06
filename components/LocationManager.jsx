import { useState, useMemo, useRef, useEffect } from "react";

const BRANCHES = [
  { id: "181", name: "181 - Akron Ship Hub" },
  { id: "1550", name: "1550 - Chicago Ship Hub" },
];

// ===== BRANCH 181 - Verified from real T_CLASS_LOCA =====
const D181 = [
  {id:"W10-Q01-01",z:"W1L",a:"W10",l:48,w:54,h:73,v:189216,c:"W10F",pf:"1001111110",t:"I"},
  {id:"W10-Q01-02",z:"W1L",a:"W10",l:48,w:54,h:73,v:189216,c:"W10F",pf:"1001111110",t:"I"},
  {id:"W10-Q04-01",z:"W1L",a:"W10",l:48,w:54,h:62,v:160704,c:"W10H",pf:"1001111110",t:"I"},
  {id:"W10-Q04-02",z:"W1L",a:"W10",l:48,w:54,h:62,v:160704,c:"W10H",pf:"1001111110",t:"I"},
  {id:"W10-P01-01",z:"W1L",a:"W10",l:48,w:54,h:73,v:189216,c:"W10F",pf:"1001112120",t:"I"},
  {id:"W10-P01-02",z:"W1L",a:"W10",l:48,w:54,h:73,v:189216,c:"W10F",pf:"1001112120",t:"I"},
  {id:"W06-Q01-01",z:"W1L",a:"W06",l:48,w:54,h:72,v:186624,c:"W06F",pf:"1003111110",t:"I"},
  {id:"W06-Q01-02",z:"W1L",a:"W06",l:48,w:54,h:72,v:186624,c:"W06F",pf:"1003111110",t:"I"},
  {id:"W06-Q04-01",z:"W1L",a:"W06",l:48,w:54,h:28,v:72576,c:"W06H",pf:"1003111110",t:"I"},
  {id:"W03-Q01-01",z:"W1L",a:"W03",l:24,w:27,h:18,v:11664,c:"W03F",pf:"1005111110",t:"I"},
  {id:"W03-Q01-02",z:"W1L",a:"W03",l:24,w:27,h:18,v:11664,c:"W03F",pf:"1005111110",t:"I"},
  {id:"W03-Q02-01A",z:"W1L",a:"W03",l:8,w:8,h:8,v:512,c:"W03TT",pf:"1005111110",t:"I"},
  {id:"W03-Q02-01B",z:"W1L",a:"W03",l:8,w:8,h:8,v:512,c:"W03TT",pf:"1005111110",t:"I"},
  {id:"W02-Q01-01",z:"W1L",a:"W02",l:24,w:27,h:18,v:11664,c:"W02F",pf:"1005111110",t:"I"},
  {id:"W02-Q01-02",z:"W1L",a:"W02",l:24,w:27,h:18,v:11664,c:"W02F",pf:"1005111110",t:"I"},
  {id:"W00-B01-01",z:"W1L",a:"W00",l:48,w:13.5,h:128,v:82944,c:"SDOOR",pf:"1001010100",t:"I"},
  {id:"W01-E01-01",z:"W1L",a:"W01",l:48,w:54,h:62,v:160704,c:"W01F",pf:"1006106060",t:"I"},
  {id:"W04-B01-01",z:"W1L",a:"W04",l:48,w:27,h:28,v:36288,c:"W04",pf:"1004103030",t:"I"},
  {id:"W04-B01-02",z:"W1L",a:"W04",l:48,w:27,h:28,v:36288,c:"W04",pf:"1004103030",t:"I"},
  {id:"WP11-D01-01",z:"WPIPE",a:"WP11",l:0,w:0,h:0,v:0,c:"WP11",pf:"2001021210",t:"I"},
  {id:"WP11-B01-01",z:"WPIPE",a:"WP11",l:0,w:0,h:0,v:0,c:"WP11_SM",pf:"2001019190",t:"I"},
];

// ===== BRANCH 1550 - R-locations only, verified from T_LOCATION + T_CLASS_LOCA =====
const D1550 = [
  {id:"R00-D06-03",z:"HPH",a:"R00",l:24.0,w:42.0,h:26.0,v:26208.0,c:"R00H",pf:"1100052580",t:"I"},
  {id:"R00-D06-04",z:"HPH",a:"R00",l:24.0,w:42.0,h:26.0,v:26208.0,c:"R00H",pf:"1100052580",t:"I"},
  {id:"R01-B6-04",z:"W1H",a:"R01",l:48.0,w:27.0,h:27.5,v:32076.0,c:"R01H",pf:"2100000200",t:"I"},
  {id:"R01-F4-06",z:"W1L",a:"R01",l:48.0,w:13.5,h:17.5,v:10206.0,c:"R01L",pf:"2100001080",t:"I"},
  {id:"R02-D5-03",z:"VNA",a:"R02",l:48.0,w:27.0,h:21.5,v:25077.6,c:"R02H",pf:"2100010100",t:"I"},
  {id:"R02-E7-04",z:"VNA",a:"R02",l:48.0,w:13.5,h:21.5,v:12538.8,c:"R02H",pf:"2100009680",t:"I"},
  {id:"R03-B07-01",z:"VNA",a:"R03",l:48.0,w:27.0,h:21.5,v:27864.0,c:"R03H",pf:"2100010750",t:"I"},
  {id:"R03-B07-02",z:"VNA",a:"R03",l:48.0,w:27.0,h:21.5,v:27864.0,c:"R03H",pf:"2100010750",t:"I"},
  {id:"R04-J2-08B",z:"VNA",a:"R04",l:7.5,w:7.0,h:8.0,v:378.0,c:"R04L",pf:"2100014414",t:"I"},
  {id:"R04-Q11-05",z:"VNA",a:"R04",l:24.0,w:18.0,h:21.5,v:8359.2,c:"R04H",pf:"2100016840",t:"I"},
  {id:"R05-Q12-01",z:"VNA",a:"R05",l:24.0,w:13.5,h:21.5,v:6269.4,c:"R05H",pf:"2100019890",t:"I"},
  {id:"R05-Q12-02",z:"VNA",a:"R05",l:24.0,w:13.5,h:21.5,v:6269.4,c:"R05H",pf:"2100019900",t:"I"},
  {id:"R06-N6-05",z:"VNA",a:"R06",l:24.0,w:10.8,h:9.0,v:2099.52,c:"R06L",pf:"2100020925",t:"I"},
  {id:"R06-P11-06",z:"VNA",a:"R06",l:24.0,w:18.0,h:21.5,v:8359.2,c:"R06H",pf:"2100020170",t:"I"},
  {id:"R07-D2-04",z:"VNA",a:"R07",l:17.0,w:7.0,h:8.0,v:856.8,c:"R07L",pf:"2100029730",t:"I"},
  {id:"R07-D6-02",z:"VNA",a:"R07",l:17.0,w:7.0,h:10.0,v:1071.0,c:"R07L",pf:"2100029970",t:"I"},
  {id:"R08-H13-03",z:"VNA",a:"R08",l:24.0,w:27.0,h:21.5,v:12538.8,c:"R08H",pf:"2100032840",t:"I"},
  {id:"R08-H5-01B",z:"VNA",a:"R08",l:7.5,w:7.0,h:8.0,v:378.0,c:"R08L",pf:"2100032440",t:"I"},
  {id:"R09-S12-08",z:"VNA",a:"R09",l:24.0,w:13.5,h:21.5,v:6269.4,c:"R09H",pf:"2100038980",t:"I"},
  {id:"R09-P10-01",z:"VNA",a:"R09",l:24.0,w:27.0,h:21.5,v:12538.8,c:"R09H",pf:"2100040560",t:"I"},
  {id:"R10-K7-04",z:"VNA",a:"R10",l:48.0,w:18.0,h:21.5,v:16718.4,c:"R10H",pf:"2100042970",t:"I"},
  {id:"R10-N5-01",z:"VNA",a:"R10",l:48.0,w:10.8,h:21.5,v:10031.04,c:"R10H",pf:"2100041370",t:"I"},
  {id:"R11-G7-02",z:"VNA",a:"R11",l:48.0,w:18.0,h:21.5,v:16718.4,c:"R11H",pf:"2100051090",t:"I"},
  {id:"R11-J1-01",z:"VNA",a:"R11",l:48.0,w:54.0,h:45.0,v:104976.0,c:"R11L",pf:"2100052320",t:"I"},
  {id:"R12-S7-02",z:"VNA",a:"R12",l:48.0,w:54.0,h:52.5,v:122472.0,c:"R12H",pf:"2100056030",t:"I"},
  {id:"R12-G9-02",z:"VNA",a:"R12",l:48.0,w:54.0,h:72.0,v:167961.6,c:"R12H",pf:"2100057610",t:"I"},
  {id:"R13-C5-03",z:"VNA2",a:"R13",l:48.0,w:27.0,h:42.5,v:49572.0,c:"R13H",pf:"2100058780",t:"I"},
  {id:"R13-G3-01",z:"VNA2",a:"R13",l:48.0,w:27.0,h:33.5,v:39074.4,c:"R13H",pf:"2100059500",t:"I"},
  {id:"R14-R1-02",z:"VNA2",a:"R14",l:48.0,w:54.0,h:37.5,v:87480.0,c:"R14L",pf:"2100061790",t:"I"},
  {id:"R14-C6-04",z:"VNA2",a:"R14",l:48.0,w:27.0,h:27.5,v:32076.0,c:"R14H",pf:"2100066180",t:"I"},
  {id:"R15-S5-10",z:"VNA2",a:"R15",l:48.0,w:10.8,h:21.5,v:10031.04,c:"R15H",pf:"2100074590",t:"I"},
  {id:"R15-C01-03",z:"VNA2",a:"R15",l:24.0,w:24.0,h:17.0,v:9792.0,c:"R15L",pf:"2100067600",t:"I"},
  {id:"R16-Q8-10",z:"VNA2",a:"R16",l:24.0,w:10.8,h:9.0,v:2099.52,c:"R16L",pf:"2100073730",t:"I"},
  {id:"R16-R2-08C",z:"VNA2",a:"R16",l:7.5,w:7.0,h:8.0,v:378.0,c:"R16L",pf:"2100073855",t:"I"},
  {id:"R17-B10-02",z:"VNA2",a:"R17",l:24.0,w:27.0,h:21.5,v:12538.8,c:"R17H",pf:"2100084110",t:"I"},
  {id:"R17-C10-02",z:"VNA2",a:"R17",l:24.0,w:27.0,h:21.5,v:12538.8,c:"R17H",pf:"2100083660",t:"I"},
  {id:"R18-Q3-03A",z:"VNA2",a:"R18",l:11.5,w:7.0,h:8.0,v:579.6,c:"R18L",pf:"2100076152",t:"I"},
  {id:"R18-S3-08A",z:"VNA2",a:"R18",l:11.5,w:7.0,h:8.0,v:579.6,c:"R18L",pf:"2100074964",t:"I"},
  {id:"R19-K12-03",z:"VNA2",a:"R19",l:24.0,w:13.5,h:21.5,v:6269.4,c:"R19H",pf:"2100089770",t:"I"},
  {id:"R19-P12-04",z:"VNA2",a:"R19",l:24.0,w:13.5,h:21.5,v:6269.4,c:"R19H",pf:"2100092180",t:"I"},
  {id:"R20-B13-04",z:"VNA2",a:"R20",l:24.0,w:27.0,h:21.5,v:12538.8,c:"R20H",pf:"2100085060",t:"I"},
  {id:"R20-C13-02",z:"VNA2",a:"R20",l:24.0,w:27.0,h:21.5,v:12538.8,c:"R20H",pf:"2100085130",t:"I"},
  {id:"R21-S3-04",z:"VNA2",a:"R21",l:18.0,w:24.0,h:14.0,v:5443.2,c:"R21L",pf:"2100094119",t:"I"},
  {id:"R21-L14-01",z:"VNA2",a:"R21",l:24.0,w:54.0,h:72.0,v:83980.8,c:"R21H",pf:"2100097710",t:"I"},
  {id:"R22-C4-01",z:"VNA2",a:"R22",l:48.0,w:13.5,h:21.5,v:12538.8,c:"R22H",pf:"2100101490",t:"I"},
  {id:"R22-K6-02",z:"VNA2",a:"R22",l:48.0,w:18.0,h:21.5,v:16718.4,c:"R22H",pf:"2100097930",t:"I"},
  {id:"R23-C7-01",z:"VNA2",a:"R23",l:48.0,w:54.0,h:52.5,v:122472.0,c:"INSUL",pf:"2100102800",t:"I"},
  {id:"R23-H3-01",z:"VNA2",a:"R23",l:48.0,w:27.0,h:33.5,v:39074.4,c:"R23H",pf:"2100103590",t:"I"},
  {id:"R23A-B01-01",z:"W1L",a:"R23A",l:48.0,w:42.0,h:44.0,v:88704.0,c:"R23AL",pf:"2100107860",t:"I"},
  {id:"R23A-B01-02",z:"W1L",a:"R23A",l:48.0,w:42.0,h:44.0,v:88704.0,c:"R23AL",pf:"2100107860",t:"I"},
  {id:"R24-F3-02",z:"W1H",a:"R24",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R24H",pf:"2100108970",t:"I"},
  {id:"R24-M3-01",z:"W1H",a:"R24",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R24H",pf:"2100108910",t:"I"},
  {id:"R25-S3-02",z:"W1H",a:"R25",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R25H",pf:"2100110160",t:"I"},
  {id:"R25-K9-01",z:"W1H",a:"R25",l:48.0,w:54.0,h:72.0,v:167961.6,c:"R25H",pf:"2100110090",t:"I"},
  {id:"R26-G7-01",z:"W1H",a:"R26",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R26H",pf:"2100111260",t:"I"},
  {id:"R26-N5-02",z:"W1H",a:"R26",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R26H",pf:"2100111200",t:"I"},
  {id:"R27-C3-02",z:"W1H",a:"R27",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R27L",pf:"2100112320",t:"I"},
  {id:"R27-J5-01",z:"W1H",a:"R27",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R27H",pf:"2100112380",t:"M"},
  {id:"R49-M03-04",z:"HPL",a:"R49",l:48.0,w:27.0,h:112.0,v:225792.0,c:"R49L",pf:"1100040180",t:"I"},
  {id:"R49-M03-02",z:"HPL",a:"R49",l:48.0,w:27.0,h:112.0,v:225792.0,c:"R49L",pf:"1100040180",t:"I"},
  {id:"R50-E4-01",z:"W1H",a:"R50",l:48.0,w:27.0,h:17.5,v:20412.0,c:"R50H",pf:"1100035520",t:"I"},
  {id:"R50-E3-02",z:"W1L",a:"R50",l:48.0,w:18.0,h:17.5,v:13608.0,c:"R50L",pf:"1100035570",t:"I"},
  {id:"R51-M9-02",z:"W1H",a:"R51",l:48.0,w:54.0,h:72.0,v:167961.6,c:"R51H",pf:"1100033550",t:"I"},
  {id:"R51-C1-02",z:"W1L",a:"R51",l:48.0,w:54.0,h:59.5,v:138801.6,c:"R51L",pf:"1100034460",t:"I"},
  {id:"R52-C1-01",z:"W1L",a:"R52",l:48.0,w:54.0,h:59.5,v:138801.6,c:"R52L",pf:"1100031640",t:"I"},
  {id:"R52-C1-02",z:"W1L",a:"R52",l:48.0,w:54.0,h:59.5,v:138801.6,c:"R52L",pf:"1100031630",t:"I"},
  {id:"R53-M3-04",z:"W1H",a:"R53",l:48.0,w:27.0,h:33.5,v:39074.4,c:"R53H",pf:"1100029790",t:"I"},
  {id:"R53-L4-02",z:"W1H",a:"R53",l:48.0,w:27.0,h:40.5,v:47239.2,c:"R53H",pf:"1100029920",t:"I"},
  {id:"R54-D5-02",z:"W1H",a:"R54",l:48.0,w:54.0,h:42.5,v:99144.0,c:"R54H",pf:"1100026850",t:"I"},
  {id:"R54-D7-02",z:"W1H",a:"R54",l:48.0,w:54.0,h:52.5,v:122472.0,c:"R54H",pf:"1100026870",t:"I"},
  {id:"R55-B5-01",z:"W1H",a:"R55",l:48.0,w:54.0,h:51.5,v:120139.2,c:"R55H",pf:"1100026360",t:"I"},
  {id:"R55-L1-01",z:"W1L",a:"R55",l:48.0,w:54.0,h:107.5,v:250776.0,c:"R55L",pf:"1100025690",t:"I"},
  {id:"R56-B5-03",z:"W1H",a:"R56",l:48.0,w:18.0,h:42.5,v:36720.0,c:"R56-5/7",pf:"1100022690",t:"I"},
  {id:"R56-B5-04",z:"W1H",a:"R56",l:48.0,w:18.0,h:42.5,v:36720.0,c:"R56-5/7",pf:"1100022690",t:"I"},
  {id:"R57-M3-06",z:"W1L",a:"R57",l:48.0,w:18.0,h:17.5,v:13608.0,c:"R57L",pf:"1100020300",t:"I"},
  {id:"R57-M6-04",z:"W1H",a:"R57",l:48.0,w:27.0,h:27.5,v:32076.0,c:"R57H",pf:"1100020200",t:"I"},
  {id:"R58-H3-03",z:"W1L",a:"R58",l:48.0,w:18.0,h:17.5,v:13608.0,c:"R58L",pf:"1100016910",t:"I"},
  {id:"R58-K6-04",z:"W1H",a:"R58",l:48.0,w:27.0,h:27.5,v:32076.0,c:"R58H",pf:"1100017480",t:"I"},
  {id:"R59-R3-01",z:"W1H",a:"R59",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R59H",pf:"1100014190",t:"I"},
  {id:"R59-J3-01",z:"W1H",a:"R59",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R59H",pf:"1100014840",t:"I"},
  {id:"R60-L1-01",z:"W1L",a:"R60",l:48.0,w:54.0,h:107.5,v:250776.0,c:"R60L",pf:"1100013530",t:"I"},
  {id:"R60-L1-02",z:"W1L",a:"R60",l:48.0,w:54.0,h:107.5,v:250776.0,c:"R60L",pf:"1100013520",t:"I"},
  {id:"R61-K9-02",z:"W1H",a:"R61",l:48.0,w:54.0,h:72.0,v:167961.6,c:"R61H",pf:"1100012040",t:"I"},
  {id:"R61-C1-01",z:"W1L",a:"R61",l:48.0,w:54.0,h:107.5,v:250776.0,c:"R61L",pf:"1100012580",t:"I"},
  {id:"R62-B5-01",z:"W1H",a:"R62",l:48.0,w:54.0,h:51.5,v:120139.2,c:"R62H",pf:"1100010260",t:"I"},
  {id:"R62-D5-01",z:"W1H",a:"R62",l:48.0,w:54.0,h:51.5,v:120139.2,c:"R62H",pf:"1100010420",t:"I"},
  {id:"R63-H1-02",z:"W1L",a:"R63",l:48.0,w:54.0,h:107.5,v:250776.0,c:"R63L",pf:"1100009740",t:"I"},
  {id:"R63-B7-01",z:"W1H",a:"R63",l:48.0,w:54.0,h:47.5,v:110808.0,c:"R63H",pf:"1100010190",t:"I"},
  {id:"R64-K9-01",z:"W1H",a:"R64",l:48.0,w:54.0,h:72.0,v:167961.6,c:"R64H",pf:"1100008520",t:"I"},
  {id:"R64-K9-02",z:"W1H",a:"R64",l:48.0,w:54.0,h:72.0,v:167961.6,c:"R64H",pf:"1100008530",t:"I"},
  {id:"R65-F01-01",z:"W1L",a:"R65",l:48.0,w:42.0,h:44.0,v:88704.0,c:"R65L",pf:"1099999300",t:"I"},
  {id:"R65-F01-02",z:"W1L",a:"R65",l:48.0,w:42.0,h:44.0,v:88704.0,c:"R65L",pf:"1099999300",t:"I"}
];

const BD = { "181": D181, "1550": D1550 };

const CLS181=[
  {id:"SDOOR",d:"SHOWER DOORS/TALL",a:["W00"]},{id:"W00F",d:"W00 FLOOR",a:["W00"]},{id:"W00T",d:"W00 TOP",a:["W00"]},
  {id:"W01F",d:"W01 FLOOR",a:["W01"]},{id:"W01H",d:"W01 HIGH",a:["W01"]},{id:"W01T",d:"W01 TOP",a:["W01"]},
  {id:"W02F",d:"W02 FLOOR",a:["W02"]},{id:"W02L",d:"W02 LOW",a:["W02"]},{id:"W02H",d:"W02 HIGH",a:["W02"]},{id:"W02T",d:"W02 TOP",a:["W02"]},
  {id:"W03TT",d:"W03 TRIPLE TOTE",a:["W03"]},{id:"W03L",d:"W03 LOW",a:["W03"]},{id:"W03F",d:"W03 FLOOR",a:["W03"]},{id:"W03H",d:"W03 HIGH",a:["W03"]},{id:"W03T",d:"W03 TOP",a:["W03"]},
  {id:"W04",d:"W04 LOCATIONS",a:["W04"]},{id:"W04T",d:"W04 TOP",a:["W04"]},
  {id:"W05",d:"W05 LOCATIONS",a:["W05"]},{id:"W05T",d:"W05 TOP",a:["W05"]},
  {id:"W06F",d:"W06 FLOOR",a:["W06"]},{id:"W06H",d:"W06 HIGH",a:["W06"]},
  {id:"W07F",d:"W07 FLOOR",a:["W07"]},{id:"W07H",d:"W07 HIGH",a:["W07"]},
  {id:"W08",d:"W08 LOCATIONS",a:["W08"]},{id:"W08T",d:"W08 TOP",a:["W08"]},
  {id:"W09F",d:"W09 FLOOR",a:["W09"]},{id:"W09H",d:"W09 HIGH",a:["W09"]},
  {id:"W10F",d:"W10 FLOOR",a:["W10"]},{id:"W10H",d:"W10 HIGH",a:["W10"]},{id:"W10T",d:"W10 TOP",a:["W10"]},
  {id:"WP11",d:"CANTILEVER",a:["WP11","WP01","SR01"]},{id:"WP11_SM",d:"SHEET METAL",a:["WP11","WP01","SR01"]},
];
// 1550 classes - 171 from T_CLASS_LOCA + XC_PICK
const CLS1550=[
  {id:"BBULK",d:"BBULK",a:["BBU"]},
  {id:"BR01H",d:"BR01H",a:["BR0"]},
  {id:"BR01L",d:"BR01L",a:["BR0"]},
  {id:"BR02H",d:"BR02H",a:["BR0"]},
  {id:"BR02L",d:"BR02L",a:["BR0"]},
  {id:"BR03H",d:"BR03H",a:["BR0"]},
  {id:"BR03L",d:"BR03L",a:["BR0"]},
  {id:"BR04H",d:"BR04H",a:["BR0"]},
  {id:"BR04L",d:"BR04L",a:["BR0"]},
  {id:"BR05H",d:"BR05H",a:["BR0"]},
  {id:"BR05L",d:"BR05L",a:["BR0"]},
  {id:"BR07L",d:"BR07L",a:["BR07"]},
  {id:"BR08H",d:"BR08H",a:["BR08"]},
  {id:"BR08L",d:"BR08L",a:["BR07","BR08"]},
  {id:"BULK1",d:"BULK1",a:["B00","B01","BLU","CAR"]},
  {id:"BULK10",d:"BULK10",a:["B10","DEF","DEN","P02","P03"]},
  {id:"BULK11",d:"BULK11",a:["B11"]},
  {id:"BULK12",d:"BULK12",a:["B12"]},
  {id:"BULK13",d:"BULK13",a:["B13"]},
  {id:"BULK14",d:"BULK14",a:["B14"]},
  {id:"BULK2",d:"BULK2",a:["B02","WP7"]},
  {id:"BULK3",d:"BULK3",a:["B03"]},
  {id:"BULK4",d:"BULK4",a:["B04"]},
  {id:"BULK5",d:"BULK5",a:["B05"]},
  {id:"BULK6",d:"BULK6",a:["B06"]},
  {id:"BULK7",d:"BULK7",a:["B07","MAP","SOI"]},
  {id:"BULK8",d:"BULK8",a:["B08","BTR","WCL"]},
  {id:"BULK9",d:"BULK9",a:["B09"]},
  {id:"CAPS",d:"CAPS",a:["CAP"]},
  {id:"CC01",d:"CC01",a:["CC01"]},
  {id:"FEES",d:"FEES",a:["FEE","LTC"]},
  {id:"H01F",d:"H01F",a:["H01"]},
  {id:"H01H",d:"H01H",a:["H01"]},
  {id:"H01L",d:"H01L",a:["H01"]},
  {id:"H02F",d:"H02F",a:["H02"]},
  {id:"H02H",d:"H02H",a:["H02"]},
  {id:"H02L",d:"H02L",a:["H02"]},
  {id:"H03F",d:"H03F",a:["H03"]},
  {id:"H03H",d:"H03H",a:["H03"]},
  {id:"H03L",d:"H03L",a:["H03"]},
  {id:"H04F",d:"H04F",a:["H04"]},
  {id:"H04H",d:"H04H",a:["H04"]},
  {id:"H04L",d:"H04L",a:["H04"]},
  {id:"HAZ1",d:"HAZ1",a:["H03","H04"]},
  {id:"HAZ11",d:"HAZ11",a:["H03"]},
  {id:"HAZ2",d:"HAZ2",a:["H03","H04"]},
  {id:"HAZ3",d:"HAZ3",a:["CC01","H01","H02"]},
  {id:"HAZ4",d:"HAZ4",a:["CC01","H01","H02","R00"]},
  {id:"HAZ5",d:"HAZ5",a:["H04"]},
  {id:"HAZ6",d:"HAZ6",a:["BR-"]},
  {id:"HAZ7",d:"HAZ7",a:["BR-","H01","H02"]},
  {id:"HAZ8",d:"HAZ8",a:["BR-","H03","H04"]},
  {id:"INSUL",d:"INSUL",a:["R23"]},
  {id:"R00H",d:"R00H",a:["R00"]},
  {id:"R00L",d:"R00L",a:["R00"]},
  {id:"R01H",d:"R01H",a:["R01"]},
  {id:"R01L",d:"R01L",a:["R01"]},
  {id:"R02H",d:"R02H",a:["R02"]},
  {id:"R02L",d:"R02L",a:["R02"]},
  {id:"R03H",d:"R03H",a:["R03"]},
  {id:"R03L",d:"R03L",a:["R03"]},
  {id:"R04H",d:"R04H",a:["R04"]},
  {id:"R04L",d:"R04L",a:["R04"]},
  {id:"R05H",d:"R05H",a:["R05"]},
  {id:"R05L",d:"R05L",a:["R05"]},
  {id:"R06H",d:"R06H",a:["R06"]},
  {id:"R06L",d:"R06L",a:["R06"]},
  {id:"R07H",d:"R07H",a:["R07"]},
  {id:"R07L",d:"R07L",a:["R07"]},
  {id:"R08H",d:"R08H",a:["R08"]},
  {id:"R08L",d:"R08L",a:["R08"]},
  {id:"R09H",d:"R09H",a:["R09"]},
  {id:"R09L",d:"R09L",a:["R09"]},
  {id:"R10H",d:"R10H",a:["R10"]},
  {id:"R10L",d:"R10L",a:["R10"]},
  {id:"R11H",d:"R11H",a:["R11"]},
  {id:"R11L",d:"R11L",a:["R11"]},
  {id:"R12H",d:"R12H",a:["R12"]},
  {id:"R12L",d:"R12L",a:["R12"]},
  {id:"R13H",d:"R13H",a:["R13"]},
  {id:"R13L",d:"R13L",a:["R13"]},
  {id:"R14H",d:"R14H",a:["R14"]},
  {id:"R14L",d:"R14L",a:["R14"]},
  {id:"R15H",d:"R15H",a:["R15"]},
  {id:"R15L",d:"R15L",a:["R15"]},
  {id:"R16H",d:"R16H",a:["R16"]},
  {id:"R16L",d:"R16L",a:["R16"]},
  {id:"R17H",d:"R17H",a:["R17"]},
  {id:"R17L",d:"R17L",a:["R17"]},
  {id:"R18H",d:"R18H",a:["R18"]},
  {id:"R18L",d:"R18L",a:["R18"]},
  {id:"R19H",d:"R19H",a:["R19"]},
  {id:"R19L",d:"R19L",a:["R19"]},
  {id:"R20H",d:"R20H",a:["R20"]},
  {id:"R20L",d:"R20L",a:["R20"]},
  {id:"R21H",d:"R21H",a:["R21"]},
  {id:"R21L",d:"R21L",a:["R21"]},
  {id:"R22H",d:"R22H",a:["R22"]},
  {id:"R22L",d:"R22L",a:["R22"]},
  {id:"R23AH",d:"R23AH",a:["R23A"]},
  {id:"R23AL",d:"R23AL",a:["R23A"]},
  {id:"R23H",d:"R23H",a:["R23"]},
  {id:"R23L",d:"R23L",a:["R23"]},
  {id:"R24H",d:"R24H",a:["R24"]},
  {id:"R24L",d:"R24L",a:["R24"]},
  {id:"R25H",d:"R25H",a:["R25"]},
  {id:"R25L",d:"R25L",a:["R25"]},
  {id:"R26H",d:"R26H",a:["R26"]},
  {id:"R26L",d:"R26L",a:["R26"]},
  {id:"R27H",d:"R27H",a:["R27"]},
  {id:"R27L",d:"R27L",a:["R27"]},
  {id:"R49H",d:"R49H",a:["R49"]},
  {id:"R49L",d:"R49L",a:["R49"]},
  {id:"R50H",d:"R50H",a:["R50"]},
  {id:"R50L",d:"R50L",a:["R50"]},
  {id:"R51H",d:"R51H",a:["R51"]},
  {id:"R51L",d:"R51L",a:["R51"]},
  {id:"R52H",d:"R52H",a:["R52"]},
  {id:"R52L",d:"R52L",a:["R52"]},
  {id:"R53H",d:"R53H",a:["R53"]},
  {id:"R53L",d:"R53L",a:["R53"]},
  {id:"R54H",d:"R54H",a:["R54"]},
  {id:"R54L",d:"R54L",a:["R54"]},
  {id:"R55H",d:"R55H",a:["R55"]},
  {id:"R55L",d:"R55L",a:["R55"]},
  {id:"R56-5/7",d:"R56-5/7",a:["R56"]},
  {id:"R56H",d:"R56H",a:["R56"]},
  {id:"R56L",d:"R56L",a:["R56"]},
  {id:"R57-5/7",d:"R57-5/7",a:["R57"]},
  {id:"R57H",d:"R57H",a:["R57"]},
  {id:"R57L",d:"R57L",a:["R57"]},
  {id:"R58H",d:"R58H",a:["R58"]},
  {id:"R58L",d:"R58L",a:["R58"]},
  {id:"R59H",d:"R59H",a:["R59"]},
  {id:"R59L",d:"R59L",a:["R59"]},
  {id:"R60H",d:"R60H",a:["R60"]},
  {id:"R60L",d:"R60L",a:["R60"]},
  {id:"R61H",d:"R61H",a:["R61"]},
  {id:"R61L",d:"R61L",a:["R61"]},
  {id:"R62H",d:"R62H",a:["R62"]},
  {id:"R62L",d:"R62L",a:["R62"]},
  {id:"R63H",d:"R63H",a:["R63"]},
  {id:"R63L",d:"R63L",a:["R63"]},
  {id:"R64H",d:"R64H",a:["R64"]},
  {id:"R64L",d:"R64L",a:["R64"]},
  {id:"R65H",d:"R65H",a:["R65"]},
  {id:"R65L",d:"R65L",a:["R65"]},
  {id:"SP",d:"SP",a:[""]},
  {id:"ST",d:"ST",a:[""]},
  {id:"TEMPLOC",d:"TEMPLOC",a:["PLD","REN","TEM"]},
  {id:"WC",d:"WC",a:["WC1","XCT","XW1"]},
  {id:"WP23",d:"WP23",a:["WP23"]},
  {id:"WP23TOP",d:"WP23TOP",a:["WP23"]},
  {id:"WP24",d:"WP24",a:["WP24"]},
  {id:"WP24TOP",d:"WP24TOP",a:["WP24"]},
  {id:"WP25",d:"WP25",a:["WP2","WP25"]},
  {id:"WP25TOP",d:"WP25TOP",a:["WP25"]},
  {id:"WP26",d:"WP26",a:["WP2"]},
  {id:"WP27",d:"WP27",a:["JPI","WP2"]},
  {id:"WP28",d:"WP28",a:["WP2"]},
  {id:"WP28F",d:"WP28F",a:["WP2"]},
  {id:"WP67",d:"WP67",a:["WP67"]},
  {id:"WP67TOP",d:"WP67TOP",a:["WP67"]},
  {id:"WP68",d:"WP68",a:["WP68"]},
  {id:"WP68TOP",d:"WP68TOP",a:["WP68"]},
  {id:"WP69",d:"WP69",a:["WP6"]},
  {id:"WP70",d:"WP70",a:["WP7"]},
  {id:"WP70C",d:"WP70C",a:["WP7"]},
  {id:"WP71",d:"WP71",a:["WP7"]},
  {id:"WP72",d:"WP72",a:["WP7"]},
  {id:"XC_PICK",d:"XC PICK LOCATIONS",a:["X00","X01","X02","X03","X04","X05","X06","X07","X08","X09","X10","X11","X12","X13","X14","X15","X16","X17","X18","X19","X20","X21","X22","X23","X24","XW1","XW2","XW3","XW4","XCT","XCAB","WC1","HOT","MILW","CTR"]}
];
const BCLS = { "181": CLS181, "1550": CLS1550 };

const LT=[{c:"I",d:"Single Item"},{c:"M",d:"Multi-Item"},{c:"P",d:"Pick Location"},{c:"S",d:"Staging/Special"},{c:"D",d:"Door"},{c:"F",d:"Floor/Special"},{c:"Q",d:"QC Location"},{c:"B",d:"Bulk"},{c:"X",d:"Cross-Dock"}];
const bk=id=>{const p=id.toUpperCase().trim().split("-");return p.length>=2?p[0]+"-"+p[1]:null;};
// Bin subdivision: W02-Q02-01A → base "W02-Q02-01", suffix "A"
const binBase=id=>{const p=id.toUpperCase().trim().split("-");if(p.length!==3)return null;const pos=p[2];const m=pos.match(/^(\d{1,2})([A-Z]+)$/);return m?p[0]+"-"+p[1]+"-"+m[1]:null;};
const isBin=id=>{const p=id.toUpperCase().trim().split("-");if(p.length!==3)return false;return/^\d{1,2}[A-Z]+$/.test(p[2]);};
const cv=(l,w,h)=>Math.round((parseFloat(l)||0)*(parseFloat(w)||0)*(parseFloat(h)||0));

// Validation - works for both 181 and 1550 naming patterns
const vld=(r,knownAisles)=>{
  if(!r?.trim())return{e:"Required",t:"err"};
  const s=r.toUpperCase().trim();
  const p=s.split("-");
  if(p.length<2)return{e:"Need at least AISLE-BAY format with dashes",t:"err"};
  if(p.length>3)return{e:"Too many parts - max is AISLE-BAY-POS",t:"err"};
  // Bay validation: 1-2 letters + 1-2 digits
  if(p.length>=2 && !/^[A-Z]{1,2}\d{1,3}$/.test(p[1]))return{e:"Bay '"+p[1]+"' invalid. Need 1-2 letters + 1-3 digits (B01, C4, AA1, Q11)",t:"err"};
  // Position validation (if 3 parts): 1-2 digits + optional letter
  if(p.length===3 && !/^\d{1,2}[A-Z]{0,2}$/.test(p[2]))return{e:"Position '"+p[2]+"' invalid. Need 1-2 digits + optional suffix",t:"err"};
  if(!knownAisles.includes(p[0]))return{e:"Aisle '"+p[0]+"' not in this branch. May be new.",t:"warn"};
  return{e:null,t:"ok"};
};

const font="'Segoe UI',system-ui,-apple-system,sans-serif";
const mono="'SF Mono','Fira Code','Courier New',monospace";
const inp={width:"100%",padding:"9px 11px",border:"1px solid #d1d5db",borderRadius:8,fontSize:14,fontFamily:mono,boxSizing:"border-box",background:"#fff",outline:"none"};
const card={background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:20,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"};

const F=({label,children,hint,error,warn})=>(
  <div style={{marginBottom:14}}>
    <div style={{fontSize:11,fontWeight:600,color:"#6b7280",marginBottom:5,fontFamily:font}}>{label}</div>
    {children}
    {hint&&!error&&!warn&&<div style={{fontSize:10,color:"#9ca3af",marginTop:3,fontFamily:font}}>{hint}</div>}
    {error&&<div style={{fontSize:10,color:"#ef4444",marginTop:3,fontWeight:600,fontFamily:font}}>{error}</div>}
    {warn&&!error&&<div style={{fontSize:10,color:"#f59e0b",marginTop:3,fontWeight:600,fontFamily:font}}>{warn}</div>}
  </div>
);

const Pill=({label,value,sub,isMono})=>(
  <div style={{flex:1,background:"#ecfdf5",border:"1px solid #a7f3d0",borderRadius:8,padding:"8px 10px"}}>
    <div style={{fontSize:9,fontWeight:700,color:"#047857",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:font}}>{label}</div>
    <div style={{fontSize:isMono?12:16,fontWeight:800,color:"#065f46",fontFamily:isMono?mono:font,marginTop:2}}>{value||"-"}</div>
    {sub&&<div style={{fontSize:9,color:"#059669",fontFamily:font}}>{sub}</div>}
  </div>
);

export default function App(){
  const[branch,setBranch]=useState("181");
  const[locs,setLocs]=useState(BD["181"]);
  const[tab,setTab]=useState("create");
  const[mode,setMode]=useState("single");
  const[locId,setLocId]=useState("");
  const[rPfx,setRPfx]=useState("");
  const[rStart,setRStart]=useState("");
  const[rEnd,setREnd]=useState("");
  const[cls,setCls]=useState("");
  const[len,setLen]=useState("");
  const[wid,setWid]=useState("");
  const[hgt,setHgt]=useState("");
  const[lt,setLt]=useState("I");
  const[mZ,setMZ]=useState("");
  const[mP,setMP]=useState("");
  const[ovr,setOvr]=useState(false);
  const[err,setErr]=useState({});
  const[res,setRes]=useState(null);
  const[flt,setFlt]=useState("");
  const[applied,setApplied]=useState(false);

  const BR=branch;
  const allCls=BCLS[branch]||[];
  const knownAisles=useMemo(()=>[...new Set(locs.map(l=>l.a).filter(Boolean))].sort(),[locs]);

  const switchBranch=(b)=>{setBranch(b);setLocs(BD[b]||[]);setLocId("");setCls("");setLen("");setWid("");setHgt("");setLt("I");setMZ("");setMP("");setOvr(false);setErr({});setRes(null);setApplied(false);setFlt("");};

  const up=locId.toUpperCase().trim();
  const ar=(up.split("-")[0])||"";
  const aisle=knownAisles.includes(ar)?ar:null;
  const val=locId.length>0?vld(locId,knownAisles):null;
  const dup=up&&locs.find(l=>l.id===up);
  const unk=val?.t==="warn";
  const beam=up.length>3?bk(up):null;
  const nbrs=useMemo(()=>beam?locs.filter(l=>bk(l.id)===beam):[],[beam,locs]);
  const hasN=nbrs.length>0;
  const sZ=hasN?nbrs[0].z:null;
  const sPf=hasN?nbrs[0].pf:"";
  const sC=hasN?nbrs[0].c:"";
  const sT=hasN?nbrs[0].t:"I";
  const zone=ovr?mZ:(sZ||"");
  const pf=ovr?mP:(sPf||"");
  // Bin subdivision detection (01A, 01B, 01C = dividers splitting LENGTH)
  const isBinLoc=isBin(up);
  const bBase=isBinLoc?binBase(up):null;
  const binNbrs=useMemo(()=>bBase?locs.filter(l=>binBase(l.id)===bBase):[],[bBase,locs]);
  const hasBin=binNbrs.length>0;
  const binTotalLen=hasBin?binNbrs.reduce((s,l)=>s+l.l,0):null;
  const binCount=binNbrs.length+1;
  const newLen=binTotalLen?Math.round(binTotalLen/binCount*100)/100:null;
  // Beam width recalc (skip for bin subdivisions - they only change length)
  const btw=hasN&&!isBinLoc?nbrs.reduce((s,l)=>s+l.w,0):null;
  const npc=nbrs.length+1;
  const nw=btw?Math.round(btw/npc*100)/100:null;
  const fCls=aisle?allCls.filter(c=>c.a.includes(aisle)||c.a.length===0):allCls;

  const prev=useRef(null);
  useEffect(()=>{
    if(beam&&beam!==prev.current&&!applied&&hasN){
      setCls(sC);setLt(sT);setLen(String(newLen||nbrs[0].l));setWid(String(nw||nbrs[0].w));setHgt(String(nbrs[0].h));setApplied(true);
    } else if(bBase&&bBase!==prev.current&&!applied&&hasBin){
      const b=binNbrs[0];setCls(b.c);setLt(b.t);setLen(String(newLen||b.l));setWid(String(b.w));setHgt(String(b.h));setApplied(true);
    }
    prev.current=beam||bBase;
  },[beam,bBase,hasN,hasBin]);

  const rIds=useMemo(()=>{
    if(mode!=="range"||!rPfx||!rStart||!rEnd)return[];
    const s=parseInt(rStart),e=parseInt(rEnd);
    if(isNaN(s)||isNaN(e)||s>e||e-s>50)return[];
    return Array.from({length:e-s+1},(_,i)=>rPfx.toUpperCase().trim()+"-"+String(s+i).padStart(2,"0"));
  },[mode,rPfx,rStart,rEnd]);
  const rValid=useMemo(()=>rIds.map(id=>({id,ok:!locs.find(l=>l.id===id)&&vld(id,knownAisles).t!=="err",dup:!!locs.find(l=>l.id===id)})),[rIds,locs,knownAisles]);

  const reset=()=>{setLocId("");setCls("");setLen("");setWid("");setHgt("");setLt("I");setMZ("");setMP("");setOvr(false);setErr({});setApplied(false);setRPfx("");setRStart("");setREnd("");};

  const doSingle=()=>{
    const e={};if(val?.t==="err")e.locId=val.e;else if(dup)e.locId="Duplicate";else if(unk&&!ovr)e.locId="Confirm new aisle";
    if(!cls)e.cls="Required";setErr(e);if(Object.keys(e).length>0)return;
    const fL=newLen||parseFloat(len)||0,fW=nw||parseFloat(wid)||0,fH=parseFloat(hgt)||0;
    // Apply beam width recalc
    let updated=locs.map(loc=>btw&&bk(loc.id)===beam?{...loc,w:nw,v:cv(loc.l,nw,loc.h)}:loc);
    // Apply bin length recalc
    updated=updated.map(loc=>binTotalLen&&binBase(loc.id)===bBase?{...loc,l:newLen,v:cv(newLen,loc.w,loc.h)}:loc);
    const nl={id:up,z:zone||"UNKNOWN",a:ar,l:fL,w:fW,h:fH,v:cv(fL,fW,fH),c:cls,pf:pf||"0",t:lt};
    setLocs([...updated,nl]);
    setRes({
      nl,
      bu:btw?nbrs.map(n=>({id:n.id,ow:n.w,nw,ov:n.v,nv:cv(n.l,nw,n.h)})):[],
      binU:binTotalLen?binNbrs.map(n=>({id:n.id,ol:n.l,nl:newLen,ov:n.v,nv:cv(newLen,n.w,n.h)})):[],
    });
    reset();
  };

  const doBulk=()=>{
    const ok=rValid.filter(r=>r.ok);if(!ok.length||!cls)return;
    const a=(rPfx.toUpperCase().trim().split("-")[0])||"";
    const z=sZ||mZ||"UNKNOWN";const p=sPf||mP||"0";
    const fL=parseFloat(len)||0,fW=parseFloat(wid)||0,fH=parseFloat(hgt)||0;
    const nl=ok.map(r=>({id:r.id,z,a,l:fL,w:fW,h:fH,v:cv(fL,fW,fH),c:cls,pf:p,t:lt}));
    setLocs(prev=>[...prev,...nl]);setRes({bulk:nl});reset();
  };

  const sql=()=>{
    if(!res)return"";const items=res.bulk||[res.nl];
    let s="-- LOCATION CREATE - WH_ID "+BR+"\n\n";
    items.forEach(n=>{
      s+="INSERT INTO T_LOCATION (WH_ID,LOCATION_ID,DESCRIPTION,STATUS,ZONE,PICKING_FLOW,CAPACITY_UOM,TYPE,CAPACITY_VOLUME,LENGTH,WIDTH,HEIGHT,PICK_AREA,ALLOW_BULK_PICK,HU_ITEM_TYPE,CC_FLAG,ALLOW_OVERPICK,LP_CAPACITY,CAROUSEL_LOC,AISLE,LOCATION_CATEGORY,RESERVE_PUT_LOC)\n";
      s+="VALUES ('"+BR+"','"+n.id+"','"+n.id+"','E','"+n.z+"','"+n.pf+"','EA','"+n.t+"',"+n.v+","+n.l+","+n.w+","+n.h+",'UNITS','NO','I','Y','N',"+(n.t==="M"?9999:1)+",'N','"+n.a+"','NONE','N');\n\n";
      s+="INSERT INTO T_CLASS_LOCA (WH_ID,CLASS_ID,LOCATION_ID,FILL_SEQ)\nVALUES ('"+BR+"','"+n.c+"','"+n.id+"','N');\n\n";
    });
    if(res.bu?.length){s+="-- BEAM WIDTH RECALC\n";res.bu.forEach(u=>{s+="UPDATE T_LOCATION SET WIDTH="+u.nw+",CAPACITY_VOLUME="+u.nv+" WHERE WH_ID='"+BR+"' AND LOCATION_ID='"+u.id+"'; -- was W="+u.ow+"\n";});}
    if(res.binU?.length){s+="\n-- BIN DIVIDER LENGTH RECALC\n";res.binU.forEach(u=>{s+="UPDATE T_LOCATION SET LENGTH="+u.nl+",CAPACITY_VOLUME="+u.nv+" WHERE WH_ID='"+BR+"' AND LOCATION_ID='"+u.id+"'; -- was L="+u.ol+"\n";});}
    return s;
  };

  const fl=useMemo(()=>{const sorted=[...locs].sort((a,b)=>a.id.localeCompare(b.id));if(!flt)return sorted;const f=flt.toUpperCase();return sorted.filter(l=>l.id.includes(f)||l.z.includes(f)||l.a.includes(f)||l.c.includes(f));},[locs,flt]);
  const bdr=up.length<=3?"#d1d5db":dup?"#ef4444":val?.t==="err"?"#ef4444":unk?"#f59e0b":"#10b981";
  const bgc=up.length<=3?"#fff":dup||val?.t==="err"?"#fef2f2":unk?"#fffbeb":"#ecfdf5";
  const canS=locId&&!dup&&val?.t!=="err"&&!(unk&&!ovr);
  const dv=cv(newLen||len||(hasN?nbrs[0].l:hasBin?binNbrs[0].l:0),nw||wid||(hasN?nbrs[0].w:hasBin?binNbrs[0].w:0),hgt||(hasN?nbrs[0].h:hasBin?binNbrs[0].h:0));

  return(
    <div style={{maxWidth:1040,margin:"0 auto",padding:"16px 20px",color:"#111827",fontFamily:font,background:"#f9fafb",minHeight:"100vh"}}>
      {/* Sticky Header */}
      <div style={{position:"sticky",top:0,zIndex:10,background:"#f9fafb",paddingTop:4,paddingBottom:4}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:12,paddingBottom:12,borderBottom:"1px solid #e5e7eb",flexWrap:"wrap"}}>
        <div style={{width:44,height:44,background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:900,fontSize:18,flexShrink:0}}>K1</div>
        <div style={{flex:1,minWidth:200}}>
          <h1 style={{margin:0,fontSize:22,fontWeight:800,color:"#0f172a",letterSpacing:"-0.02em"}}>Korber One Location Manager</h1>
          <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>Simulation - <strong>{locs.length}</strong> locations loaded</div>
        </div>
        <div>
          <div style={{fontSize:10,fontWeight:700,color:"#6b7280",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:3,textAlign:"right"}}>Warehouse</div>
          <select value={branch} onChange={e=>switchBranch(e.target.value)} style={{padding:"9px 14px",border:"2px solid #1e3a5f",borderRadius:8,fontSize:14,fontWeight:700,fontFamily:font,background:"#fff",cursor:"pointer",color:"#1e3a5f",minWidth:240}}>
            {BRANCHES.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:2,marginBottom:20,background:"#e5e7eb",borderRadius:10,padding:3}}>
        {[["create","Create Location"],["browse","Browse All"],["guide","How It Works"]].map(([n,lb])=>(
          <button key={n} onClick={()=>{setTab(n);setRes(null);}} style={{flex:1,padding:"9px 0",border:"none",borderRadius:8,background:tab===n?"#fff":"transparent",color:tab===n?"#1e3a5f":"#6b7280",fontWeight:tab===n?700:500,fontSize:13,cursor:"pointer",fontFamily:font,boxShadow:tab===n?"0 1px 2px rgba(0,0,0,0.06)":"none"}}>{lb}</button>
        ))}
      </div>
      </div>{/* end sticky */}

      {/* CREATE */}
      {tab==="create"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <div style={{fontSize:16,fontWeight:700}}>New Location <span style={{fontSize:12,color:"#6b7280",fontWeight:500}}>WH {BR}</span></div>
            <div style={{display:"flex",background:"#f3f4f6",borderRadius:8,padding:2}}>
              {[["single","Single"],["range","Range"]].map(([m,lb])=>(
                <button key={m} onClick={()=>{setMode(m);setRes(null);}} style={{padding:"5px 16px",border:"none",borderRadius:6,background:mode===m?"#1e3a5f":"transparent",color:mode===m?"#fff":"#6b7280",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:font}}>{lb}</button>
              ))}
            </div>
          </div>

          {mode==="single"&&<>
            <F label="LOCATION ID" error={dup?"DUPLICATE - already exists in WH "+BR:(up.length>3&&val?.t==="err"?val.e:err.locId)} warn={up.length>3&&unk&&!ovr?val.e:null} hint={"Known aisles: "+knownAisles.join(", ")}>
              <input style={{...inp,fontSize:18,fontWeight:700,letterSpacing:"0.03em",borderColor:bdr,background:bgc}} value={locId} placeholder="Enter location ID" onChange={e=>{setLocId(e.target.value.toUpperCase());setErr({});setRes(null);setApplied(false);}}/>
            </F>

            {unk&&<div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:10,padding:12,marginBottom:14}}>
              <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,fontWeight:600,color:"#92400e",cursor:"pointer"}}><input type="checkbox" checked={ovr} onChange={e=>setOvr(e.target.checked)}/> New aisle - set zone and pick flow manually</label>
              {ovr&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
                <F label="Zone"><input style={inp} value={mZ} placeholder="Zone code" onChange={e=>setMZ(e.target.value.toUpperCase())}/></F>
                <F label="Pick Flow"><input style={inp} value={mP} placeholder="0000000000" onChange={e=>setMP(e.target.value)}/></F>
              </div>}
            </div>}

            {up.length>3&&!dup&&(val?.t==="ok"||(unk&&ovr))&&<div style={{display:"flex",gap:8,marginBottom:14}}>
              <Pill label="Zone" value={zone} sub={hasN?"from beam":null}/>
              <Pill label="Pick Flow" value={pf} sub={hasN?"from beam":null} isMono/>
              <Pill label="Aisle" value={ar}/>
            </div>}

            {hasN&&!isBinLoc&&!dup&&(val?.t==="ok"||(unk&&ovr))&&<div style={{background:"#eff6ff",border:"1px solid #93c5fd",borderRadius:10,padding:14,marginBottom:14}}>
              <div style={{fontWeight:700,color:"#1e40af",fontSize:13,marginBottom:6}}>Beam: {beam} ({nbrs.length} existing)</div>
              <div style={{fontSize:12,color:"#334155",marginBottom:4}}>Class: <strong>{nbrs[0].c}</strong> - Type: <strong>{nbrs[0].t}</strong> - PF: <strong style={{fontFamily:mono,fontSize:11}}>{nbrs[0].pf}</strong></div>
              {btw>0&&<div style={{background:"#dbeafe",borderRadius:8,padding:10,marginTop:8}}>
                <div style={{fontWeight:700,color:"#1e40af",fontSize:12,marginBottom:4}}>Width Recalculation</div>
                <div style={{fontSize:12}}>Current: {nbrs.length} pos @ {nbrs[0].w}in ({nbrs[0].v.toLocaleString()} cu in)</div>
                <div style={{fontSize:12}}>After: {npc} pos @ <strong>{nw}in</strong> (<strong>{cv(nbrs[0].l,nw,nbrs[0].h).toLocaleString()}</strong> cu in)</div>
                <div style={{color:"#dc2626",fontWeight:700,fontSize:11,marginTop:4}}>{nbrs.length} existing will update</div>
              </div>}
              <div style={{fontSize:11,color:"#059669",fontWeight:600,marginTop:6}}>Settings auto-applied from neighbors</div>
            </div>}

            {hasBin&&isBinLoc&&!dup&&(val?.t==="ok"||(unk&&ovr))&&<div style={{background:"#f5f3ff",border:"1px solid #c4b5fd",borderRadius:10,padding:14,marginBottom:14}}>
              <div style={{fontWeight:700,color:"#6d28d9",fontSize:13,marginBottom:6}}>Bin Subdivision: {bBase} ({binNbrs.length} existing)</div>
              <div style={{fontSize:12,color:"#334155",marginBottom:4}}>Existing: {binNbrs.map(n=>n.id).join(", ")}</div>
              {binTotalLen>0&&<div style={{background:"#ede9fe",borderRadius:8,padding:10,marginTop:8}}>
                <div style={{fontWeight:700,color:"#6d28d9",fontSize:12,marginBottom:4}}>Length Recalculation (dividers)</div>
                <div style={{fontSize:12}}>Current: {binNbrs.length} bin{binNbrs.length>1?"s":""} @ {binNbrs[0].l}in length ({binNbrs[0].v.toLocaleString()} cu in)</div>
                <div style={{fontSize:12}}>After: {binCount} bin{binCount>1?"s":""} @ <strong>{newLen}in</strong> length (<strong>{cv(newLen,binNbrs[0].w,binNbrs[0].h).toLocaleString()}</strong> cu in)</div>
                <div style={{color:"#7c3aed",fontWeight:700,fontSize:11,marginTop:4}}>{binNbrs.length} existing bin{binNbrs.length>1?"s":""} will update</div>
              </div>}
              <div style={{fontSize:11,color:"#7c3aed",fontWeight:600,marginTop:6}}>Settings auto-applied from bin neighbors</div>
            </div>}
          </>}

          {mode==="range"&&<>
            <F label="BEAM PREFIX" hint="e.g. R24-F3 creates R24-F3-01 through ..."><input style={{...inp,fontSize:16,fontWeight:700}} value={rPfx} placeholder="R24-F3" onChange={e=>setRPfx(e.target.value.toUpperCase())}/></F>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              <F label="START POS"><input style={inp} type="number" value={rStart} placeholder="01" onChange={e=>setRStart(e.target.value)}/></F>
              <F label="END POS"><input style={inp} type="number" value={rEnd} placeholder="06" onChange={e=>setREnd(e.target.value)}/></F>
            </div>
            {rIds.length>0&&<div style={{background:"#f3f4f6",borderRadius:8,padding:10,marginBottom:14,fontSize:12}}>
              <div style={{fontWeight:700,marginBottom:4}}>Preview ({rValid.filter(r=>r.ok).length} valid):</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{rValid.map(r=><span key={r.id} style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:mono,fontWeight:600,background:r.dup?"#fecaca":r.ok?"#d1fae5":"#e5e7eb",color:r.dup?"#dc2626":r.ok?"#065f46":"#6b7280"}}>{r.id}</span>)}</div>
            </div>}
            {!hasN&&rIds.length>0&&<div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:10,padding:14,marginBottom:14}}>
              <div style={{fontWeight:700,color:"#92400e",fontSize:12,marginBottom:8}}>No existing beam found — enter details manually</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                <F label="ZONE"><input style={inp} value={mZ} placeholder="Zone code (e.g. VNA, W1H)" onChange={e=>setMZ(e.target.value.toUpperCase())}/></F>
                <F label="PICK FLOW"><input style={inp} value={mP} placeholder="0000000000" onChange={e=>setMP(e.target.value)}/></F>
              </div>
            </div>}
          </>}

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <F label="CLASS" error={err.cls} hint={hasN&&sC!=="TBD"?"Matched: "+sC:""}>
              <select style={{...inp,cursor:"pointer",fontFamily:font}} value={cls} onChange={e=>setCls(e.target.value)}>
                <option value="">-- Select --</option>
                {fCls.map(c=><option key={c.id} value={c.id}>{c.id} - {c.d}</option>)}
                {hasN&&sC&&!fCls.find(c=>c.id===sC)&&<option value={sC}>{sC} (from beam)</option>}
              </select>
            </F>
            <F label="TYPE">
              <select style={{...inp,cursor:"pointer",fontFamily:font}} value={lt} onChange={e=>setLt(e.target.value)}>
                {LT.map(t=><option key={t.c} value={t.c}>{t.c} - {t.d}</option>)}
              </select>
            </F>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <F label="LENGTH"><input style={{...inp,background:binTotalLen&&binTotalLen>0?"#ede9fe":"#fff",fontWeight:binTotalLen&&binTotalLen>0?700:400}} type="number" value={binTotalLen&&binTotalLen>0?String(newLen):len} placeholder="0" onChange={e=>setLen(e.target.value)} disabled={binTotalLen&&binTotalLen>0}/></F>
            <F label="WIDTH"><input style={{...inp,background:btw&&btw>0?"#dbeafe":"#fff",fontWeight:btw&&btw>0?700:400}} type="number" value={btw&&btw>0?String(nw):wid} placeholder="0" onChange={e=>setWid(e.target.value)} disabled={btw&&btw>0}/></F>
            <F label="HEIGHT"><input style={inp} type="number" value={hgt} placeholder="0" onChange={e=>setHgt(e.target.value)}/></F>
          </div>

          <div style={{background:"#f3f4f6",borderRadius:8,padding:8,marginBottom:16,textAlign:"center"}}>
            <span style={{fontSize:11,color:"#6b7280"}}>Volume: </span>
            <span style={{fontSize:18,fontWeight:800,fontFamily:mono}}>{dv.toLocaleString()}</span>
            <span style={{fontSize:11,color:"#6b7280"}}> cu in</span>
          </div>

          <button onClick={mode==="single"?doSingle:doBulk} disabled={mode==="single"?!canS:(!rValid.filter(r=>r.ok).length||!cls)} style={{width:"100%",padding:"13px",background:(mode==="single"?canS:rValid.filter(r=>r.ok).length&&cls)?"linear-gradient(135deg,#1e3a5f,#2563eb)":"#d1d5db",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:(mode==="single"?canS:rValid.filter(r=>r.ok).length&&cls)?"pointer":"not-allowed",fontFamily:font}}>
            {mode==="range"?"Create "+rValid.filter(r=>r.ok).length+" Locations":(locId?(!canS?"Fix Errors":"Create Location"):"Enter Location ID")}
          </button>
        </div>

        {/* Right panel */}
        <div>
          {res&&<>
            <div style={{...card,border:"2px solid #10b981",marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <div style={{width:28,height:28,background:"#10b981",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:16,fontWeight:900}}>{"✓"}</div>
                <div style={{fontWeight:800,color:"#065f46",fontSize:17}}>{res.bulk?res.bulk.length+" Created":"Created"} in WH {BR}</div>
              </div>
              {res.nl&&<div style={{fontSize:13,color:"#065f46"}}><strong>{res.nl.id}</strong> - {res.nl.z} - {res.nl.c} - {res.nl.v.toLocaleString()} cu in</div>}
              {res.bulk&&<div style={{fontSize:12,color:"#065f46",marginTop:4}}>{res.bulk.map(n=>n.id).join(", ")}</div>}
              {res.bu?.length>0&&<div style={{marginTop:6,fontSize:12,color:"#b45309",fontWeight:600}}>{res.bu.length} beam location{res.bu.length>1?"s":""} updated (width)</div>}
              {res.binU?.length>0&&<div style={{marginTop:4,fontSize:12,color:"#7c3aed",fontWeight:600}}>{res.binU.length} bin location{res.binU.length>1?"s":""} updated (length)</div>}
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <span style={{fontSize:12,fontWeight:700,color:"#6b7280",textTransform:"uppercase"}}>SQL Output</span>
              <button onClick={()=>navigator.clipboard?.writeText(sql())} style={{padding:"5px 12px",background:"#f3f4f6",border:"1px solid #d1d5db",borderRadius:6,fontSize:11,cursor:"pointer",fontWeight:600,fontFamily:font}}>Copy SQL</button>
            </div>
            <pre style={{background:"#111827",color:"#d1d5db",padding:16,borderRadius:10,fontSize:11,lineHeight:1.6,overflow:"auto",whiteSpace:"pre-wrap",fontFamily:mono,maxHeight:400}}>{sql()}</pre>
          </>}
          {!res&&<div style={card}>
            <div style={{fontSize:14,fontWeight:700,marginBottom:14}}>Validation Rules</div>
            {[
              {i:"X",bg:"#fef2f2",ic:"#ef4444",code:"W10-D2-07",msg:"Bay needs LETTER + 2 digits (try D02)"},
              {i:"X",bg:"#fef2f2",ic:"#ef4444",code:"W10D0207",msg:"Must use dashes between parts"},
              {i:"!",bg:"#fffbeb",ic:"#f59e0b",code:"Z99-A01-01",msg:"Unknown aisle for this branch (override available)"},
              {i:"\u2713",bg:"#ecfdf5",ic:"#10b981",code:"W10-Q01-03",msg:"Valid - beam detected, auto-populates from neighbors"},
              {i:"\u2713",bg:"#ecfdf5",ic:"#10b981",code:"CC01-C4-04",msg:"Valid - different format per branch (1550)"},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 10px",background:r.bg,borderRadius:8,marginBottom:4}}>
                <div style={{width:20,height:20,borderRadius:5,background:r.ic,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:900,flexShrink:0}}>{r.i}</div>
                <div><code style={{fontSize:12,fontWeight:700,fontFamily:mono}}>{r.code}</code><div style={{fontSize:11,color:"#4b5563",marginTop:2}}>{r.msg}</div></div>
              </div>
            ))}
            <div style={{marginTop:14,background:"#eff6ff",borderRadius:8,padding:12,fontSize:12,color:"#1e40af"}}>
              <strong>Branch-Scoped:</strong> Each warehouse has its own locations, classes, zones, and aisles. Switching branches loads that warehouse's data. SQL output always includes the selected WH_ID.
            </div>
          </div>}
        </div>
      </div>}

      {/* BROWSE */}
      {tab==="browse"&&<div style={card}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
          <input style={{...inp,maxWidth:340,fontFamily:font}} placeholder="Search location, zone, aisle, class..." value={flt} onChange={e=>setFlt(e.target.value)}/>
          <div style={{fontSize:12,color:"#6b7280"}}><strong>WH {BR}</strong> - {fl.length} results</div>
        </div>
        <div style={{overflowX:"auto",borderRadius:8,border:"1px solid #e5e7eb"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:"#f9fafb"}}>
              {["WH","Location","Zone","Aisle","Class","Type","L","W","H","Volume"].map(h=><th key={h} style={{padding:"10px 10px",textAlign:"left",fontWeight:700,color:"#374151",borderBottom:"2px solid #e5e7eb",whiteSpace:"nowrap",fontFamily:font}}>{h}</th>)}
            </tr></thead>
            <tbody>{fl.map((l,i)=>(
              <tr key={l.id} style={{background:i%2===0?"#fff":"#f9fafb"}} onMouseEnter={e=>e.currentTarget.style.background="#f0f9ff"} onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"#fff":"#f9fafb"}>
                <td style={{padding:"8px 10px",fontWeight:700,fontFamily:mono,borderBottom:"1px solid #f3f4f6",color:"#1e3a5f"}}>{BR}</td>
                <td style={{padding:"8px 10px",fontWeight:700,fontFamily:mono,borderBottom:"1px solid #f3f4f6"}}>{l.id}</td>
                <td style={{padding:"8px 10px",borderBottom:"1px solid #f3f4f6"}}><span style={{background:"#e0f2fe",color:"#0369a1",padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600}}>{l.z}</span></td>
                <td style={{padding:"8px 10px",borderBottom:"1px solid #f3f4f6"}}>{l.a}</td>
                <td style={{padding:"8px 10px",fontFamily:mono,fontSize:11,borderBottom:"1px solid #f3f4f6"}}>{l.c}</td>
                <td style={{padding:"8px 10px",borderBottom:"1px solid #f3f4f6"}}>{l.t}</td>
                <td style={{padding:"8px 10px",fontFamily:mono,textAlign:"right",borderBottom:"1px solid #f3f4f6"}}>{l.l}</td>
                <td style={{padding:"8px 10px",fontFamily:mono,textAlign:"right",borderBottom:"1px solid #f3f4f6"}}>{l.w}</td>
                <td style={{padding:"8px 10px",fontFamily:mono,textAlign:"right",borderBottom:"1px solid #f3f4f6"}}>{l.h}</td>
                <td style={{padding:"8px 10px",fontFamily:mono,textAlign:"right",fontWeight:600,borderBottom:"1px solid #f3f4f6"}}>{l.v.toLocaleString()}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>}

      {/* GUIDE */}
      {tab==="guide"&&<div style={{...card,maxWidth:660}}>
        <h3 style={{margin:"0 0 20px",fontSize:18,fontWeight:800}}>How This Tool Works</h3>
        {[
          {title:"What It Replaces",body:"Manager submits ticket to config analyst. Config opens Toad, writes SQL, inserts into Oracle. Takes 15-30 min. This tool: 30 seconds, zero SQL knowledge."},
          {title:"Branch-Scoped",body:"Select your warehouse from the dropdown. All data, validation, and SQL output is scoped to that branch. Different branches have different aisles, zones, classes, and naming conventions. The tool adapts automatically."},
          {title:"Smart Features",body:"Beam-First Logic: Adding to an existing beam auto-populates class, zone, pick flow, type, and dims from neighbors.\nBeam Width Recalc: Adding a position redistributes width across ALL positions.\nRange Mode: Create 2-50 locations at once.\nNew Aisle Override: Unknown aisles get a warning with manual entry.\nLive Validation: Red/green/yellow with specific error messages."},
          {title:"Production Path",body:"This sim uses browser memory. Production: Power App \u2192 Power Automate \u2192 Python \u2192 Oracle (scoped service account). One connection change."},
        ].map((s,i)=>(
          <div key={i} style={{marginBottom:18}}>
            <div style={{fontWeight:700,color:"#1e3a5f",fontSize:14,marginBottom:6}}>{s.title}</div>
            <div style={{fontSize:13,lineHeight:1.8,color:"#4b5563",whiteSpace:"pre-line"}}>{s.body}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}
