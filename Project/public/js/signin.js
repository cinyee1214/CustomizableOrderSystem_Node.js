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
                hashedPassword: password,
            },
        });

        console.log(email);
        window.location.replace('http://localhost:3000/userOrder');

    } catch (error) {
        alert(error);
    }
});