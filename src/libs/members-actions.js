const config = require(__dirname + '/config.js');
// const googleGroup = require(__dirname + '/googleGroup.js');

const _       = require('underscore');
const async   = require('async');
const request = require('request');

function leave(db, data, callback) {
	if(typeof callback !== 'function') {
		callback = function() {};
	}

	if(typeof db !== 'object') {
		callback(new Error('Invalid database connection!'));
		return;
	}

	if (typeof data.student !== 'string') {
		callback(new Error('Invalid username!'));
		return;
	}

	const membersData = db.collection('members');
	
	membersData.update({ student: data.student }, { $set: { unsubscribed: true } }, { upsert: false }, function(err, res) {
		if (err) {
			callback(new Error(err));
			return;
		}

		if (res.result.nModified === 0) {
			callback(new Error('User does not exist!'));
			return;
		}
		// Send a message to Slack chat to celebrate!
		request({
			url: config.slack.webhookURL,
			method: 'POST',
			json: {
				text: '*' + data.student + '* just left MIT Launch Club.'
			}
		}, function(err, response, body) {
			callback(null)
		});
	});

}

module.exports.leave = leave;
