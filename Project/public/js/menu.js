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

$('#customize-form').submit(async(event) => {
    event.preventDefault();

    var veg = $("input[name='vegeNumber']:checked").val();
    console.log(veg);

    var meat = $("input[name='meatNumber']:checked").val();
    console.log(meat);

    var cookingstyle = $("input[name='cookingStyleNumber']:checked").val();
    console.log(cookingstyle);

    var flavor = $("input[name='FlavorNumber']:checked").val();
    console.log(flavor);

    var carbohydrate = $("input[name='carbohydrateNumber']:checked").val();
    console.log(carbohydrate);

    var drink = $("input[name='drinkNumber']:checked").val();
    console.log(drink);

    try {
        console.log(10);

        $("#orderModal").modal('hide');

        await $.ajax({
            url: 'http://localhost:3000/menu/hotpot',
            type: 'POST',
            data: {
                vegetable: veg,
                meat: meat,
                cookingstyle: cookingstyle,
                flavor: flavor,
                carbohydrate: carbohydrate,
                drink: drink
            }
        });

        console.log(12);

    } catch (error) {
        alert(error['responseJSON']['error']);
    }
});

if (Cookies.get('cos')) {
    $('#orderA').removeAttr('data-toggle');
}