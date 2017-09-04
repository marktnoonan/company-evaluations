var targets = [{
    "uid": 0,
    "companyName": "Joe's Bike Shop",
    "lastYearEarnings": 70000,
    "lastYearExpenses": 50000,
    "lastYearProfit": 20000,
    "totalAssets": 10000,
    "liabilities": 40000,
    "profitable": true,
    "debtRatio": 4,
    "financialInfoSource": "Reported",
    "foundedYear": 2016,
    "location": "Atlanta, GA",
    "employeeCount": 2,
    "targetMainContact": {
      "name": "Joe",
      "email": "joe@joe.joe",
      "phone": "555-555-5555"
    },
    "status": "Declined",
    "targetPosition": "Seeking Buyers",
    "nextTask": {
      "task": "Meeting with Joe",
      "deadline": "8pm, September 9, 2017"
    },
    "lastActivity": {
      "activity": "visited premises",
      "date": "September 1, 2017"
    },
    "primaryInterest": "Employees",
    "urgency": "low",
    "internalLead": "Leonard",
    "notes": "Owner is deep in debt."
  },
  {
    "uid": 1,
    "companyName": "Ali's Upholstery",
    "lastYearEarnings": 160000,
    "lastYearExpenses": 60000,
    "lastYearProfit": 100000,
    "totalAssets": 70000,
    "liabilities": 4000,
    "profitable": true,
    "debtRatio": 0.57,
    "financialInfoSource": "Audited",
    "foundedYear": 2000,
    "location": "Atlanta, GA",
    "employeeCount": 7,
    "targetMainContact": {
      "name": "Ali",
      "email": "ali@ali.ali",
      "phone": "555-666-6666"
    },
    "status": "Pending Approval",
    "targetPosition": "Not on market",
    "nextTask": {
      "task": "Finalize offer",
      "deadline": "5pm, September 21, 2017"
    },
    "lastActivity": {
      "activity": "confirmed interest in sale",
      "date": "August 30, 2017"
    },
    "primaryInterest": "Other",
    "urgency": "high",
    "internalLead": "Manny",
    "notes": "This upholstery business is killing it."
  },
  {
    "uid": 2,
    "companyName": "Radio Shed",
    "lastYearEarnings": 1000000,
    "lastYearExpenses": 3000000,
    "lastYearProfit": -2000000,
    "totalAssets": 600000,
    "liabilities": 2400000,
    "profitable": false,
    "debtRatio": 4,
    "financialInfoSource": "Inferred / Mixed",
    "foundedYear": 1970,
    "location": "Seattle, WA",
    "employeeCount": 12000,
    "targetMainContact": {
      "name": "Stan",
      "email": "stan@stan.ley",
      "phone": "555-444-4444"
    },
    "status": "Approved",
    "targetPosition": "Seeking Buyers",
    "nextTask": {
      "task": "get check for $1",
      "deadline": "8am, September 20, 2017"
    },
    "lastActivity": {
      "activity": "received flyer in mail",
      "date": "September 3, 2017"
    },
    "primaryInterest": "Brand Recognition",
    "urgency": "low",
    "internalLead": "Jennifer",
    "notes": "a dollar seems high for this"
  }
];


var formChildren = {
  "requiredStrings": ["companyName", "internalLead"],
  "strings": ["location", "mainContactName", "mainContactEmail", "mainContactPhone", "notes"],
  "integers": ["lastYearEarnings", "lastYearExpenses", "totalAssets", "liabilities", "employeeCount", "foundedYear"],
  "selects": ["status", "targetPosition", "urgency", "financialInfoSource", "primaryInterest"]

}

var selectOptions = {
  "status": ["Researching", "Pending Approval", "Approved", "Declined"],
  "targetPosition": ["Seeking Buyers", "Not on market"],
  "urgency": ["low", "normal", "high"],
  "financialInfoSource": ["Reported", "Audited", "Inferred / Mixed"],
  "primaryInterest": ["Product", "Employees", "Physical Assets", "Digital Assets"]
}

var readableFormFields = {
companyName: "Company Name",
internalLead: "Our Lead Person",
location: "Company Location",
mainContactName: "Contact Person at Company",
mainContactEmail: "Email Address",
mainContactPhone: "Phone Number",
notes: "Initial Notes",
lastYearEarnings: "Earnings Last Year",
lastYearExpenses: "Expenses Last Year",
totalAssets: "Total Value of Assets",
liabilities: "Total Value of Liabilities",
employeeCount: "Number of Employees",
foundedYear: "Year Founded",
status: "Status of Acquisition",
targetPosition: "Public Position of Business",
urgency: "Priority of Acquisition",
financialInfoSource: "Source of Financial Information",
primaryInterest: "Main Feature of Interest"
}

var newTargetDefaults = {
  "lastYearProfit": "Need earnings and expenses",
  "profitable": false,
  "debtRatio": "Need assets and liabilities",
  "nextTask": {
    "task": "Continue research",
    "deadline": ""
  },
  "lastActivity": {
    "activity": "Added to pipline",
    "date": new Date().toString().substring(0,15)
  }
}


/*
EDITABLE Fields and input types

These should only cover data that a human must provide, anything that can be calculated on our end should be.

lets group by input type and make arrays to loop through when making the template


"companyName": string *required
"internalLead": string *required

"targetMainContact": string name, email, phone (do basic sanity check)

"notes": string.
"location": string
targetMainContact.name: string
targetMainContact.email: string
targetMainContact.phone: string

"lastYearEarnings": int
"lastYearExpenses": int
"totalAssets": int
"liabilities": int
"employeeCount": int
"foundedYear": int

"status": select
"targetPosition": select
"urgency": select

"financialInfoSource": select, with option for other
"primaryInterest": select, with option for Other, then show string input


so, broken into arrays

{
"requiredStrings": ["companyName","internalLead"],
"strings": ["notes", "location", "mainContactName", "mainContactEmail", "mainContactPhone"],
"integers": ["lastYearEarnings", "lastYearExpenses", "totalAssets", "liabilities", "employeeCount", "foundedYear"],
"selects": ["status", "targetPosition", "urgency","financialInfoSource", "primaryInterest"]
}

for the selects, we need arrays of options. ALL will have "other" or "new item" or something

{
"status":["Researching", "Pending Approval", "Approved", "Declined"],
 "targetPosition": ["Seeking Buyers", "Not on market"],
  "urgency": ["low", "normal", "high"],
  "financialInfoSource": ["Reported", "Audited", "Inferred / Mixed"],
 "primaryInterest":["Product", "Employees", "Physical Assets", "Digital Assets" ]
}



Calculated fields:

"lastYearProfit": int (lastYearEarnings - lastYearExpenses)
"profitable": bool (lastYearProfit > 0?)
"debtRatio": int (liabilities / assets)

Ignored fields:
"nextTask": user should handle elsewhere. defaults to "no scheduled tasks"
"lastActivity": is reported by CRM. defaults to "no previous contacts"



*/








// Financials: Earnings last year, costs last year, profit or loss last year, value of assets, value of liabilities.
//   - From this we calculate: Boolean for profitable or not. Ratio of assets to liabilities expressed as gearing/leverage.
// Reliability of financials: Audited || Reported by company || Inferred from other information.
//   - both of these contribute to overall impression of health of the business.
// Basic company info: Location, when founded, number of employees, product(s) we are interested in.
// Company info related to acquisition: important contact people, phone numbers etc. - Maybe it links to a fictional CRM for full details.
//
// Pipeline info
// Status (e.g., researching, pending approval, approved, declined)
// Maybe between researching and pending approval there is another status that contains a few points to be checked off before submission for approval?
// Company public status: actively seeking buyers || not officially on market
//
// Next task: description and deadline. - expanding points to CRM. Cannot edit here. May sort by this.
//
// Most recent activity: description and date. - expanding points to CRM. Cannot edit here. May sort by this eventually.
//
// Our Main interest: product || employees || physical assets || digital assets || other
// Our urgency: low || normal || high - totally arbitrary internal thing that might as well be there.
//
// Internal lead: Person who owns this from our side.
