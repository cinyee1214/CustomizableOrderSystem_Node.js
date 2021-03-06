const userDetails = document.getElementById("userDetails");
const orderDetails = document.getElementById("orderDetails");
const Cosfooter = document.getElementById("Cosfooter");
const HPfooter = document.getElementById("HPfooter");

const id = JSON.parse(Cookies.get('user'))._id;

userDetails.hidden = true;

$('#orderInfo').click(() => {
    // if (!Cookies.get('cos') && !Cookies.get('hotpot')) {
    //     alert('Your order cart is empty!');
    //     return;
    // }

    userDetails.hidden = true;
    orderDetails.hidden = false;

});

$('#userInfo').click(() => {

    userDetails.hidden = false;
    orderDetails.hidden = true;

});

$('#userInfoUpdate').submit(async(event) => {
    event.preventDefault();

    console.log(id);

    const firstname = $('#firstname').val();
    const lastname = $('#lastname').val();
    const email = $('#emailid').val();
    const password = $('#passwordid').val();
    const cpassword = $('#cpasswordid').val();
    const telnum = $('#telnum').val();
    const address = $('#address').val();

    console.log(firstname);
    console.log(lastname);
    console.log(address);

    if (email) {
        JSON.parse(Cookies.get('user')).email = email;
    }

    try {
        await $.ajax({
            url: '/users',
            type: 'PATCH',
            data: {
                userId: id,
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password,
                cpassword: cpassword,
                telnum: telnum,
                address: address
            }
        });

        alert("Update successfully!");

    } catch (error) {
        alert(error['responseJSON']['error']);
    }
});

const showHotPot = async() => {
    try {
        const hotpots = await $.ajax({
            url: '/users/hotpot',
            type: 'GET'
        });

        if (hotpots.length > 0) {
            HPfooter.hidden = true;
        }

        console.log(hotpots);

        // $('#orderHotPot').html();

        for (let i = 0; i < hotpots.length; ++i) {
            const hotpot = hotpots[i];

            var hotpotdiv = $("<br><div class='row orderCosDiv'></div>");

            const editBtn = getEditBtn(hotpot._id);

            const deleteBtn = getDeleteBtn(hotpot._id);

            var imgHotpot = getImageOfHotpot(hotpot.numofGuest);

            // console.log(hotpot.numofGuest);
            // console.log(hotpot.section);
            // console.log(hotpot.date);
            // console.log(typeof hotpot.date);

            const date = hotpot.date.split(',');
            // console.log(date);
            // console.log(typeof date);

            var spacediv = $("<div class='col-12 col-sm-1 align-self-center'></div>");

            var infoDiv = $(`<div class="hotpotInfo col-12 col-sm align-self-center">
                                <h5>Reservation ${i + 1}:</h5>
                                <br>
                                <small>
                                    <p>Number of Guests: ${hotpot.numofGuest}</p>
                                    <p>Section: ${hotpot.section}</p>
                                    <p>Date: ${date[0]}/${date[1]}/${date[2]}</p>
                                </small>
                            </div>`);

            $(hotpotdiv).append(imgHotpot).append(spacediv).append(infoDiv).append(editBtn).append(deleteBtn);

            $('#orderHotPot').append(hotpotdiv);

            deleteBtn.click(deleteHotpot);

            editBtn.click(editHotpot);
        }

    } catch (error) {
        alert(error['responseJSON']['error']);
    }
};

const showCos = async() => {
    try {
        const dishes = await $.ajax({
            url: '/users/cos',
            type: 'GET'
        });

        // console.log(dishes);

        if (dishes.length > 0) {
            Cosfooter.hidden = true;
        }

        for (let i = 0; i < dishes.length; ++i) {
            const dish = dishes[i];

            var dishdiv = $("<br><div class='row orderCosDiv' ></div>");
            // style="position: relative;"
            const editBtn = getEditBtn(dish._id);
            // style="position: absolute; top: 0; right: 42px;"
            const deleteBtn = getDeleteBtn(dish._id);
            // style="position: absolute; top: 0; right: 0;"
            var imgProduct = getImageOfProdcut(dish.vegetable, dish.meat);
            var imgCH = getImageOfCH(dish.carbohydrate);
            var imgDiv = getImageOfDrink(dish.drink);

            var imgComb = $("<div class='col-12 col-sm-1 cosImgDiv'></div>");
            $(imgComb).append(imgCH).append(imgDiv);

            var spacediv = $("<div class='col-12 col-sm-1 align-self-center'></div>");

            var infoDiv = $(`<div class="dishInfo col-12 col-sm align-self-center">
                                <h5>Order ${i + 1}:  ${dish.cookingStyle} ${dish.meat} with ${dish.vegetable}</h5>
                                <br>
                                <small>
                                    <p>Flavor: ${dish.flavor}</p>
                                    <p>Serving with: ${dish.carbohydrate} and ${dish.drink}</p>
                                </small>
                            </div>`);



            $(dishdiv).append(imgProduct).append(imgComb).append(spacediv).append(infoDiv).append(editBtn).append(deleteBtn);

            $('#orderCos').append(dishdiv);

            deleteBtn.click(deleteCos);

            editBtn.click(editCos);
        }

    } catch (error) {
        alert(error['responseJSON']['error']);
    }
};

const getEditBtn = (id) => {
    var btn = $(
        `<button class="btn editBtn btn-default" data-id="${id}" >
            <span class="fa fa-pencil-square-o" aria-hidden="true"></span>
        </button>`
    );
    return btn;
};

const getDeleteBtn = (id) => {
    var btn = $(
        `<button type="button" class="btn deleteBtn btn-default" data-id="${id}">
            <span class="fa fa-trash-o" aria-hidden="true"></span>
        </button>`
    );
    return btn;
};

const getImageOfProdcut = (veg, meat) => {
    var imgDiv;
    if (veg == 'Tomato') {
        if (meat == 'Beef') {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/tmt_bf.png" alt="tmt_bf"></img>
            </div>`);
        } else if (meat == 'Pork') {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/tmt_pork.png" alt="tmt_pork"></img>
            </div>`);
        } else {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/tmt_ch.png" alt="tmt_ch"></img>
            </div>`);
        }
    } else if (veg == 'Potato') {
        if (meat == 'Beef') {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/ptt_bf.png" alt="ptt_bf"></img>
            </div>`);
        } else if (meat == 'Pork') {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/ptt_pork.png" alt="ptt_pork"></img>
            </div>`);
        } else {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/ptt_ch.png" alt="ptt_ch"></img>
            </div>`);
        }
    } else if (veg == 'Mushroom') {
        if (meat == 'Beef') {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/mr_bf.png" alt="mr_bf"></img>
            </div>`);
        } else if (meat == 'Pork') {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/mr_pork.png" alt="mr_pork"></img>
            </div>`);
        } else {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/mr_ch.png" alt="mr_ch"></img>
            </div>`);
        }
    } else {
        if (meat == 'Beef') {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/eg_bf.png" alt="eg_bf"></img>
            </div>`);
        } else if (meat == 'Pork') {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/eg_pork.png" alt="eg_pork"></img>
            </div>`);
        } else {
            imgDiv = $(`
            <div class="col-12 col-sm-2 cosImgDiv">
                <img class="d-block img-fluid" src="img/eg_ch.png" alt="eg_ch"></img>
            </div>`);
        }
    }
    return imgDiv;
};

const getImageOfCH = (carbohydrate) => {
    var imgDiv;
    if (carbohydrate == 'Rice') {
        imgDiv = $(`
                    <div class="col-6 col-sm-12 column">
                        <img class="d-block img-fluid" src="img/rice.png" alt="rice"></img>
                    </div>`);
    } else {
        imgDiv = $(`
                    <div class="col-6 col-sm-12 column">
                    <img class="d-block img-fluid" src="img/noodles.png" alt="noodles"></img>
                    </div>`);
    }
    return imgDiv;
};

const getImageOfDrink = (drink) => {
    var imgDiv;
    if (drink == 'Milk') {
        imgDiv = $(`
                    <div class="col-6 col-sm-12 column">
                        <img class="d-block img-fluid" src="img/milk.png" alt="milk"></img>
                    </div>`);
    } else {
        imgDiv = $(`
                    <div class="col-6 col-sm-12 column">
                    <img class="d-block img-fluid" src="img/soda.png" alt="soda"></img>
                    </div>`);
    }
    return imgDiv;
};

const getImageOfHotpot = (num) => {
    var imgdiv;
    if (num < 4) {
        imgdiv = $(`
        <div class="col-12 col-sm-3 cosImgDiv">
            <img class="d-block img-fluid" src="img/1-3.png" alt="1-3">
        </div>`);
    } else {
        imgdiv = $(`
        <div class="col-12 col-sm-3 cosImgDiv">
            <img class="d-block img-fluid" src="img/4-6.png" alt="4-6">
        </div>`);
    }
    return imgdiv;
};

const deleteHotpot = async(event) => {
    event.preventDefault();

    if (!ConfirmDelete()) {
        return;
    }

    try {
        const id = event.currentTarget.dataset.id;
        await $.ajax({
            url: '/users/hotpot/' + id,
            type: 'DELETE'
        });

        window.setTimeout(function() {
            location.reload();
        }, 500);

    } catch (error) {
        alert(error['responseJSON']['error']);
    }

};

const deleteCos = async(event) => {
    event.preventDefault();

    if (!ConfirmDelete()) {
        return;
    }

    try {
        const id = event.currentTarget.dataset.id;
        await $.ajax({
            url: '/users/cos/' + id,
            type: 'DELETE'
        });

        window.setTimeout(function() {
            location.reload();
        }, 500);

    } catch (error) {
        alert(error['responseJSON']['error']);
    }

};

function ConfirmDelete() {
    var x = confirm("Are you sure you want to delete this item?");
    if (x)
        return true;
    else
        return false;
};

const editHotpot = async(event) => {
    event.preventDefault();

    document.getElementById('reserveDate').valueAsDate = new Date();

    $('#editHotpotModal').modal('show');

    const id = event.currentTarget.dataset.id;
    console.log(id);

    $('#editHotpot-form').submit(async(event) => {
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

        if (!num || !section || !date) {
            alert("Please provide all the reservation information!");
            return;
        }

        try {
            await $.ajax({
                url: '/users/hotpot/' + id,
                type: 'PUT',
                data: {
                    _id: id,
                    numOfGuest: num,
                    section: section,
                    date: dateVal
                }
            });

            await showHotPot();
            $('#editHotpotModal').modal('hide');

            window.setTimeout(function() {
                location.reload();
            }, 500);

        } catch (error) {
            alert(error['responseJSON']['error']);
        }

    });
};

const editCos = async(event) => {
    event.preventDefault();

    $('#editCosModal').modal('show');

    const id = event.currentTarget.dataset.id;
    console.log(id);

    $('#editCos-form').submit(async(event) => {
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

        try {
            await $.ajax({
                url: '/users/cos/' + id,
                type: 'PUT',
                data: {
                    vegetable: veg,
                    meat: meat,
                    cookingStyle: cookingstyle,
                    flavor: flavor,
                    carbohydrate: carbohydrate,
                    drink: drink
                }
            });

            console.log(14);
            $('#editCosModal').modal('hide');
            await showCos();

            window.setTimeout(function() {
                location.reload();
            }, 500);

        } catch (error) {
            alert(error['responseJSON']['error']);
        }
    });
};

showHotPot();
showCos();