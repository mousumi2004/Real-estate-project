const fs = require('fs');
require('dotenv').config();
const Anthropic = require("@anthropic-ai/sdk");

const getParsedEmail = (emails) => {
   console.log("inside gen ai");
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const anthropic = new Anthropic({
      apiKey,
    });
    
    const filename = 'Email.csv';
    
    async function main(email) {
        console.log("inside main");
      try {
    
        const response = await anthropic.messages.create({
            model: "claude-3-sonnet-20240229",
            max_tokens: 3000,
            messages: [
              { role: "user", content: createPrompt(email) }
            ]
        });
    
        console.log('this is res',response);
    
        return response.content[0].text;
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }
    
    // Serial Number (Sequence from 1 to n, where n is total properties in the text)
    
    
    function createPrompt(body) {
      const prompt = `
      ##################### Start Instructions
    
      Objective: Transform raw property data into a structured tabular format, with each attribute as a separate column in this table.
    
      Use the same instructions to parse multiple texts entered on the prompt in the same session
    
      Parsing Instructions:
    
      Extract Core Attributes: For each property, extract the following core attributes:
    
      Property Address (Include Property Address within "", example "124 main st, san jose CA, 95051")
    
      Zip Code (first 5 digits only), Zip code is typically last 5 digits of the address, example in the following address “1234 Main St, Miami FL 33024” 33024 is the zip code. Sometimes there is a “,” after “FL”
    
      "Wholesale Price (in $)" (output the number without commas)
    
      "After Repair Value - ARV (in $)" (output the number without commas)
    
      Property Type (e.g., Single Family, Duplex, Condo, Multi-Family)
    
      Bedrooms (Always an integer)
    
      Bathrooms
    
      Living Area (in sq ft) (output the number without commas)
    
      Incorporate 'Notes' Field:
    
      Include a 'Notes' column for each home address for additional information or remarks that do not fit into the standard attributes.
    
      Be sure to list exhaustive notes with as much detail as possible.
    
      Mark Unavailable Data:
    
      Indicate with "Not Found" or a similar placeholder where specific data points are unavailable or cannot be inferred from the provided information.
    
      General Guidelines:
    
      Draw a table with columns as described above separated by ","
    
      DO NOT STOP until entire text is parsed
    
      Wholesale Price is sometimes after words "Asking Price",or "Asking", or "Reduced"
    
      When encountering ambiguous data, assess context clues from the entire dataset to make the most logical inference.
    
      For unclear numerical data (e.g., "4/2 1480sf"), break it down systematically: first, interpret bedroom/bathroom count, then square footage.
    
      If property type is not mentioned, use property features (like the number of units in a duplex) to determine it.
    
      Utilize the 'Notes' field for any uncertainties or additional details that might require further clarification or are noteworthy.
    
      Extract all property-related attributes, especially infer the number of bedrooms, bathrooms, and sq ft area attributes.
    
      Any additional textual information can be captured in a "Notes" field.
    
      STOP reading when you see the next property address or some other information.
    
      For Bedrooms and Bathrooms, follow these guidelines for interpretation:
    
      "Duplex, Both Units: 1 Bed / 1 Bath" ==> 2 Bedrooms, 2 Bathrooms
    
      "Bed/Bath: 2/1" ==> 2 Bedrooms, 1 Bathroom
    
      "4/2 1480sf" ==> 4 Bedrooms, 2 Bathrooms
    
      "Condo 2/2" ==> 2 Bedrooms, 2 Bathrooms
    
      "2/1 + Efficiency" ==> 3 Bedrooms, 2 Bathrooms
    
      "2/1 + 1/1" ==> 3 Bedrooms, 2 Bathrooms
    
      "3 Bedrooms / 2 Bathrooms" ==> 3 Bedrooms, 2 Bathrooms
    
      "2 Beds / 2 Baths / Garage" ==> 2 Bedrooms, 2 Bathrooms
    
      ##################### End Instructions
    
      [data]
      ${body}
        `;
      return prompt.trim();
    }
    
    async function processEmails(emails) {
        console.log("inside process");
      let propertyData = [];
      for (const email of emails) {
        try {
          const res = await main(email);
          if (res) {
            const responseLines = res.split('\n');
            const propertyAddressIndex = responseLines.findIndex(line => line.includes("Property Address","Zip Code","Wholesale Price (in $)","After Repair Value - ARV (in $)","Property Type","Bedrooms","Bathrooms","Living Area (in sq ft)","Notes"));

            const filteredLines = responseLines.slice(propertyAddressIndex+1);
            filteredLines.forEach(line => propertyData.push(line + '\n'));
            // propertyData = propertyData.push(filteredLines.map(line => line + '\n'));
            // console.log(filteredLines.map(line => line + '\n'))
            
        }
        
        
            console.log('Email data processed.');
            // console.log(propertyData.join('\n'));
        
        
        } catch (error) {
          console.error('Error processing email:', error);
        }
      }
      return propertyData;
    }
    
    // Example usage
    // const emails = [
    
    //     {
    //       "messageId": "18e1be1004dbb933",
    //       "senderEmail": "Demo jyoti <demojyoti111@gmail.com>",
    //       "senderName": "Demo jyoti",
    //       "snippet": "---------- Forwarded message --------- From: Demo jyoti &lt;demojyoti111@gmail.com&gt; Date: Tue, 5 Mar, 2024, 3:47 pm Subject: Fwd: Fw: South Florida and Southwest Florida Wholesale Deals Friday! To:",
    //       "body": "---------- Forwarded message ---------From: Demo jyoti <demojyoti111@gmail.com>Date: Tue, 5 Mar, 2024, 3:47 pmSubject: Fwd: Fw: South Florida and Southwest Florida Wholesale DealsFriday!To: <jyoti.r.das845@gmail.com>---------- Forwarded message ---------From: Jyoti Ranjan Das <jyoti.r.das845@gmail.com>Date: Tue, 5 Mar, 2024, 3:46 pmSubject: Fwd: Fw: South Florida and Southwest Florida Wholesale DealsFriday!To: <demojyoti111@gmail.com>---------- Forwarded message ---------From: Real Estate <realestate0428@yahoo.com>Date: Sat, 2 Mar, 2024, 8:13 pmSubject: Fw: South Florida and Southwest Florida Wholesale Deals Friday!To: jyoti.r.das845@gmail.com <jyoti.r.das845@gmail.com>----- Forwarded Message -----*From:* Lex Levinrad <lex@lexlevinrad.com>*To:* \"realestate0428@yahoo.com\" <realestate0428@yahoo.com>*Sent:* Friday, March 1, 2024 at 10:31:08 PM GMT+5:30*Subject:* South Florida and Southwest Florida Wholesale Deals Friday!South Florida and Southwest Florida Wholesale DealsTo See Any of These Properties or To Submit an Offer Please Call Chris At(561) 223-8521 Or Email: chris@lexrealestategroup.com<https://xe299.keap-link001.com/v2/click/b745e912dc46ad1280c2af04ee4053ee/eJyNkEELgkAUhP_LO0uWlqWnRCRM8xB1jkUftbSty_oMI_zvrRaeCjrPzDfMPIFQMklJCQG06Pg-WKCx4IqjpKiSxIpBdDxn7lsguLxudNUoCJ7foqM-ZJa-t7CAHgqN5bAPozTJN6csyVNjVUybin847mzqrdwRFO_CJIOu-0nGG6f4buA1BKQb7BeV3KyioxbGfyFSgW1vUa4FthqZwJoY4bkvnBTVzTCYUijLzwEpPt6k7gVn22MV>[image: image][image: image]*2650 NW 62nd Ter, Margate 33063**Asking $397,000*2 Bed, 2 Bath, CBS Family home, 1374 sq. ft.Built in 1965. Garage. Has a pool.AC in good shape. Needs a new interior.Please Call Chris At (561) 223-8521******************[image: image]*12108 NW 34th St, Sunrise 33323**Asking $479,900*3 Bed, 2 Bath, CBS Family home, 1532 sq. ft.Built in 1992. 2 car garage. Great location!home has no neighbors behind and a large backyardwith plenty of room for a pool.Please Call Chris At (561) 223-8521******************[image: image]*4170 Banyan Trails Dr, Coconut Creek 33073**Asking $439,000*3 Bed, 2 Bath, CBS Family home, 1976 sq. ft.Built in 2000. 2 car garage. Off market.Please Call Chris At (561) 223-8521******************[image: image]*7721 NW 35th St, Hollywood 33024**Asking $445,000*3 Bed, 2 Bath, CBS Family home, 1336 sq. ft.Built in 1960. Needs a full interior. Off market.Please Call Chris At (561) 223-8521******************[image: image]*3238 NW 47th Ave 3105, Coconut Creek 33063**Asking $230,000*3 Bed, 2 Bath, Condo, 1093 sq. ft.Built in 1985. Needs full updating. Off market.Please Call Chris At (561) 223-8521******************[image: image]*12060 NW 22nd Ave, Miami 33167**Asking $419,000*3 Bed, 2 Bath, CBS Family home, 1708 sq. ft.Built in 1963. Large lot in a desirable location!Cosmetic rehab. Vacant at closing.Please Call Chris At (561) 223-8521******************[image: image]*1560 NW 70th St, Miami 33147**Asking $299,900*5 Bed, 2 Bath, Single Family home, 1040 sq. ft.Built in 1946. Rented for $3600 month to month.Off market.Please Call Chris At (561) 223-8521******************[image: image]*7585 NW 14th Ave, Miami 33147**Asking $359,900*4 Bed, 2 Bath, CBS Family home, 1390 sq. ft.Built in 1937. Large lot!New roof. New CAC. Needs TLC.Please Call Chris At (561) 223-8521******************[image: image]*610 E 10th Ave, Hialeah 33010**Asking $394,000*3 Bed, 1 Bath, CBS Family home, 936 sq. ft.Built in 1953. Needs all updates.Off market.Please Call Chris At (561) 223-8521******************[image: image]*11545 NW 17th Ave, Miami 33167**Asking $330,000*3 Bed, 2 Bath, CBS Family home, 925 sq. ft.Built in 1960. Great location!Off market. Needs some work.Please Call Chris At (561) 223-8521******************[image: image]*100 NW 60th Ave, Miami 33126**Asking $470,000*2 Bed, 2 Bath, CBS Family home, 1273 sq. ft.Built in 1947. Plumbing & Electric are good.Vacant. Off market.Please Call Chris At (561) 223-8521******************[image: image]*2675 SW 24th Ter, Miami 33145**Asking $689,000*4 Bed, 3 Bath, CBS Family home, 1750 sq. ft.Built in 1949. Great location!Roof no leaks but older. Needs interior.Please Call Chris At (561) 223-8521******************[image: image]*735 W 73rd Pl, Hialeah 33014**Asking $530,500*4 Bed, 3 Bath, CBS Family home, 1539 sq. ft.Built in 1959. Large lot!Central AC. Upgraded kitchen. Quick close.Please Call Chris At (561) 223-8521******************[image: image]*3081 NW 183rd St, Miami Gardens 33056**Asking $442,500*5 Bed, 2 Bath, CBS Family home, 1701 sq. ft.Built in 1955. Large corner lot!Please Call Chris At (561) 223-8521******************[image: image]*775 81st St, Miami Beach 33141**Asking $899,000*3 Bed, 2 Bath, CBS Family home, 1545 sq. ft.Built in 1951. Great east locationNeeds full rehab.Please Call Chris At (561) 223-8521******************[image: image]*1624 Pine Valley Dr 102, Ft. Myers 33907**Asking $75,900*1 Bed, 1 Bath, Condo, 811 sq. ft.Built in 1974. Impact windows. Off market.Please Call Chris At (561) 223-8521******************This email message is sent from the office of Lex Levinrad who is aLicensed Realtor with Charles Rutenberg Realty. Prices on any of theDistressed Real Estate Institute Products including Home Study Courses,Boot Camps, Partnership Program and Coaching Programs may be changedwithout advance notice at any time. We reserve the right to change pricesespecially bonus offers and discounts on products that are offered at liveevents and webinars or on limited time offer promotional emails at any timeon any of the above products and without prior notice. Discounts availableon promotions expire at the time as advertised in the promotional email,webinar or live event and will no longer be applicable or available afterthe promotion period has expired.This email message is intended only for the use of the individual or entityto which it is addressed and may contain information that is privileged andconfidential. No information in this email unless specifically stated isintended to be relied upon by any person or persons other than theindividual or entity named above and no warranties or representations aremade or intended to persons or entities not named above. If the reader isnot the intended recipient, you are hereby notified that any dissemination,distribution or copying of this communication is strictly prohibited. Ifyou have received this communication in error, please notify us immediatelyb y telephone, return this message to the email address above and deleteall copies. By reading this email you acknowledge that the author of thisemail is not engaged in rendering legal, accounting, financial, investment,tax or other professional services. Please consult with your attorney, CPA,financial advisor and other professional advisors before acting on anyinformation contained in this email. All properties advertised for sale aresingle family homes unless otherwise indicated and are real estateinvestment properties. Some of these properties may be owned, listed and/orunder contract by Lex Levinrad or one of his students or businessassociates. All properties are sold as-is. Properties are subject to priorsale, withdrawal, or cancellation without notice at any time. After RepairValue merely implies a suggested price and should not be considered to befair market value. Buyer should perform their own due diligence as to valueof all properties and seek the advice of an appraiser and or inspectorprior to making a decision to purchase any properties. Information in thisemail is deemed accurate, but not warranted and the author of this emailmakes no warranties or representations as to the accuracy of theinformation contained in this email.Unsubscribe<https://xe299.infusionsoft.com/app/optOut/0/92f91c6dd2d7eb24/31641857/00f25150aaa7f57a>Lex Real Estate Group, LLC. | 7050 W Palmetto Park Rd Suite 15-675 BocaRaton, Florida 33433 United States (800) 617-2884"
    //     },
    //     {
    //         "messageId": "18e1be0d6a9b25d7",
    //         "senderEmail": "Demo jyoti <demojyoti111@gmail.com>",
    //         "senderName": "Demo jyoti",
    //         "snippet": "---------- Forwarded message --------- From: Jyoti Ranjan Das &lt;jyoti.r.das845@gmail.com&gt; Date: Tue, 5 Mar, 2024, 3:46 pm Subject: Fwd: Fw: Central Florida and North Florida Wholesale Deals Friday",
    //         "body": "---------- Forwarded message ---------From: Jyoti Ranjan Das <jyoti.r.das845@gmail.com>Date: Tue, 5 Mar, 2024, 3:46 pmSubject: Fwd: Fw: Central Florida and North Florida Wholesale Deals Friday!To: <demojyoti111@gmail.com>---------- Forwarded message ---------From: Real Estate <realestate0428@yahoo.com>Date: Sat, 2 Mar, 2024, 8:13 pmSubject: Fw: Central Florida and North Florida Wholesale Deals Friday!To: jyoti.r.das845@gmail.com <jyoti.r.das845@gmail.com>----- Forwarded Message -----*From:* Lex Levinrad <lex@lexlevinrad.com>*To:* \"realestate0428@yahoo.com\" <realestate0428@yahoo.com>*Sent:* Friday, March 1, 2024 at 10:32:39 PM GMT+5:30*Subject:* Central Florida and North Florida Wholesale Deals Friday!Central Florida and North Florida Wholesale DealsTo See Any of These Properties or To Submit an Offer Please Call Chris At(561) 223-8521 Or Email: chris@lexrealestategroup.com<Jen@lexrealestategroup.com>[image: image][image: image]*1624 Pine Valley Dr 102, Ft. Myers 33907**Asking $75,900*1 Bed, 1 Bath, Condo, 811 sq. ft.Built in 1974. Impact windows. Off market.Please Call Chris At (561) 223-8521******************[image: image]*6662 Beryl St, Jacksonville 32219**Asking $61,000*2 Bed, 1 Bath, Single Family home, 803 sq. ft.Built in 1954. Metal roof. New ac units.Electric updated. Sub flooring needs work.Please Call Chris At (561) 223-8521******************[image: image]*17443 Reaper Ave, Pt. Charlotte 33948**Asking $255,000*5 Bed, 3 Bath, CBS Family home, 2671 sq. ft.Built in 1994. 2 car garage. Large lot!Pool. Sinkhole to be repaired.Please Call Chris At (561) 223-8521******************[image: image]*1125 Ave L, Haines City 33844**Asking $168,000*2 Bed, 2 Bath, CBS Family home, 1500 sq. ft.Built in 1962. Large lot!New roof and new Central AC.Please Call Chris At (561) 223-8521******************[image: image]*3036 Green St, Jacksonville 32205**Asking $169,000*3 Bed, 2 Bath, Single Family home, 924 sq. ft.Built in 1942. Clean interior. Vacant at closing.Off market.Please Call Chris At (561) 223-8521******************[image: image]*1493 Eagle St, Port Charlotte 33952**Asking $204,000*2 Bed, 2 Bath, CBS Family home, 1144 sq. ft.Built in 1979. Garage. Large lot!In overall good condition. Off market.Please Call Chris At (561) 223-8521******************[image: image]*1147 Holly Ave, Daytona Beach 32117**Asking $150,000*3 Bed, 2 Bath, CBS Family home, 1036 sq. ft.Built in 1945. Needs AC. Needs rehab.Off market.Please Call Chris At (561) 223-8521******************[image: image]*8971 N Spartan Dr, Citrus Springs 34433**Asking $288,000*4 Bed, 2.5 Bath, CBS Family home, 2931 sq. ft.Built in 2010. 3 car garage. Huge property!Off market. Needs some updates.Please Call Chris At (561) 223-8521******************[image: image]*101 S Glenwood Ave, Orlando 32803**Asking $284,000*3 Bed, 2 Bath, Single Family home, 1146 sq. ft.Built in 1953. Minimal work needed.Off market.Please Call Chris At (561) 223-8521******************[image: image]*W Juneau St, Tampa 33614**Asking $311,900**ARV $425,000*2 Bed, 2 Bath, CBS Family home, 1,440 sq. ft.Built in 1964. Garage. Large lot!Please Call Chris At (561) 223-8521******************[image: image]*8590 Robin Trl, Kissimmee 34747**Asking $680,000**ARV $1,100,000*6 Bed, 4 Bath, CBS Family home, 4,284 sq. ft.Built in 1990. 5.98 acres near Disney!Needs TLC.Please Call Chris At (561) 223-8521******************[image: image]*Altamonte Springs 32714**Asking $225,000+**ARV $345,000 - $355,000*3 Bed, 2 Bath, CBS Family home, 1260 sq. ft.Built in 1969. Roof is 3 years old. AC is 2.Water Heater is uprgaded. Needs remodelling.Please Call Chris At (561) 223-8521******************[image: image]*3906 10th Ave S, St. Petersburg 33711**Asking $259,000*3 Bed, 2 Bath, Single Family home, 1050 sq. ft.Built in 1988. Rented until 12/31/24 for $2227 a month.Please Call Chris At (561) 223-8521******************[image: image]*205 7th Ave SE, Largo 33770**Asking $229,000*3 Bed, 2 Bath, Single Family home, 1392 sq. ft.Built in 1954. Large lot!Newer wood fence. Needs cosmetic work throughout.Please Call Chris At (561) 223-8521******************[image: image]*3220 Westwood Dr, Titusville 32796**Asking $210,000*4 Bed, 1.5 Bath, CBS Family home, 1397 sq. ft.Built in 1966. Garage. Large lot!Roof 2021. Brand new AC. Off market.Please Call Chris At (561) 223-8521******************[image: image]*4605 Needle Palm Dr, New Port Richey 34652**Asking $175,000*3 Bed, 2 Bath, CBS Family home, 1308 sq. ft.Built in 1971. Large lot!Overall good condition. Vacant at closing.Off market.Please Call Chris At (561) 223-8521******************[image: image]*3057 Bloomsbury Dr, Kissimmee 34747**Asking $317,990*3 Bed, 2 Bath, CBS Family home, 1363 sq. ft.Built in 1990. 2 car garage. Pool home.Currently an active Airbnb.Newly renovated large eat-in kitchen.Please Call Chris At (561) 223-8521******************[image: image]*737 Preakness Dr, Melbourne 32904**Asking $294,900*3 Bed, 2 Bath, CBS Family home, 2020 sq. ft.Built in 2003. 2 car garage. Large lot!Roof 2023. Pool is clean. Off market.Please Call Chris At (561) 223-8521******************[image: image]*2517 Hathaway Dr, Cocoa 32926**Asking $199,900*3 Bed, 3 Bath, CBS Family home, 1404 sq. ft.Built in 1966. Great location!Light rehab needed.Please Call Chris At (561) 223-8521******************[image: image]*1963 Tyler Ave, Melbourne 32935**Asking $187,000*3 Bed, 2 Bath, CBS Family home, 965 sq. ft.Built in 1959. Garage. Large lot and great location!CALL or Please Call Chris At (561) 223-8521561-223-8521******************[image: image]*1117 Riverside Dr, Melbourne 32935**Asking $189,000*2 Bed, 2 Bath, Single Family home, 1116 sq. ft.0.28 acre lot. AC is 4 years. Vinyl siding. Great shape.CALL or Please Call Chris At (561) 223-8521561-223-8521******************[image: image]*3960 Juanita St, Cocoa 32927**Asking $293,000*3 Bed, 2 Bath, CBS Family home, 1822 sq. ft.Built in 1981. 2 car garage. 0.23 acre lot!Back porch addition needs work.Please Call Chris At (561) 223-8521******************[image: image]*3000 SE 146th Pl, Summerfield 34491**Asking $135,000*3 Bed, 2 Bath, CBS Family home, 2220 sq. ft.Built in 1973. Detached garage. 0.44 acre lot.Please Call Chris At (561) 223-8521******************[image: image]*826 Daytona Ave, Holly Hill 32117**Asking $282,900*Duplex, 2 Bed, 1 Bath and 2 Bed, 2 Bath.1,072 sq. ft. Built in 1935. Off market.Please Call Chris At (561) 223-8521******************[image: image]*1306 10th St, Daytona Beach 322119**Asking $195,000*"
    //       }
    //   ];
    
      
    
    // Extract the email body from each email object
    const values = emails.map(obj => obj.body);
    
    // console.log(values);
    
    
    // Process emails
  processEmails(values)
      .then(processedData => {
    
        console.log("inside process data");
        const csvLines = processedData.join('');
        console.log(csvLines);
        
        const heading = '"Property Address","Zip Code","Wholesale Price (in $)","After Repair Value - ARV (in $)","Property Type","Bedrooms","Bathrooms","Living Area (in sq ft)","Notes"\n';
    
        fs.access(filename, fs.constants.F_OK, (err) => {
            if (!err) {
                // File exists, append data
                fs.appendFile(filename, csvLines, (err) => {
                    if (err) throw err;
                    console.log('Data appended to file successfully.');
                });
            } else {
                // File does not exist, create a new file with heading and data
                fs.writeFile(filename, heading + csvLines, (err) => {
                    if (err) throw err;
                    console.log('File created with heading and data successfully.');
                });
            }
        });
    
      
      })
      .catch(error => {
        console.error('Error processing emails:', error);
      });
    
}

module.exports = {getParsedEmail};
