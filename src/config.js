/** SERVER-SIDE URL **/
const serverUrl = 'http://localhost:3005';
// const serverUrl = 'https://2wkvf7-3000.csb.app'

/** Extract the root URL (protocol + hostname + port) **/
const rootUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

export { serverUrl, rootUrl };

