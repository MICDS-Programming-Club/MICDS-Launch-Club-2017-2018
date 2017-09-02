'use strict';

$('#signup-submit').click(() => {
	$('#signup-feedback').css('display', 'block').text('');
	let form = document.getElementById('signup-form');
	if (form.checkValidity()) {
		let body = $.param($('#signup-form').serializeArray());
		$.post('http://localhost:1506/signup', body, (data) => {
			if (data.error) {
				$('#signup-feedback').css('display', 'block').text(data.error);
			} else {
				console.log('succ');
				$('#signupModal').modal('hide');
				form.reset();
			}
		})
	} else {
		$(form).addClass('was-validated');
		$('.form-control:invalid').parent().siblings().filter('.invalid-feedback').css('display', 'block');
	}
});

$('.info').hide();

$('.divider').click(function() {
	let pageTop = $(this).add($('.front-page'));
	if (pageTop.hasClass('top')) {
		pageTop.toggleClass('moving-down');
		setTimeout(() => {
			pageTop.toggleClass('moving-down');
			pageTop.toggleClass('top');
		}, 600);
	} else {
		pageTop.toggleClass('moving-up');
		setTimeout(() => {
			pageTop.toggleClass('top');
			pageTop.toggleClass('moving-up');
		}, 605);
	}
})
var draw = SVG('cta-background').size('100%', '100%');
