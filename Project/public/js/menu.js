$('#reserve-form').submit(async(event) => {
    event.preventDefault();

    const num = $('input[name=guestNumber]:checked', '#reserve-form').val();

    try {
        await $.ajax({
            url: 'http://localhost:3000/menu/',
            type: 'POST',
            data: {
                num: num
            }
        });

        $("#reserveModal").modal('hide');
        $('#reserveA').removeAttr('data-toggle');

    } catch (error) {
        alert(error['responseJSON']['error']);
    }
});