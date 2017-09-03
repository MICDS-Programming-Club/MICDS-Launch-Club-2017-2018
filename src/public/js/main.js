'use strict';

$('#signupModal').on('show.bs.modal', () => {
	let form = document.getElementById('signup-form');
	form.reset();
});

$('#signupModal').on('hide.bs.modal', () => {
	let form = document.getElementById('signup-form');
	form.reset();
});

$('#signup-submit').click(() => {
	$('#signup-feedback').css('display', 'block').text('');
	let form = document.getElementById('signup-form');
	let formData = $(form).serializeArray();
	let checkboxValid = formData.find(control => control.name === 'interestCompany') && formData.find(control => control.name === 'interestCompany');
	if (form.checkValidity() && checkboxValid) {
		let body = $.param(formData);
		$.post('http://localhost:1506/signup', body, (data) => {
			if (data.error) {
				$('#signup-feedback').css('display', 'block').text(data.error);
			} else {
				console.log('succ');
				$('#signupModal').modal('hide');
			}
		})
	} else {
		$(form).addClass('was-validated');
		$('.form-control:invalid').parent().siblings().filter('.invalid-feedback').css('display', 'block');
		if (!checkboxValid) {
			$('.form-check-input').addClass('is-invalid');
		}
	}
});

$('.info').hide();

$('.divider').click(function() {
	let pageTop = $(this).add($('.front-page'));
	if (pageTop.hasClass('top')) {
		$('.info').hide();
		pageTop.toggleClass('moving-down');
		setTimeout(() => {
			pageTop.toggleClass('moving-down');
			pageTop.toggleClass('top');
			$('#div-text').text('More Information');
		}, 600);
	} else {
		pageTop.toggleClass('moving-up');
		setTimeout(() => {
			pageTop.toggleClass('top');
			pageTop.toggleClass('moving-up');
			$('.info').show();
			$('#div-text').text('Sign Up Now');
		}, 605);
	}
});

var draw = SVG('cta-background').size('100%', '100%');
