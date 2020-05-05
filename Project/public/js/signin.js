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
        await Swal.fire({
            icon: 'error',
            title: error['responseJSON']['message'],
            showConfirmButton: false,
            timer: 1000,
            position: 'top',
        });
    }
});