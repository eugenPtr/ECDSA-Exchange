import e from "express";
import "./index.scss";

const server = "http://localhost:3042";
const modal = document.getElementById("myModal");

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;
  const signature = JSON.parse(document.getElementById("signature").value);

  const body = JSON.stringify({
    payload: {
      sender, 
      amount, 
      recipient
    },
    signature
  });

  const request = new Request(`${server}/send`, { method: 'POST', body });

  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    return response.json();
  }).then(({ balance, error }) => {
    if (error) {
      alert("Transaction Failed");
    } else {
      alert("Transaction Successful");
    }
    document.getElementById("balance").innerHTML = balance;
  });
});

document.getElementById("sign-transaction").addEventListener('click', () => {
  modal.style.display = "block";
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;

  const payload = {
    sender: sender, 
    amount: amount, 
    recipient: recipient
  };
  console.log(payload);
  document.getElementById("code-block").innerHTML = JSON.stringify(payload);
});

// window.onclick = (event) => {
//   if (modal.style.display === "block" && event.target !== modal) {
//     modal.style.display = "none";
//   }
// }

document.getElementsByClassName("close")[0].onclick = () => {
  modal.style.display = 'none';
}
