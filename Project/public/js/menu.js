document.getElementById('reserveDate').valueAsDate = new Date();

$('#reserve-form').submit(async(event) => {
    event.preventDefault();

    var num = $("input[name='guestNumber']:checked").val();
    console.log(num);

    var section = $("input[name='options']:checked").val();
    console.log(section);

    var date = new Date($('#reserveDate').val());
    console.log(date);

    try {
        console.log(10);

        $("#reserveModal").modal('hide');

        await $.ajax({
            url: 'http://localhost:3000/menu/hotpot',
            type: 'POST',
            data: {
                numOfGuest: num,
                section: section,
                data: date
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