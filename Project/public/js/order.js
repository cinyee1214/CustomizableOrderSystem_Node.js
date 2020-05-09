const userDetails = document.getElementById("userDetails");
const orderDetails = document.getElementById("orderDetails");

$('#orderInfo').click(() => {
    if (!Cookies.get('cos') && !Cookies.get('hotpot')) {
        alert('Your order cart is empty!');
        return;
    }

    userDetails.hidden = true;
    orderDetails.hidden = false;

});

$('#userInfo').click(() => {

    userDetails.hidden = false;
    orderDetails.hidden = true;

});