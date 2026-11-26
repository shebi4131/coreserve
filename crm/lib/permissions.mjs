export const permissionGroups = [
  ['Workspace', [['dashboard.view','View overview'],['reports.view','View reports and export jobs'],['team.view','View team profiles']]],
  ['Jobs', [['jobs.view','View assigned jobs and schedule'],['jobs.view_all','View all jobs'],['jobs.create','Create jobs'],['jobs.edit','Edit job details'],['jobs.assign','Assign team members'],['jobs.work','Update checklist, progress and issues'],['jobs.review','Approve submitted work'],['jobs.delete','Delete jobs']]],
  ...['customers','properties','enquiries'].map(area=>[area[0].toUpperCase()+area.slice(1), ['view','create','edit','delete'].map(action=>[`${area}.${action}`,`${action[0].toUpperCase()+action.slice(1)} ${area}`])]),
  ['Evidence', [['evidence.view','View private job photographs'],['evidence.upload','Upload job photographs']]],
  ['Locations', [['locations.view','View locations on accessible jobs'],['locations.view_all','View locations on all jobs'],['locations.track','Share own location during assigned work']]],
  ["People",[["cleaners.view","View cleaner directory and availability"],["cleaners.manage","Add and edit cleaner profiles"],["cleaners.sensitive","View and edit onboarding and verification details"]]],
  ["Business development",[["agents.view","View estate-agent outreach"],["agents.manage","Manage estate-agent outreach"]]],
  ["Catalogue",[["catalog.view","View service prices, property types and areas"],["catalog.manage","Manage services, property types and areas"]]],
  ["Finance",[["finance.view","View quotes, payments, rates, costs and profit"],["finance.edit","Edit quotes, payments, rates and costs"]]],
  ['Administration', [['users.manage','Activate accounts and assign roles'],['roles.manage','Create and edit role permissions']]],
];
export const permissionKeys = permissionGroups.flatMap(([,items])=>items.map(([key])=>key));
export const has = (user,key) => !!user?.owner || (user?.permissions||[]).includes(key);
export const pagePermission = {dashboard:'dashboard.view',jobs:'jobs.view',schedule:'jobs.view',team:'team.view',customers:'customers.view',properties:'properties.view',enquiries:'enquiries.view',evidence:'evidence.view',locations:'locations.view',reports:'reports.view',cleaners:'cleaners.view',agents:'agents.view',catalog:'catalog.view',access:'roles.manage'};
const work = ['dashboard.view','jobs.view','jobs.work','evidence.view','evidence.upload','locations.track'];
export const defaultRoles = [
  {id:'superadmin',name:'Superadmin',permissions:permissionKeys},
  {id:'manager',name:'Manager',permissions:permissionKeys.filter(p=>!['users.manage','roles.manage'].includes(p))},
  {id:'supervisor',name:'Supervisor',permissions:[...work,'team.view','jobs.review','locations.view']},
  {id:'cleaner',name:'Cleaner',permissions:work},
];
