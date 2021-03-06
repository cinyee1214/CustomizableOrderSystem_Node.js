document.getElementById('reserveDate').valueAsDate = new Date();

$('#reserve-form').submit(async(event) => {
    event.preventDefault();

    var num = $("input[name='guestNumber']:checked").val();
    console.log(num);
    console.log(typeof num);

    var section = $("input[name='options']:checked").val();
    console.log(section);

    var date = new Date($('#reserveDate').val());
    console.log(date);

    const day = date.getDate() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    // const dateVal = month + "/" + day + "/" + year;
    const dateVal = [month, day, year];

    console.log(dateVal);
    console.log(typeof dateVal);

    try {
        console.log(10);

        $("#reserveModal").modal('hide');

        await $.ajax({
            url: '/menu/hotpot',
            type: 'POST',
            data: {
                numOfGuest: num,
                section: section,
                date: dateVal
            }
        });

        console.log(typeof dateVal[0]);

    } catch (error) {
        alert(error['responseJSON']['error']);
    }
});

$('#orderA').click(async(event) => {
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

    if (!veg || !meat || !cookingstyle || !flavor || !carbohydrate || !drink) {

        alert("Please select one kind of each ingredient!");
        return;
    }

    const info = "Your order is: " + cookingstyle + " " + flavor + " " + meat + " with " + veg + " serving with " + carbohydrate + " and " + drink;
    $('#orderP').text(info);

    $('#customize-form').submit(async(event) => {
        try {
            $("#orderModal").modal('hide');

            await $.ajax({
                url: '/menu/customize',
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

            console.log(14);

        } catch (error) {
            alert(error['responseJSON']['error']);
        }
    });

});

const footer = document.getElementById("feedbackFooter");

const showFeedback = async() => {
    try {
        const feedbacks = await $.ajax({
            url: '/menu/feedback',
            type: 'GET'
        });

        console.log(feedbacks);

        if (feedbacks.length > 0) {
            footer.hidden = true;
        }

        for (let i = 0; i < feedbacks.length; ++i) {
            const feedback = feedbacks[i];

            var feedbackdiv = $("<br><div class='row orderCosDiv'></div>");

            var infoDiv = $(`<div class="col-12 col-sm align-self-center">
                                <h5>Customor ${feedback.firstname}: <small>${feedback.feedback}</small></h5>
                            </div>`);

            $(feedbackdiv).append(infoDiv);

            $('#showFeedbackDiv').append(feedbackdiv);

            console.log("done");
        }

    } catch (error) {
        alert(error['responseJSON']['error']);
    }
};

showFeedback();