var User;
$(function () {
	if(!sessionStorage.Auth) {
			window.location.assign("index.html");
	}
	$('.callout-danger').hide();
	 User = ISSP.auth.userdata[0];
	//console.log(user);
	if(User.status == 101) {
		$('.callout-danger').show();
		$('.callout-danger p').html("This account is not yet verified. We will contact you soon for verification. Thanks!");
	}
	profile();
	status();

	$(".signoutbtn").on("click", function() {
			var r = confirm("Are you sure you want to sign out?");
				if (r == true) {
					delete sessionStorage.Auth;
				  	window.location.assign("index.html")
				}

		});

});


function profile() {
	$('.username').html(User.username);
	$('.fullname').html(User.fullname);
	$('.email').html(User.email);
	$('.company').html(User.company);
	$('.contact').html(User.contact_number);
	$('.address').html(User.address);
}

function status() {
	var status = User.status;
	switch(status) {
    case 1:
        $('.status').html("Active");
        break;
    case 101:
        $('.status').html("Not yet verified");
        break;
    default:
        $('.status').html("Deactivated");
}
	if(User.status == 1) {
		$('.status').html("Verified");
	}
}