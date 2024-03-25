/** SERVER-SIDE URL **/
// const serverUrl = 'http://localhost:3005'; //Localhost
// const serverUrl = 'https://2wkvf7-3000.csb.app' //Derrick codesandbox
const serverUrl = 'https://nk7rt3-3005.csb.app' //Crownzcom codesandbox

/** Extract the root URL (protocol + hostname + port) **/
const rootUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

export { serverUrl, rootUrl };

