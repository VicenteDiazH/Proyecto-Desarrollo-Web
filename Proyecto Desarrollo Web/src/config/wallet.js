async function getBalance() {
    const response = await fetch('/wallet/balance');
    const data = await response.json();
    document.getElementById('balance').innerText = `Balance: $${data.balance}`;
}

async function addFunds() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (!isNaN(amount) && amount > 0) {
        const response = await fetch('/wallet/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });
        const data = await response.json();
        document.getElementById('balance').innerText = `Balance: $${data.balance}`;
    } else {
        alert('Please enter a valid amount.');
    }
}

async function withdrawFunds() {
    const amount = parseFloat(document.getElementById('amount').value);
    if (!isNaN(amount) && amount > 0) {
        const response = await fetch('/wallet/withdraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount })
        });
        const data = await response.json();
        document.getElementById('balance').innerText = `Balance: $${data.balance}`;
    } else {
        alert('Please enter a valid amount.');
    }
}

document.addEventListener('DOMContentLoaded', getBalance);