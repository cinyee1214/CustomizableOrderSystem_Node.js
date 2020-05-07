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

    } catch (error) {
        alert(JSON.stringify(error));
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

    } catch (error) {
        alert(JSON.stringify(error));
    }
});


const user = req.session.AuthCookie;

const showEmail = () => {
    if (user) {
        const userEmail = user['Email'];
        $('#loginSpan').text(userEmail);
    }
};

$('#signinBtn').click((event) => {
    showEmail();
});