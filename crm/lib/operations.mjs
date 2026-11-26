export const days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
export const slots=['Morning','Afternoon','Evening','Overnight'];
export const leadSources=['Meta Instant Form','Meta Ad – Website','Website Quote Form','Google Search','Google Business Profile','WhatsApp','Phone Call','Estate / Letting Agent','Referral','Repeat Customer','Trustpilot','Other'];
export const leadStatuses=['New','Contacted','Quote Sent','Follow-up','Booked','Lost','Not Interested'];
export const bookingStatuses=['Not booked','Booked','Cleaner Assigned','In Progress','Completed','Re-clean Requested','Cancelled'];
export const paymentStatuses=['Unpaid','Deposit Paid','Part Paid','Paid','Refunded'];
export const cleanerStatuses=['Available','Active','Busy','Trial','Paused','Left'];
export const outreachStatuses=['Pending','Contacted','Follow up','Interested','Not interested'];
export const visaStatuses=['British / Irish citizen','Settled status / indefinite leave','Pre-settled status','Student visa','Graduate visa','Skilled Worker visa','Dependant/family visa or other valid UK work permission','Other / to confirm'];
export const financialFields=['quotePence','cleanerPayPence','materialsPence','amountPaidPence'];
export const sensitiveCleanerFields=['address','visaStatus','rightToWork','rtwDocsChecked','dbsCheck','insurance','notes'];
export const finance=(r={})=>{const quote=Number(r.quotePence)||0,pay=Number(r.cleanerPayPence)||0,materials=Number(r.materialsPence)||0,paid=Number(r.amountPaidPence)||0,cost=pay+materials;return {quote,cost,profit:quote-cost,margin:quote?((quote-cost)/quote)*100:0,paid,balance:quote-paid};};
export const gbp=pence=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format((Number(pence)||0)/100);
export const ukToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London'}).format(new Date());
export const isDue=(date,today=ukToday())=>!!date&&date<=today;
export function rowsForOperations(state){return [...(state.enquiries||[]).map(r=>({...r,collection:'enquiries'})),...(state.jobs||[]).map(r=>({...r,name:r.name||r.customer||r.title,details:r.details||r.notes,collection:'jobs'}))];}
export const moneyInput=pence=>pence===undefined||pence===null?'':(pence/100).toFixed(2);
