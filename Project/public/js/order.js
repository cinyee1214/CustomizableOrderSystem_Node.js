$('#orderInfo').click(() => {
    if (!Cookies.get('cos') && !Cookies.get('hotpot')) {
        alert('Your order cart is empty!');
        return;
    }

});