'use strict';

let prod = true;
if (window.location.hostname === 'localhost') {
	console.log('not prod');
	prod = false;
}

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
		$.post(prod ? 'https://micdsmitlaunch.club/signup' : 'http://localhost:1506/signup', body, (data) => {
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

$('.divider').click(function() {
	let pageTop = $(this).add($('body')).add($('.front-page')).add($('.social-media')).add($('.rocket'));
	if (pageTop.hasClass('top')) {
		pageTop.toggleClass('moving-down');
		animating = true;
		setTimeout(() => {
			animating = false;
			onInfoPage = false;
			pageTop.toggleClass('moving-down');
			pageTop.toggleClass('top');
			$('#div-text').text('More Information');
			$('.down-chevron').toggleClass('reverse');
		}, 600);
	} else {
		pageTop.toggleClass('moving-up');
		animating = true;
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

let sidebarOpen = false;
$('.social-media').click(function() {
	$(this).toggleClass('open');
	sidebarOpen = !sidebarOpen;
});

if (matchMedia('screen and (max-width: 544px)').matches) {
	$('h2').add($('h1.display-3')).siblings().hide();
	$('h2').add($('h1.display-3')).click(function() {
		$(this).siblings().fadeIn();
	});
}

function animateRocket(svg) {
	let xPos = Math.random() * (draw.node.clientWidth);
	let yPos = draw.node.clientHeight - xPos * draw.node.clientHeight / draw.node.clientWidth;
	let animTime = 5000 + Math.random() * 10000;
	return svg.move(xPos + draw.node.clientWidth / 2, yPos + draw.node.clientHeight / 2)
		.animate(animTime).dmove(-1.3 * draw.node.clientWidth, -1.3 * draw.node.clientHeight)
		.afterAll(function() { animateRocket(this); });
}

let draw = SVG('cta-background').size('100%', '100%');
let rockets = [];
for (let i = 0; i < 5; i++) {
	let rocket = draw.use('rocket', '/assets/shooting_star.svg')
		.size(200, 200);
	animateRocket(rocket);

	rockets.push(rocket);
}

