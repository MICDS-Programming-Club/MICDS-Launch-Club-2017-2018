'use strict';

/**
 * @file Manages the signup of members
 * @module signup
 */

const config = require(__dirname + '/config.js');
// const googleGroup = require(__dirname + '/googleGroup.js');

const _       = require('underscore');
const async   = require('async');
const mail    = require(__dirname + '/mail.js');
const request = require('request');

/**
 * Sign a user up for the Entrepreneurship club
 * @function signup
 *
 * @param {Object} data - Data about user
 * @param {string} data.email - Users's school email (ends with @micds.org)
 * @param {signupCallback} callback - Callback
 */

/**
 * Returns error if any while signing up user
 * @callback signupCallback
 *
 * @param {Object} err - Null if success, error object if failure.
 */

function signup(db, data, callback) {
	if(typeof callback !== 'function') {
		callback = function() {};
	}

	if(typeof db !== 'object') {
		callback(new Error('Invalid database connection!'));
		return;
	}
	if(typeof data.email !== 'string' || data.email === '') {
		callback(new Error('Invalid email!'));
		return;
	} else {
		data.email = data.email.toLowerCase();
	}
	if(typeof data.firstName !== 'string' || data.firstName === '') {
		callback(new Error('Invalid first name!'));
		return;
	}
	if(typeof data.lastName !== 'string' || data.lastName === '') {
		callback(new Error('Invalid last name!'));
		return;
	}
	if(typeof parseInt(data.gradYear) !== 'number' || parseInt(data.gradYear) % 1 !== 0) {
		callback(new Error('Invalid graduation year!'));
		return;
	}
	if(data.interestCompany !== '1' &&  data.interestLeader !== '1') {
		callback(new Error('Invalid interest selection!'));
		return;
	}

	const newMember = {
		student: data.email,
		firstName: data.firstName,
		lastName: data.lastName,
		gradYear: data.gradYear,
		interestCompany: !!data.interestCompany,
		interestLeader: !!data.interestLeader
	};

	// Register user
	async.series([
		// Insert user in database
		function(callback) {
			var programmerData = db.collection('members');

			programmerData.update({ student: data.email }, newMember, { upsert: true }, function(err, results) {
				if(err) {
					callback(new Error('There was a problem inserting the student into the database!'));
					return;
				}

				callback(null);

			});
		},
		// Send email
		function(callback) {
			mail.sendHTML(data.email + '@micds.org', 'MICDS MIT Launch - Welcome ' + newMember.firstName + '!', __dirname + '/../html/messages/welcome.html', newMember, function(err) {
				if(err) {
					callback(err);
					return;
				}

				callback(null);

			});
		},
		// Invite to Slack group
		function(callback) {
			request({
				url: 'https://' + config.slack.group + '.slack.com/api/users.admin.invite',
				method: 'POST',
				form: {
					email: data.email + '@micds.org',
					token: config.slack.token
				}
			}, function(err, response, body) {
				body = JSON.parse(body);

				let allowedErrors = [
					'already_invited',
					'already_in_team'
				];

				if(err || !body || (!body.ok && !_.contains(allowedErrors, body.error))) {
					callback(new Error('There was a problem inviting the user to the Slack group! ' + body.error));
					return;
				}

				callback(null);

			});
		}
		//invite to google group
		// function(callback) {
		// 	googleGroup.addMember(data.email + '@micds.org', (err) => {
		// 		if (err) {
		// 			callback(new Error(err));
		// 			return;
		// 		}
		// 		callback(null)
		// 	});
		// }
	], function(err, results) {
		if(err) {
			callback(err);
			return;
		}

		callback(null);

		// Send a message to Slack chat to celebrate!
		request({
			url: config.slack.webhookURL,
			method: 'POST',
			form: {
				token: config.slack.token,
				channel: config.slack.announceChannel,
				text: '*' + data.firstName + ' ' + data.lastName + ' (' + data.gradYear + ')* just joined MIT Launch Club! An invitation has been sent to *' + data.email + '@micds.org*.'
			}
		});

	});
}

module.exports.signup = signup;
