'use strict';

let prod = true;
if (window.location.hostname === 'localhost') {
	console.log('not prod');
	prod = false;
}

$('#leave-form').submit(function(event) {
	event.preventDefault();
	let formData = $(this).serializeArray();
	let submitBtn = $('#leave-submit');
	console.log(formData);
	if (this.checkValidity()) {
		submitBtn.attr('disabled', '');
		let body = $.param(formData);
		$.post(prod ? 'https://micdsmitlaunch.club/signup' : 'http://localhost:1506/leave', body, (data) => {
			$(this).attr('disabled', null);
			if (data.error) {
				$('#leave-feedback').css('display', 'block').text(data.error);
			} else {
				this.reset();
			}
		});
	}
})