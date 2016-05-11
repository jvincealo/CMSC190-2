var upload = document.getElementById('register-button');
upload.addEventListener('click', register, false);

function register(e) {
    e.preventDefault();
    var username =  $('#username-register').val().trim();

    if(username === "") {
        Materialize.toast("Please enter a username", 4000)
        return
    }

    var password = $('#password-register').val().trim();
    var repassword = $('#re-password').val().trim();

    if(password != repassword) {
        Materialize.toast("Password must match", 4000);
        return
    }

    var user = {
        'local.username' : username,
        'local.password' : password,
        admin : false
    }

    $.post('/users',
        user,
        function(data, status) {
            Materialize.toast("You may now login :)", 4000);
            $('#username-register').val('');
            $('#password-register').val('');
            $('#re-password').val('');
        }
    );
}