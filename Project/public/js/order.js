const userDetails = document.getElementById("userDetails");
const orderDetails = document.getElementById("orderDetails");
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
            url: 'http://localhost:3000/users',
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
            url: 'http://localhost:3000/users/hotpot',
            type: 'GET'
        });

        $('#orderHotPot').empty();

        for (let i = 0; i < hotpots.length; ++i) {
            const hotpot = hotpots[i];
            const $hotpot = $(`
            <div class="hotpot">
                <div class="hotpotInfo">
                    <p>Reservation ${i + 1}:</p>
                    <p>Number of Guests: ${hotpot.numofGuest}</p>
                    <p>Section: ${hotpot.section}</p>
                    <p>Date: ${hotpot.date}</p>
                </div>
            </div>`);

            const cancelBtn = $(
                `<button class="btn btn-sm btn-outline-info" data-id="${hotpot._id}">Cancel</button>`
            );
            const editBtn = $(
                `<button class="btn btn-sm btn-outline-info" data-id="${hotpot._id}">Edit</button>`
            );

            cancelBtn.click(cancelHotPot);

            editBtn.click((event) => {

            });

        }


    } catch (error) {
        alert(error['responseJSON']['error']);
    }
};