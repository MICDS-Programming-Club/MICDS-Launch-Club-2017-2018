'use strict';

let onInfoPage = false;
let animating = false;
window.addEventListener('wheel', (e) => {
	if (animating) {
		e.preventDefault();
	}
	if (!animating) {
		if (e.deltaY > 0 && !onInfoPage) {
			$('.divider').trigger('click');
		}
		if (e.deltaY < 0 && onInfoPage && window.scrollY === 0) {
			$('.divider').trigger('click');
		}
	}
});

$('#signupModal').on('show.bs.modal', () => {
	let form = document.getElementById('signup-form');
	form.reset();
});

$('#signupModal').on('hide.bs.modal', () => {
	let form = document.getElementById('signup-form');
	form.reset();
});

$('#signup-submit').click(function() {
	$('#signup-feedback').css('display', 'block').text('');
	let form = document.getElementById('signup-form');
	let formData = $(form).serializeArray();
	let checkboxValid = formData.find(control => control.name === 'interestCompany') && formData.find(control => control.name === 'interestCompany');
	if (form.checkValidity() && checkboxValid) {
		$(this).attr('disabled', '');
		let body = $.param(formData);
		$.post('http://localhost:1506/signup', body, (data) => {
			$(this).attr('disabled', null);
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
	let pageTop = $(this).add($('.front-page')).add($('.info'));
	if (pageTop.hasClass('top')) {
		pageTop.toggleClass('moving-down');
		animating = true;
		setTimeout(() => {
			animating = false;
			onInfoPage = false;
			$('.info').hide();
			pageTop.toggleClass('moving-down');
			pageTop.toggleClass('top');
			$('#div-text').text('More Information');
			$('.down-chevron').toggleClass('reverse');
		}, 600);
	} else {
		pageTop.toggleClass('moving-up');
		animating = true;
		$('.info').show();
		setTimeout(() => {
			animating = false;
			onInfoPage = true;
			pageTop.toggleClass('top');
			pageTop.toggleClass('moving-up');
			$('#div-text').text('Sign Up Now');
			$('.down-chevron').toggleClass('reverse');
		}, 600);
	}
});

var draw = SVG('cta-background').size('100%', '100%');
