const userDetails = document.getElementById("userDetails");
const orderDetails = document.getElementById("orderDetails");

orderDetails.hidden = true;

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

    const id = JSON.parse(Cookies.get('user'))._id;

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