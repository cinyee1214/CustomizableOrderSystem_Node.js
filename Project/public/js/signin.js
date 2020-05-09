$('#login-form').submit(async(event) => {
    event.preventDefault();
    const email = $('#signinEmail').val();
    const password = $('#signinPassword').val();

    try {
        await $.ajax({
            url: 'http://localhost:3000/login',
            type: 'POST',
            data: {
                email: email,
                password: password
            }
        });

        $("#loginModal").modal('hide');
        showWel();
        showEmail();
    } catch (error) {
        alert(error['responseJSON']['error']);
    }
});

$('#signup-form').submit(async(event) => {
    event.preventDefault();

    const email = $('#signupEmail').val();
    const password = $('#signupPassword').val();
    const confirmedPassword = $('#signupConfirmedPassword').val();

    try {
        await $.ajax({
            url: 'http://localhost:3000/signup',
            type: 'POST',
            data: {
                email: email,
                password: password,
                confirmedPassword: confirmedPassword
            }
        });

        $("#signupModal").modal('hide');
        $('#signupA').text("Welcome!");
        $('#signupA').removeAttr('data-toggle');
    } catch (error) {
        alert(error['responseJSON']['error']);
    }
});


// const signupModal = document.getElementById("signupModal");
// const loginModal = document.getElementById("loginModal");


const showEmail = () => {
    if (!Cookies.get('user')) {
        return;
    }
    const userInfo = JSON.parse(Cookies.get('user'));
    if (userInfo) {
        const userEmail = userInfo['email'];

        $('#loginA').text(userEmail);
        // loginModal.hidden = true;

        $('#signupA').text("Welcome!");
        // signupModal.hidden = true;
        $('#loginA').removeAttr('data-toggle');
        $('#signupA').removeAttr('data-toggle');

    }
};

const showWel = () => {
    if (!Cookies.get('user')) {
        return;
    }
    const userInfo = JSON.parse(Cookies.get('user'));
    if (userInfo) {
        $('#signupA').text("Welcome!");
        $('#signupA').removeAttr('data-toggle');
    }
};

showEmail();