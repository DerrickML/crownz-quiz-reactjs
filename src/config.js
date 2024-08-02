/** Extract the root URL (protocol + hostname + port) **/
const rootUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

/** SERVER-SIDE URL **/
// const serverUrl = 'https://server.exampreptutor.com' //ExamPrepTutor Server UR

/** LOCALHOST TESTING URL **/
const serverUrl = 'http://localhost:3005'; //Localhost

/** CODE-SANDBOX URL **/
// const serverUrl = 'https://nk7rt3-3005.csb.app' //Crownzcom codesandbox

export { serverUrl, rootUrl };

