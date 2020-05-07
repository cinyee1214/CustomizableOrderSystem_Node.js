$('#feedback-form').submit(async(event) => {
    event.preventDefault();

    const firstname = $('#firstname').val();
    const lastname = $('#lastname').val();
    const areacode = $('#areacode').val();
    const telnum = $('#telnum').val();
    const emailid = $('#emialid').val();
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
                emailid: emailid,
                feedback: feedback
            }
        });

    } catch (error) {
        alert(JSON.stringify(error));
    }
});