const userInfo = JSON.parse(Cookies.get('user'));
const userId = userInfo['_id'];

// util
const showSwal = async(icon, title) => {
    await Swal.fire({
        icon: icon,
        title: title,
        showConfirmButton: false,
        timer: 1500,
    });
};

// navbar
const logout = async(event) => {
    event.preventDefault();
    await $.ajax({
        url: `http://localhost:3000/users/logout`,
    });
    window.location.replace('http://localhost:3000/entry');
};

const renderUsername = () => {
    const userName = userInfo['userName'];
    if (userName !== undefined) {
        $('#username').text(userName);
    }
};

// psersonal info
const infoPreload = async() => {
    const userData = await $.ajax({
        url: `http://localhost:3000/users/account/${userId}`,
    });

    const userName = userData.userName;
    const email = userData.email;
    const phoneNumber = userData.phoneNumber;
    const address = userData.address;
    const zipCode = userData.zipCode;
    const bio = userData.bio;

    $('#form-username').val(userName);
    $('#form-email').val(email);
    if (phoneNumber) $('#form-phonenumber').val(phoneNumber);
    if (address) $('#form-address').val(address);
    if (zipCode) $('#form-zipcode').val(zipCode);
    if (bio) $('#form-bio').val(bio);
};

const infoSubmit = async(event) => {
    event.preventDefault();

    if ($('#userNameRule').attr('class') === 'formatRules') {
        $('#userNameRule').removeClass('formatRules').addClass('hidden');
    }
    if ($('#emailRule').attr('class') === 'formatRules') {
        $('#emailRule').removeClass('formatRules').addClass('hidden');
    }
    if ($('#phoneNumberRule').attr('class') === 'formatRules') {
        $('#phoneNumberRule').removeClass('formatRules').addClass('hidden');
    }
    if ($('#zipCodeRule').attr('class') === 'formatRules') {
        $('#zipCodeRule').removeClass('formatRules').addClass('hidden');
    }

    const userData = await $.ajax({
        url: `http://localhost:3000/users/account/${userId}`,
    });

    const userName = userData.userName;
    const email = userData.email;
    const phoneNumber = userData.phoneNumber;
    const zipCode = userData.zipCode;

    const inputName = $('#form-username').val();
    const inputEmail = $('#form-email').val();
    const inputNumber = $('#form-phonenumber').val();
    const inputAddress = $('#form-address').val();
    const inputZip = $('#form-zipcode').val();
    const bio = $('#form-bio').val();

    let newInfo = {
        userName: userName,
        email: email,
        phoneNumber: phoneNumber,
        address: inputAddress,
        zipCode: zipCode,
        bio: bio,
    };

    let inputCheck = true;

    if (inputName !== userName) {
        if (!(await checkUsername(inputName))) {
            $('#userNameRule').removeClass('hidden').addClass('formatRules');
            inputCheck = false;
        } else newInfo.userName = inputName;
    }
    if (inputEmail !== email) {
        if (!(await checkEmail(inputEmail))) {
            $('#emailRule').removeClass('hidden').addClass('formatRules');
            inputCheck = false;
        } else newInfo.email = inputEmail;
    }
    if (inputNumber !== phoneNumber) {
        if (inputNumber) {
            if (!checkPhoneNumber(inputNumber)) {
                $('#phoneNumberRule')
                    .removeClass('hidden')
                    .addClass('formatRules');
                inputCheck = false;
            }
        }
        newInfo.phoneNumber = inputNumber;
    }
    if (inputZip !== zipCode) {
        if (inputZip) {
            if (!checkZipCode(inputZip)) {
                $('#zipCodeRule').removeClass('hidden').addClass('formatRules');
                inputCheck = false;
            }
        }
        newInfo.zipCode = inputZip;
    }

    if (!inputCheck) {
        showSwal('error', 'Opps! Something went wrong!');
        return;
    }

    console.log(newInfo);

    await $.ajax({
        url: `http://localhost:3000/users/account/update/${userId}`,
        type: 'PUT',
        data: newInfo,
    });
    showSwal('success', 'Update success!');
};

const checkUsername = async(inputName) => {
    const re = /^[0-9a-zA-Z]*$/;
    if (!re.test(inputName)) return false;
    if (inputName.length > 16 || inputName.length < 3) return false;
    const data = await $.ajax({
        url: 'http://localhost:3000/users/account/username',
        type: 'POST',
        data: {
            userName: inputName,
        },
    });
    if (!data) return true;
    return false;
};

const checkEmail = async(inputEmail) => {
    const re = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!re.test(inputEmail)) return false;
    const data = await $.ajax({
        url: 'http://localhost:3000/users/account/email',
        type: 'POST',
        data: {
            email: inputEmail,
        },
    });
    if (!data) return true;
    return false;
};

const checkZipCode = (inputZip) => {
    const re = /^\d{5}$/;
    return re.test(inputZip);
};

const checkPhoneNumber = (inputNumber) => {
    const re = /^\d{10}$/;
    if (!re.test(inputNumber)) return false;
    return true;
};

// password
const changePassword = async(event) => {
    event.preventDefault();

    const oldPassword = $('#old-password').val();
    const newPassword = $('#new-password').val();
    const reEnterPassword = $('#re-enter-password').val();

    if (!checkPassword(newPassword)) {
        await showSwal(
            'error',
            'Opps! Password must 8-16 characters. Only should contain lower case word, upper case word or number!'
        );
        return;
    }

    if (compareTwoPassword(oldPassword, newPassword)) {
        await showSwal(
            'error',
            'Opps! New password and old password are the same!'
        );
        return;
    }

    if (!compareTwoPassword(newPassword, reEnterPassword)) {
        await showSwal('error', 'Opps! Two new password must be the same!');
        return;
    }
    try {
        await $.ajax({
            url: `http://localhost:3000/users/account/password/${userId}`,
            type: 'PUT',
            data: {
                oldPassword: $.trim(oldPassword),
                newPassword: $.trim(newPassword),
            },
        });
        await showSwal('success', 'Change password successfully');
        $('#old-password').val('');
        $('#new-password').val('');
        $('#re-enter-password').val('');
        checkPasswordEmpty();
    } catch (error) {
        await showSwal('error', 'Old password not correct!');
        console.log(error);
    }
};

const compareTwoPassword = (password1, password2) => {
    if (password1 === password2) {
        return true;
    }
    return false;
};

const checkPassword = (password) => {
    const re = /^[0-9a-zA-Z]*$/;
    if (!re.test(password)) {
        console.log(1);
        return false;
    }
    console.log(password.length);
    if (password.length > 16 || password.length < 8) {
        console.log(2);
        return false;
    }
    return true;
};

const checkPasswordEmpty = () => {
    const oldPassword = $('#old-password').val();
    const newPassword = $('#new-password').val();
    const reEnterPassword = $('#re-enter-password').val();
    if (
        oldPassword.length !== 0 &&
        newPassword.length !== 0 &&
        reEnterPassword.length !== 0
    ) {
        $('#changePasswordBtn').prop('disabled', false);
    } else {
        $('#changePasswordBtn').prop('disabled', true);
    }
};

// ticket info
const changeFocus = (id) => {
    $('.navbar li').each((index, li) => {
        const $li = $(li);
        if ($li.attr('id') === id) {
            $li.attr('class', 'active');
            $($li.attr('data-id')).fadeIn(1000);
        } else {
            $li.attr('class', '');
            $($li.attr('data-id')).hide();
        }
    });
};

const renderTickets = async() => {
    const tickets = await $.ajax({
        url: `http://localhost:3000/users/tickets/${userId}`,
    });
    $('#tickets').empty();
    for (ticket of tickets) {
        const $ticket = `
            <div class="ticket">
                <div class="imgContainer">
                    <img src="./pic/${ticket.images[0]}" alt="${ticket.images[0]}">
                </div>
                <div class="ticketInfo">
                    <h4>${ticket.name}</h4>
                    <p>${ticket.description}</p>
                    <p>Effect Date: ${ticket.effectDate}</p>
                    <p>Price: ${ticket.price}</p>
                </div>
            </div>
        `;
        $('#tickets').append($ticket);
    }
};

// payment
const checkCardNumber = (cardNumber) => {
    const re = /^\d{13,19}$/;
    return re.test(cardNumber);
};

const checkCVV = (securityCode) => {
    const re = /^\d{3}$/;
    return re.test(securityCode);
};

const checkExpiration = (expiration) => {
    if (expiration.length != 5) return false;
    if (expiration.charAt(2) !== '/') return false;
    const arr = expiration.split('/');
    const month = parseInt(arr[0]);
    const day = parseInt(arr[1]);
    return month >= 1 && month <= 12 && day >= 1 && day <= 31;
};

const checkPayment = () => {
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const zipcode = $('#billingZipCode').val();
    const cardNumber = $('#cardNumber').val();
    const expirationDate = $('#expiration').val();
    const cvv = $('#securityCode').val();
    $('.error-message').hide();
    let valid = true;
    if (firstName.length === 0) {
        $('#firstNameRule').show();
        valid = false;
    }
    if (lastName.length === 0) {
        $('#lastNameRule').show();
        valid = false;
    }
    if (!checkZipCode(zipcode)) {
        $('#zipcodeRule').show();
        valid = false;
    }
    if (!checkCardNumber(cardNumber)) {
        $('#cardNumberRule').show();
        valid = false;
    }
    if (!checkExpiration(expirationDate)) {
        $('#expirationRule').show();
        valid = false;
    }
    if (!checkCVV(cvv)) {
        $('#secureCodeRule').show();
        valid = false;
    }
    return valid;
};
const changePayment = async(event) => {
    event.preventDefault();
    if (!(await checkPayment())) {
        await showSwal('error', 'Please make sure all fields are valid!');
        return;
    }
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const zipcode = $('#billingZipCode').val();
    const cardNumber = $('#cardNumber').val();
    const expirationDate = $('#expiration').val();
    const cvv = $('#securityCode').val();

    const userId = userInfo['_id'];
    const user = await $.ajax(`http://localhost:3000/users/account/${userId}`);
    const method = user.bankCard.length > 0 ? 'put' : 'post';
    const bankId = user.bankCard || '';
    try {
        await $.ajax({
            url: `http://localhost:3000/banks/${bankId}`,
            type: method,
            data: {
                user: userId,
                firstName: firstName,
                lastName: lastName,
                billingZipCode: zipcode,
                cardNumber: cardNumber,
                expirationDate: expirationDate,
                securityCode: cvv,
            },
        });
        await showSwal('success', 'Saved your payment infomation!');
    } catch (error) {
        await showSwal('error', error);
    }
};

const renderPayment = async(event) => {
    $('.error-message').hide();
    const userId = userInfo['_id'];
    const user = await $.ajax(`http://localhost:3000/users/account/${userId}`);
    if (user.bankCard.length === 0) {
        return;
    }
    const bank = await $.ajax(`http://localhost:3000/banks/${user.bankCard}`);
    $('#firstName').val(bank.firstName);
    $('#lastName').val(bank.lastName);
    $('#billingZipCode').val(bank.billingZipCode);
    $('#cardNumber').val(bank.cardNumber);
    $('#expiration').val(bank.expirationDate);
    $('#securityCode').val(bank.securityCode);
};

//friends
let friendsData = {};

const checkNewFriendInput = async() => {
    const name = $('#friendNameInput').val();
    const email = $('#friendEmailInput').val();
    const phone = $('#friendPhoneInput').val();
    const reEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!reEmail.test(email)) {
        await showSwal('error', 'The email format is not valid!');
        return false;
    }
    if (name.length === 0) {
        await showSwal('error', 'The name should not be empty!');
        return false;
    }
    if (!checkPhoneNumber(phone)) {
        await showSwal('error', 'The phone number format is not valid!');
        return false;
    }
    return true;
};

const checkFriendInput = async() => {
    const name = $('#friendName').val();
    const email = $('#friendEmail').val();
    const phone = $('#friendPhone').val();
    const reEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (!reEmail.test(email)) {
        await showSwal('error', 'The email format is not valid!');
        return false;
    }
    if (name.length === 0) {
        await showSwal('error', 'The name should not be empty!');
        return false;
    }
    if (!checkPhoneNumber(phone)) {
        await showSwal('error', 'The phone number format is not valid!');
        return false;
    }
    return true;
};

const fetchFriends = async() => {
    friendsData = await $.ajax({
        url: `http://localhost:3000/users/friends/${userId}`,
    });
    console.log(friendsData);
};

const getFriendById = (friendId) => {
    for (friend of friendsData) {
        if (friend['_id'] === friendId) {
            return friend;
        }
    }
};

const renderFriends = async() => {
    await fetchFriends();
    $('#friendsList').empty();
    friendsData.forEach((friend) => {
        const $friend = $(
            `<span class="friendBtn" data-id="${friend['_id']}">${friend.name}</span>`
        );
        $('#friendsList').append($friend);
        $friend.click((event) => {
            const $cur = $(event.currentTarget);
            $('#friendsList').find('span').removeClass('active');
            $cur.addClass('active');
            const friend = getFriendById($cur.attr('data-id'));
            $('#friendName').val(friend.name);
            $('#friendEmail').val(friend.email);
            $('#friendPhone').val(friend.phoneNumber);
        });
    });
};

const addFriend = async() => {
    if (!(await checkNewFriendInput())) return;
    const name = $('#friendNameInput').val();
    const email = $('#friendEmailInput').val();
    const phone = $('#friendPhoneInput').val();
    try {
        await $.ajax({
            url: '/friends',
            type: 'post',
            data: {
                userId: userId,
                name: name,
                email: email,
                phoneNumber: phone,
            },
        });
        await renderFriends();
        $('#newFriendModal').modal('hide');
        await showSwal('success', 'Already add your friend');
    } catch (error) {
        showSwal('error', error);
    }
};

const saveFriend = async(event) => {
    event.preventDefault();
    const curFriend = $('#friendsList').find('span.active');
    if (curFriend.length === 0) {
        await showSwal('error', 'Please select a friend first!');
        return;
    }
    if (!(await checkFriendInput())) return;
    const friendId = $(curFriend[0]).attr('data-id');
    const name = $('#friendName').val();
    const email = $('#friendEmail').val();
    const phoneNumber = $('#friendPhone').val();
    try {
        await $.ajax({
            url: `/friends/${friendId}`,
            type: 'put',
            data: {
                name: name,
                email: email,
                phoneNumber: phoneNumber,
            },
        });
        await renderFriends();
        $('#newFriendModal').modal('hide');
        await showSwal('success', 'Already saved!');
    } catch (error) {
        showSwal('error', error);
    }
};

//main
const bindEvents = async() => {
    $('#logoutBtn').click(logout);
    $('.navbar li').each((index, li) => {
        const $li = $(li);
        $li.click(() => {
            changeFocus($li.attr('id'));
        });
    });
    $('#old-password').bind('input propertychange', checkPasswordEmpty);
    $('#new-password').bind('input propertychange', checkPasswordEmpty);
    $('#re-enter-password').bind('input propertychange', checkPasswordEmpty);
    $('#personalInfo').submit(infoSubmit);
    $('#changePasswordBtn').click(changePassword);
    $('#changePaymentBtn').click(changePayment);
    // friend
    $('#newFriendBtn').click((event) => {
        event.preventDefault();
        console.log('11');
        $('#newFriendModal').modal('show');
    });
    $('#newFriendConfirmBtn').click(addFriend);
    $('#saveFriendBtn').click(saveFriend);
};

const init = async() => {
    infoPreload();
    renderTickets();
    renderUsername();
    renderPayment();
    renderFriends();
    bindEvents();
};

init();