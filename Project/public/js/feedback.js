$('#feedback-form').submit(async(event) => {
    event.preventDefault();

    const firstname = $('#firstname').val();
    const lastname = $('#lastname').val();
    const areacode = $('#areacode').val();
    const telnum = $('#telnum').val();
    const email = $('#emailid').val();
    const feedback = $('#feedback').val();

    try {
        await $.ajax({
            url: 'http://localhost:3000/contact/feedback',
            type: 'POST',
            data: {
                firstname: firstname,
                lastname: lastname,
                areacode: areacode,
                telnum: telnum,
                email: email,
                feedback: feedback
            }
        });

        alert('Your feedback has been sent to us successfully!');

    } catch (error) {
        alert(error['responseJSON']['error']);
    }
});