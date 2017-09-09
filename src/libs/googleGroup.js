const google = require('googleapis');
const GoogleAuth = require('google-auth-library');

const authFactory = new GoogleAuth();
const directory = google.admin('directory_v1');

function addMember(email, callback) {
	authFactory.getApplicationDefault(function(err, authClient) {
		if (err) {
			console.log('Authentication failed because of ', err);
			callback('Authentication failed because of ', err);
			return;
		}
		if (authClient.createScopedRequired && authClient.createScopedRequired()) {
			let scopes = ['https://www.googleapis.com/auth/admin.directory.group.member', 'https://www.googleapis.com/auth/admin.directory.group'];
			authClient = authClient.createScoped(scopes);
		}

		let member = {
			email,
			role: 'MEMBER',
			id: '1231231'
		}
		directory.members.insert({
			auth: authClient,
			groupKey: 'mitlaunch@micds.org',
			resource: member
		}, (err, res) => {
			if (err) {
				console.log(err);
				callback(err);
				return;
			}
			callback(null);
		});
	
	});
}

module.exports.addMember = addMember;
