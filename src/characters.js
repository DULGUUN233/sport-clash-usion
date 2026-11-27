// Real career numbers, approximate as of the end of the 2024-25 season.
// NBA: regular-season career totals (games x per-game average; early steals/blocks from records). Football: club goals, club assists, club appearances, senior trophies (club + country), Champions League goals.

const icon=emoji=>`data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><text x="32" y="46" font-size="44" text-anchor="middle">${emoji}</text></svg>`)}`;

export const SPORTS={
 nba:{name:'Сагс',emoji:'🏀',decimals:0,positions:['PG','SG','SF','PF','C'],stats:[
  {key:'pts',mn:'Оноо',img:icon('🏀')},
  {key:'reb',mn:'Самбар',img:icon('🙌')},
  {key:'ast',mn:'Дамжуулалт',img:icon('🤝')},
  {key:'stl',mn:'Таслалт',img:icon('🖐️')},
  {key:'blk',mn:'Хаалт',img:icon('🛡️')}
 ]},
 fb:{name:'Хөлбөмбөг',emoji:'⚽',decimals:0,positions:['ХБ','ХМ','ХГ','ЖГ','ДШ'],stats:[
  {key:'goals',mn:'Гоол',img:icon('⚽')},
  {key:'assists',mn:'Ассист',img:icon('🎯')},
  {key:'apps',mn:'Тоглолт',img:icon('👟')},
  {key:'trophies',mn:'Цом',img:icon('🏆')},
  {key:'cl',mn:'CL гоол',img:icon('⭐')}
 ]}
};

const TEAMS={
 LAL:['Lakers','#552583','#FDB927'],BOS:['Celtics','#007A33','#FFFFFF'],CHI:['Bulls','#CE1141','#FFFFFF'],GSW:['Warriors','#1D428A','#FFC72C'],
 SAS:['Spurs','#111111','#C4CED4'],MIA:['Heat','#98002E','#F9A01B'],PHI:['76ers','#006BB6','#FFFFFF'],DET:['Pistons','#C8102E','#FFFFFF'],
 NYK:['Knicks','#006BB6','#F58426'],HOU:['Rockets','#CE1141','#FFFFFF'],PHX:['Suns','#1D1160','#E56020'],DAL:['Mavericks','#00538C','#FFFFFF'],
 UTA:['Jazz','#002B5C','#F9A01B'],OKC:['Thunder','#007AC1','#FFFFFF'],SEA:['SuperSonics','#00653A','#FFC200'],MIL:['Bucks','#00471B','#EEE1C6'],
 DEN:['Nuggets','#0E2240','#FEC524'],MIN:['Timberwolves','#0C2340','#78BE20'],CLE:['Cavaliers','#860038','#FDBB30'],ATL:['Hawks','#E03A3E','#FFFFFF'],
 ORL:['Magic','#0077C0','#FFFFFF'],POR:['Trail Blazers','#111111','#E03A3E'],SAC:['Kings','#5A2D81','#FFFFFF'],IND:['Pacers','#002D62','#FDBB30'],
 TOR:['Raptors','#CE1141','#FFFFFF'],NJN:['Nets','#002A60','#FFFFFF'],MEM:['Grizzlies','#12173F','#5D76A9'],NOP:['Pelicans','#0C2340','#C8102E'],
 LAC:['Clippers','#C8102E','#FFFFFF'],CHA:['Hornets','#00788C','#FFFFFF'],WAS:['Wizards','#002B5C','#E31837'],
 RMA:['Real Madrid','#F4F4F4','#1B2A5B'],BAR:['Barcelona','#A50044','#FDC52C'],MUN:['Man United','#DA291C','#FFFFFF'],JUV:['Juventus','#111111','#FFFFFF'],
 ACM:['AC Milan','#C8102E','#111111'],INT:['Inter','#0068A8','#111111'],BAY:['Bayern','#DC052D','#FFFFFF'],LIV:['Liverpool','#C8102E','#FFFFFF'],
 CHE:['Chelsea','#034694','#FFFFFF'],ARS:['Arsenal','#EF0107','#FFFFFF'],MCI:['Man City','#6CABDD','#1C2C5B'],PSG:['PSG','#004170','#DA291C'],
 ATM:['Atlético','#CB3524','#FFFFFF'],BVB:['Dortmund','#FDE100','#111111'],ROM:['Roma','#8E1F2F','#F0BC42'],TOT:['Tottenham','#F4F4F4','#132257'],
 NAP:['Napoli','#12A0D7','#FFFFFF'],FIO:['Fiorentina','#482E92','#FFFFFF'],LAZ:['Lazio','#87D8F7','#13264D'],SAO:['São Paulo','#F4F4F4','#FE0000'],
 VEL:['Vélez','#F4F4F4','#0033A0'],NAC:['Nacional','#00A859','#FFFFFF'],LEI:['Leicester','#003090','#FDBE11'],AVL:['Aston Villa','#670E36','#95BFE5']
};

const NBA=[
 ['PG','Magic Johnson','LAL','32',17667,6523,10147,1721,362],['PG','Stephen Curry','GSW','30',25342,4822,6566,1539,205],['PG','Chris Paul','LAC','3',23290,6165,12604,2740,137],
 ['PG','Isiah Thomas','DET','11',18797,3524,9105,1860,294],['PG','John Stockton','UTA','12',19702,4061,15792,3309,301],['PG','Steve Nash','PHX','13',17403,3651,10344,852,122],
 ['PG','Jason Kidd','NJN','5',17527,8763,12102,2643,417],['PG','Gary Payton','SEA','20',21760,5206,8944,2403,267],['PG','Russell Westbrook','OKC','0',26288,8804,9920,1984,372],
 ['PG','Damian Lillard','POR','0',22590,3780,6030,900,270],['PG','Kyrie Irving','CLE','2',18723,3081,4503,1027,316],['PG','Luka Dončić','DAL','77',12870,3915,3690,495,180],
 ['PG','Tony Parker','SAS','9',19437,3386,7022,1003,125],['PG','Derrick Rose','CHI','1',12580,2314,3760,578,217],['PG','Rajon Rondo','BOS','9',9379,4306,7560,1531,96],
 ['PG','Kyle Lowry','TOR','7',17343,5412,7749,1722,369],['PG','Shai Gilgeous-Alexander','OKC','2',11808,2256,2544,672,384],['PG','Trae Young','ATL','11',12600,1850,4900,500,50],
 ['PG','Ja Morant','MEM','12',6720,1470,2220,330,90],['PG','Tim Hardaway','GSW','10',15346,2861,7109,1387,87],['PG','Penny Hardaway','ORL','1',10701,3168,3520,1126,282],
 ['PG','Deron Williams','UTA','8',13774,2620,6844,845,254],['PG','Mike Conley','MEM','11',16848,3627,6552,1521,234],['PG','Kevin Johnson','PHX','7',13156,2426,6688,1102,147],
 ['SG','Michael Jordan','CHI','23',32267,6646,5682,2466,858],['SG','Kobe Bryant','LAL','24',33650,6999,6326,1884,673],['SG','Allen Iverson','PHI','3',24404,3382,5667,2011,183],
 ['SG','Dwyane Wade','MIA','3',23188,4954,5692,1581,843],['SG','James Harden','HOU','13',27715,6440,8165,1725,575],['SG','Clyde Drexler','POR','22',22154,6625,6082,2172,760],
 ['SG','Ray Allen','BOS','20',24570,5330,4420,1430,260],['SG','Reggie Miller','IND','31',25280,4167,4167,1528,278],['SG','Tracy McGrady','ORL','1',18385,5253,4127,1126,844],
 ['SG','Vince Carter','TOR','15',25735,6626,4777,1541,925],['SG','Klay Thompson','GSW','11',16530,3045,2001,696,435],['SG','Devin Booker','PHX','1',17424,3024,3672,648,216],
 ['SG','Donovan Mitchell','CLE','45',14396,2537,2655,826,177],['SG','George Gervin','SAS','44',20724,3639,2215,949,633],['SG','Manu Ginóbili','SAS','20',14058,3700,4017,1374,317],
 ['SG','Joe Dumars','DET','4',16390,2240,4581,916,102],['SG','Mitch Richmond','SAC','2',20496,3806,3416,1171,293],['SG','Sidney Moncrief','MIL','4',11965,3605,2761,920,230],
 ['SG','Anthony Edwards','MIN','5',9516,1989,1638,507,234],['SG','Bradley Beal','WAS','3',18094,3403,3569,913,332],['SG','DeMar DeRozan','TOR','10',25320,5400,4920,1200,360],
 ['SG','Brandon Roy','POR','7',6129,1402,1532,326,98],['SG','Jamal Crawford','ATL','11',19374,2919,4512,1194,265],['SG','Latrell Sprewell','NYK','8',16708,3743,3652,1278,274],
 ['SF','LeBron James','LAL','23',42174,11715,11559,2343,1093],['SF','Kevin Durant','OKC','35',30546,7861,4941,1235,1235],['SF','Larry Bird','BOS','33',21797,8970,5651,1525,718],
 ['SF','Scottie Pippen','CHI','33',18966,7539,6126,2356,942],['SF','Kawhi Leonard','SAS','2',14328,4608,2160,1224,432],['SF','Dominique Wilkins','ATL','21',26635,7196,2685,1396,644],
 ['SF','Paul Pierce','BOS','34',26457,7521,4700,1746,806],['SF','Carmelo Anthony','NYK','7',28350,7812,3402,1260,630],['SF','Julius Erving','PHI','6',18392,5601,3260,1505,1254],
 ['SF','Jayson Tatum','BOS','0',14040,4440,2340,660,420],['SF','Jimmy Butler','MIA','22',16470,4770,3870,1440,360],['SF','Paul George','IND','13',18040,5544,3256,1408,352],
 ['SF','Grant Hill','DET','33',17134,6156,4207,1231,616],['SF','James Worthy','LAL','42',16298,4723,2778,1019,648],['SF','Alex English','DEN','2',25650,6562,4295,1074,596],
 ['SF','Adrian Dantley','UTA','4',23206,5444,2865,955,191],['SF','Chris Mullin','GSW','17',17945,4043,3451,1578,493],['SF','Bernard King','NYK','30',19665,5069,2884,874,262],
 ['SF','Shawn Marion','PHX','31',17678,10118,2210,1744,1279],['SF','Glen Rice','CHA','41',18300,4400,2100,900,300],['SF','Peja Stojaković','SAC','16',13668,3859,1528,724,161],
 ['SF','Ron Artest','IND','23',13728,4784,2496,1768,416],['SF','Andre Iguodala','PHI','9',13910,6032,5170,1723,616],['SF','Jaylen Brown','BOS','7',12672,3584,1856,704,256],
 ['PF','Tim Duncan','SAS','21',26448,15034,4176,974,3062],['PF','Karl Malone','UTA','32',36900,14908,5314,2066,1181],['PF','Dirk Nowitzki','DAL','41',31505,11415,3653,1218,1218],
 ['PF','Kevin Garnett','MIN','21',26024,14620,5409,1901,2047],['PF','Charles Barkley','PHX','34',23713,12554,4185,1610,858],['PF','Giannis Antetokounmpo','MIL','34',19837,8217,4150,913,996],
 ['PF','Kevin McHale','BOS','32',17381,7088,1651,388,1651],['PF','Dennis Rodman','DET','10',6650,11934,1640,638,547],['PF','Chris Webber','SAC','4',17202,8144,3490,1163,1163],
 ['PF','Pau Gasol','LAL','16',20842,11279,3923,613,1962],['PF','Anthony Davis','NOP','23',18240,7980,1900,988,1748],['PF','Blake Griffin','LAC','32',15561,6470,3194,655,328],
 ['PF','Shawn Kemp','SEA','40',15345,8828,1997,1261,1261],['PF','Amar\'e Stoudemire','PHX','32',15989,6599,1015,677,1015],['PF','Chris Bosh','TOR','4',17146,7590,1786,714,893],
 ['PF','Draymond Green','GSW','23',7830,6210,5040,1170,810],['PF','Rasheed Wallace','DET','36',15667,7290,1958,1088,1414],['PF','Zion Williamson','NOP','1',5286,1498,877,214,128],
 ['PF','Kevin Love','MIN','42',15180,9476,2116,644,368],['PF','Larry Johnson','CHA','2',11453,5302,2333,495,212],['PF','Tom Chambers','PHX','24',20037,6753,2325,886,554],
 ['PF','Paolo Banchero','ORL','5',4294,1330,836,171,114],['PF','Elton Brand','LAC','42',19785,9945,2328,1058,2010],['PF','LaMarcus Aldridge','POR','12',20552,8716,2044,753,1184],
 ['C','Kareem Abdul-Jabbar','LAL','33',38376,17472,5616,1160,3189],['C','Shaquille O\'Neal','LAL','34',28606,13156,3018,724,2776],['C','Hakeem Olajuwon','HOU','34',26988,13742,3095,2105,3838],
 ['C','Patrick Ewing','NYK','33',24843,11593,2248,1183,2839],['C','David Robinson','SAS','50',20826,10462,2468,1382,2961],['C','Moses Malone','PHI','2',27377,16214,1861,1063,1728],
 ['C','Nikola Jokić','DEN','15',16425,8250,5250,975,525],['C','Joel Embiid','PHI','21',12330,4950,1620,405,720],['C','Dwight Howard','ORL','12',19499,14656,1615,1118,2236],
 ['C','Alonzo Mourning','MIA','33',14330,7123,922,419,2346],['C','Dikembe Mutombo','DEN','55',11721,12319,1196,478,3349],['C','Yao Ming','HOU','11',9234,4471,778,194,923],
 ['C','Bill Walton','POR','32',6224,4914,1591,374,1030],['C','Robert Parish','BOS','00',23360,14660,2255,1289,2416],['C','Ben Wallace','DET','3',6202,10445,1414,1414,2176],
 ['C','Rudy Gobert','UTA','27',10578,9976,1118,602,1720],['C','Victor Wembanyama','SAS','1',4014,1944,630,216,666],['C','Karl-Anthony Towns','MIN','32',15801,7590,2139,552,828],
 ['C','Bam Adebayo','MIA','13',9333,5368,2135,671,488],['C','Artis Gilmore','CHI','53',15544,9181,1909,454,1818],['C','Bob Lanier','DET','16',19276,9686,2973,725,1100],
 ['C','Mark Eaton','UTA','53',5250,6912,700,350,3062],['C','Domantas Sabonis','SAC','10',11454,7728,3312,552,276],['C','Zydrunas Ilgauskas','CLE','11',10959,6491,1096,422,1349]
];

const FB=[
 ['ДШ','Cristiano Ronaldo','RMA','7',800,240,1060,35,140],['ДШ','Robert Lewandowski','BAY','9',590,150,850,31,105],['ДШ','Zlatan Ibrahimović','PSG','10',508,200,820,34,48],
 ['ДШ','Karim Benzema','RMA','9',470,190,900,35,90],['ДШ','Luis Suárez','BAR','9',510,260,880,23,27],['ДШ','Thierry Henry','ARS','14',360,180,800,16,50],
 ['ДШ','Ronaldo Nazário','INT','9',280,70,390,15,14],['ДШ','Marco van Basten','ACM','9',277,50,373,11,10],['ДШ','Sergio Agüero','MCI','10',385,110,690,19,41],
 ['ДШ','Harry Kane','TOT','10',330,90,520,1,38],['ДШ','Erling Haaland','MCI','9',290,50,330,10,50],['ДШ','Kylian Mbappé','PSG','7',330,130,450,19,59],
 ['ДШ','Didier Drogba','CHE','11',300,110,690,18,44],['ДШ','Andriy Shevchenko','ACM','7',280,70,640,14,48],['ДШ','Gabriel Batistuta','FIO','9',300,60,520,7,7],
 ['ДШ','Raúl','RMA','7',380,120,840,19,71],['ДШ','Samuel Eto\'o','BAR','9',360,120,790,18,30],['ДШ','Wayne Rooney','MUN','10',313,150,760,16,30],
 ['ДШ','Miroslav Klose','LAZ','11',240,80,590,7,17],['ДШ','Edinson Cavani','PSG','9',440,90,810,23,35],['ДШ','Robin van Persie','ARS','10',280,110,600,6,22],
 ['ДШ','Romelu Lukaku','INT','9',330,90,600,6,20],['ДШ','Radamel Falcao','ATM','9',320,50,620,12,14],['ДШ','Gonzalo Higuaín','NAP','9',330,90,710,15,22],
 ['ЖГ','Lionel Messi','BAR','10',750,340,950,45,129],['ЖГ','Neymar','BAR','11',370,230,690,30,43],['ЖГ','Mohamed Salah','LIV','11',340,150,660,11,50],
 ['ЖГ','Arjen Robben','BAY','10',210,130,600,27,30],['ЖГ','Franck Ribéry','BAY','7',160,200,650,24,21],['ЖГ','Luís Figo','BAR','7',130,200,800,21,30],
 ['ЖГ','Ronaldinho','BAR','10',260,180,700,15,18],['ЖГ','Gareth Bale','RMA','11',190,110,560,19,21],['ЖГ','Eden Hazard','CHE','10',220,180,720,13,12],
 ['ЖГ','Sadio Mané','LIV','10',240,90,600,12,26],['ЖГ','Raheem Sterling','MCI','7',200,110,600,15,26],['ЖГ','Ángel Di María','RMA','22',190,240,800,32,30],
 ['ЖГ','Ryan Giggs','MUN','11',170,270,960,34,29],['ЖГ','Vinícius Júnior','RMA','7',120,85,330,13,24],['ЖГ','Son Heung-min','TOT','7',230,100,610,1,18],
 ['ЖГ','Leroy Sané','BAY','10',110,90,420,9,16],['ЖГ','Riyad Mahrez','MCI','26',180,110,600,15,20],['ЖГ','Kingsley Coman','BAY','11',80,70,370,32,18],
 ['ЖГ','Bukayo Saka','ARS','7',70,70,270,3,10],['ЖГ','Rafael Leão','ACM','10',90,60,290,3,6],['ЖГ','Marc Overmars','ARS','11',90,70,450,10,10],
 ['ЖГ','Pedro','BAR','17',140,90,670,28,16],['ЖГ','Ousmane Dembélé','PSG','10',100,90,420,16,22],['ЖГ','Lamine Yamal','BAR','19',25,40,115,5,5],
 ['ХГ','Zinedine Zidane','RMA','5',95,100,500,15,14],['ХГ','Xavi','BAR','6',85,190,870,32,12],['ХГ','Andrés Iniesta','BAR','8',90,170,880,37,11],
 ['ХГ','Luka Modrić','RMA','10',130,170,900,28,7],['ХГ','Toni Kroos','RMA','8',65,190,760,34,12],['ХГ','Andrea Pirlo','JUV','21',60,110,770,17,13],
 ['ХГ','Steven Gerrard','LIV','8',185,150,800,11,21],['ХГ','Frank Lampard','CHE','8',270,180,900,13,23],['ХГ','Paul Scholes','MUN','18',155,90,720,25,22],
 ['ХГ','Kaká','ACM','22',160,140,560,12,30],['ХГ','Kevin De Bruyne','MCI','17',160,260,700,22,20],['ХГ','N\'Golo Kanté','CHE','7',35,30,550,13,2],
 ['ХГ','Sergio Busquets','BAR','5',20,60,860,35,3],['ХГ','Clarence Seedorf','ACM','10',110,140,950,20,20],['ХГ','Michael Ballack','CHE','13',160,100,650,12,22],
 ['ХГ','Patrick Vieira','ARS','4',60,80,640,17,8],['ХГ','Claude Makélélé','CHE','4',20,30,650,22,1],['ХГ','Pavel Nedvěd','JUV','11',150,120,700,14,15],
 ['ХГ','Jude Bellingham','RMA','5',60,50,260,8,18],['ХГ','Pedri','BAR','8',35,30,200,7,4],['ХГ','Rodri','MCI','16',40,40,450,14,5],
 ['ХГ','Edgar Davids','JUV','26',40,50,600,15,5],['ХГ','Roy Keane','MUN','16',60,60,600,19,9],['ХГ','Francesco Totti','ROM','10',250,190,790,6,17],
 ['ХМ','Paolo Maldini','ACM','3',29,30,900,26,3],['ХМ','Sergio Ramos','RMA','4',130,50,900,29,15],['ХМ','Carles Puyol','BAR','5',18,10,600,21,2],
 ['ХМ','Fabio Cannavaro','JUV','5',14,10,750,9,1],['ХМ','Roberto Carlos','RMA','3',100,140,900,25,11],['ХМ','Cafu','ROM','2',40,80,750,25,3],
 ['ХМ','Philipp Lahm','BAY','21',17,90,650,21,2],['ХМ','Virgil van Dijk','LIV','4',60,30,560,10,4],['ХМ','Alessandro Nesta','ACM','13',10,10,630,14,2],
 ['ХМ','Gerard Piqué','BAR','3',50,20,650,35,8],['ХМ','John Terry','CHE','26',65,25,720,17,8],['ХМ','Rio Ferdinand','MUN','5',11,10,600,15,1],
 ['ХМ','Marcelo','RMA','12',40,110,700,27,9],['ХМ','Thiago Silva','PSG','2',40,20,800,40,6],['ХМ','Dani Alves','BAR','2',45,170,950,43,10],
 ['ХМ','Achraf Hakimi','PSG','2',60,80,380,18,10],['ХМ','Trent Alexander-Arnold','LIV','66',20,90,360,9,4],['ХМ','Nemanja Vidić','MUN','15',25,10,560,17,5],
 ['ХМ','Lilian Thuram','JUV','21',12,15,630,11,1],['ХМ','Jaap Stam','MUN','6',20,15,560,10,2],['ХМ','Giorgio Chiellini','JUV','3',35,20,700,22,4],
 ['ХМ','Mats Hummels','BVB','15',60,30,700,14,5],['ХМ','David Alaba','BAY','27',40,60,500,32,6],['ХМ','Rúben Dias','MCI','3',15,10,350,14,2],
 ['ХБ','Gianluigi Buffon','JUV','1',0,0,970,31,0],['ХБ','Manuel Neuer','BAY','1',0,2,780,33,0],['ХБ','Iker Casillas','RMA','1',0,0,900,27,0],
 ['ХБ','Oliver Kahn','BAY','1',0,0,830,25,0],['ХБ','Edwin van der Sar','MUN','1',0,0,850,26,0],['ХБ','Peter Schmeichel','MUN','1',10,0,800,25,0],
 ['ХБ','Petr Čech','CHE','1',0,0,800,17,0],['ХБ','Thibaut Courtois','RMA','1',0,0,700,17,0],['ХБ','Alisson','LIV','1',1,3,560,9,0],
 ['ХБ','Ederson','MCI','31',0,7,510,17,0],['ХБ','David de Gea','MUN','1',0,0,700,8,0],['ХБ','Jan Oblak','ATM','13',0,0,560,4,0],
 ['ХБ','Marc-André ter Stegen','BAR','1',0,1,600,18,0],['ХБ','Rogério Ceni','SAO','1',131,0,1250,20,0],['ХБ','José Luis Chilavert','VEL','1',54,0,700,15,0],
 ['ХБ','René Higuita','NAC','1',40,0,600,8,0],['ХБ','Dino Zoff','JUV','1',0,0,640,13,0],['ХБ','Hugo Lloris','TOT','1',0,0,720,3,0],
 ['ХБ','David Seaman','ARS','1',0,0,750,13,0],['ХБ','Keylor Navas','RMA','1',0,0,700,20,0],['ХБ','Gianluigi Donnarumma','PSG','99',0,0,450,14,0],
 ['ХБ','Wojciech Szczęsny','JUV','1',0,0,600,10,0],['ХБ','Kasper Schmeichel','LEI','1',0,0,850,3,0],['ХБ','Emiliano Martínez','AVL','23',0,0,350,6,0]
];

const shirt=(sport,c1,c2,number)=>{
 const body=sport==='nba'
  ?'M96 70 Q120 96 150 96 Q180 96 204 70 L232 82 Q226 140 236 170 L236 380 L64 380 L64 170 Q74 140 68 82 Z'
  :'M104 62 Q150 92 196 62 L262 92 L246 158 L216 148 L216 380 L84 380 L84 148 L54 158 L38 92 Z';
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><radialGradient id="g" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="${c1}" stop-opacity=".55"/><stop offset="1" stop-color="#07070d"/></radialGradient></defs><rect width="300" height="400" fill="url(#g)"/><path d="${body}" fill="${c1}" stroke="${c2}" stroke-width="7" stroke-linejoin="round"/><text x="150" y="${number.length>1?292:296}" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="${number.length>1?120:140}" text-anchor="middle" fill="${c2}" stroke="#07070d" stroke-opacity=".25" stroke-width="3">${number}</text></svg>`;
 return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const build=(sport,rows)=>rows.map(([pos,name,team,number,...stats],i)=>{
 const [teamName,c1,c2]=TEAMS[team];
 return {id:`${sport}-${i}`,sport,seriesId:`${sport}-${pos}`,series:`${pos} · ${teamName}`,name,stats,image:shirt(sport,c1,c2,number)};
});

export const ALL=[...build('nba',NBA),...build('fb',FB)];
export const BY_ID=new Map(ALL.map(c=>[c.id,c]));
export const MAX=Object.fromEntries(Object.keys(SPORTS).map(s=>[s,[0,1,2,3,4].map(i=>Math.max(...ALL.filter(c=>c.sport===s).map(c=>c.stats[i]))||1)]));

export let sport='nba',STATS=SPORTS.nba.stats,CHARACTERS=ALL.filter(c=>c.sport==='nba');
export function setSport(next){if(!SPORTS[next]||next===sport)return;sport=next;STATS=SPORTS[next].stats;CHARACTERS=ALL.filter(c=>c.sport===next);}
export const fmt=value=>value==null?'—':SPORTS[sport].decimals?Number(value).toFixed(SPORTS[sport].decimals):String(value);
