document.getElementById('reserveDate').valueAsDate = new Date();

$('#reserve-form').submit(async(event) => {
    event.preventDefault();

    var num = $("input[name='guestNumber']:checked").val();
    console.log(num);

    try {
        console.log(10);

        $("#reserveModal").modal('hide');

        await $.ajax({
            url: 'http://localhost:3000/menu/hotpot',
            type: 'POST',
            data: {
                num: num
            }
        });

        console.log(12);

    } catch (error) {
        alert(error['responseJSON']['error']);
    }
});

if (Cookies.get('hotpot')) {
    $('#reserveA').removeAttr('data-toggle');
}