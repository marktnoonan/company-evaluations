var targets = [{
  "uid": 0,
  "companyName": "Joe's Bike Shop",
  "lastYearEarnings": 70000,
  "lastYearExpenses": 50000,
  "lastYearProfit": 20000,
  "totalAssets": 10000,
  "liabilities": 400000,
  "profitable": true,
  "debtRatio": 4,
  "financialInfoSource": "Reported",
  "foundedYear": 2016,
  "location": "Atlanta, GA",
  "employeeCount": 2,
  "targetMainContact": {"name": "Joe", "email": "joe@joe.joe", "phone": 555-555-5555},
  "status": "Researching",
  "targetPosition": "Seeking Buyers",
  "nextTask": {"task": "Meeting with Joe", "time": "8pm, September 9, 2017"},
  "lastActivity":{"activity": "visited premises", "date": "September 1, 2017"},
  "primaryInterest": "Employees",
  "urgency": "low",
  "internalLead": "Leonard"
}];

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
