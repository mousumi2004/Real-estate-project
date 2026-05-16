const text = 'here is the text \n'+'"Property Address","Zip Code","Wholesale Price (in $)","After Repair Value - ARV (in $)","Property Type","Bedrooms","Bathrooms","Living Area (in sq ft)","Notes"\n' +
'"516 NW 18th Ave  Fort Lauderdale 33311",33311,409900,Not Found,Duplex,4,2,1212,"Duplex 4 bedroom, 2 bathroom. One side is vacant and the other side is tenant occupied. Please do not disturb tenant."\n' +
'"7721 NW 35th St  Hollywood 33024",33024,445000,Not Found,"Single Family",3,2,1336,"3 bedroom, 2 bathroom single family home. The property needs full interior."\n' +
'"1232 NE 17th Ter  Fort Lauderdale 33304",33304,644900,Not Found,"Single Family",3,2,1579,"3 bedroom, 2 bathroom single family home. This fixer-upper is located in the beautiful city of Fort Lauderdale just minutes away from the ocean, sitting on an oversized lot with endless possibilities. Easy to show."\n' +
'"4717 SW 32 Ave  Dania Beach 33312",33312,1100000,Not Found,Not Found,Not Found,Not Found,Not Found,"Approved 6 townhouses in Dania Beach. The seller will deliver fully approved construction docs. The buyer must pay the impact fee (approximately 100k). 98% approved, and the seller is working on a couple of comments to be ready in 30 days."\n' +
'"3238 NW 47th Ave #3105  Coconut Creek 33063",33063,230000,Not Found,Condo,3,2,1093,"3 bedroom, 2 bathroom condo. Lake view. Amazing investment opportunity in a highly desirable area with a lovely lake view. Dated inside throughout, enclosed balcony for more living area, washer and dryer in unit, and needs some updating. Easy rehab, can rent right away, and vacant at closing. Note: Contingent on probate approval. Buyer to assume some content left behind. Corporate owners allowed. No rental restrictions."\n' +
'"6432 Perry St Hollywood 33024",33024,394700,Not Found,"Single Family",3,1,912,"3 bedroom, 1 bathroom single family home. Huge driveway. Surround sound. Security cameras. SS Appliances. Storage shed. Add bath for max value ad."\n' +
'"661 SW 83rd Ave North Lauderdale 33068",33068,334000,Not Found,"Single Family",3,2,957,"3 bedroom, 2 bathroom single family home. Some interior updates. Single car garage. Great location."\n' +
'"511/513 NW 7th Ct  Hallandale Beach 33009",33009,949000,Not Found,Duplex,8,4,3946,"Two side by side duplexes. 511: Two 2 beds, 1 bath units. 513: Two 2 beds, 1 bath units. Roof 10+ years old, good condition. 4 CAC, each unit has its own. 4 electrical meters. 4 water meters. Each duplex can be sold separately. Total rent $6,925/month."\n' +
'"3621 SW Natura Ave  Deerfield Beach 33441",33441,219900,Not Found,"Single Family",2,2,1216,"2 bedroom, 2 bathroom single family home. Garage. 55+ community. HOA holds a Capital Contribution $2,500 to HOA is a must."\n' +
'"4749 NW 6th Ave  Deerfield Beach 33064",33064,309900,Not Found,"Single Family",3,2,1315,"3 bedroom, 2 bathroom single family home. Located in Woodsetter North neighborhood. HOA fee $186 monthly. Currently rented for $1,714 month to month. Local rents can rent up to $3,100. Great opportunities with this property for someone looking to flip. Just west of I-5 and mins from shopping and beaches."\n' +
'"1043 Iroquois Ave Fort Lauderdale 33312",33312,409700,Not Found,"Single Family",5,3,1806,"5 bedroom, 3 bathroom single family home. Huge driveway. Updated kitchen. Newer roof and AC. Pool. Fenced in backyard. SS Appliances."\n' +
'"1695 NE 51st St Pompano Beach 33064",33064,444700,Not Found,"Single Family",4,2.5,1568,"4 bedroom, 2.5 bathroom single family home. Corner lot. Huge driveway. Updated kitchen. Fenced in backyard. Back patio with awning. Exterior kitchen."\n' +
'"6831 Greene St  Hollywood 33021",33021,324900,Not Found,"Single Family",2,1,884,"2 bedroom, 1 bathroom single family home. Basic update needed, enclosed patio and porch. Vacant at closing."\n' +
'"2200 SW 42nd Way  Fort Lauderdale 33317",33317,384900,Not Found,"Single Family",5,4,1744,"5 bedroom, 4 bathroom single family home. Roof and AC 2006. Water heater 2018. One tenant pays $750 in 1 bedroom with a bathroom, been there off and on for 14 years, tenant in the back pays $1,100 and wishes to stay also, informal lease. Been there 1.5 years. If needed, both tenants can vacate with enough notice if we proceed past inspection period. Seller pays water, electric and internet cable."\n' +
'"3197 Taft St Hollywood 33021",33021,529700,Not Found,"Single Family",3,2,1721,"3 bedroom, 2 bathroom single family home. Pool. Huge driveway. Fenced in backyard. Bonus den. Renovation for 3rd bath started."';

const responseLines = text.split('\n');

const propertyAddressIndex = responseLines.findIndex(line => line.includes("Property Address","Zip Code","Wholesale Price (in $)","After Repair Value - ARV (in $)","Property Type","Bedrooms","Bathrooms","Living Area (in sq ft)","Notes"));

const filteredLines = responseLines.slice(propertyAddressIndex+1);

const linesWithNewlines = filteredLines.map(line => line + '\n');
const textWithNewlines = linesWithNewlines.join('');



console.log(responseLines);
console.log(propertyAddressIndex);
console.log(filteredLines);

console.log(linesWithNewlines);