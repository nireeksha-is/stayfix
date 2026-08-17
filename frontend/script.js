let submitButton = document.getElementById("submitBtn");

let nameInput = document.getElementById("name");
let roomInput = document.getElementById("room");
let categoryInput = document.getElementById("category");
let descriptionInput = document.getElementById("description");
let priorityInput = document.getElementById("priority");
let dateInput = document.getElementById("date");

let complaintList = document.getElementById("complaintList");
let complaintForm = document.getElementById("complaintForm");


submitButton.addEventListener("click", async function() {

    if (nameInput.value === "") {
        alert("Please enter your name");
        return;
    }

    if (roomInput.value === "") {
        alert("Please enter your room number");
        return;
    }

    if (categoryInput.value === "Select category") {
        alert("Please select a category");
        return;
    }

    if (descriptionInput.value === "") {
        alert("Please describe your problem");
        return;
    }


    let complaint = {
        name: nameInput.value,
        room: roomInput.value,
        category: categoryInput.value,
        description: descriptionInput.value,
        priority: priorityInput.value,
        date: dateInput.value
    };


    let response = await fetch("http://localhost:4000/complaints", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(complaint)

    });


    let data = await response.json();

    alert(data.message);

    complaintForm.reset();

    loadComplaints();

});


async function loadComplaints() {

    let response = await fetch("http://localhost:4000/complaints");

    let complaints = await response.json();

    complaintList.innerHTML = "";


    complaints.forEach(function(complaint) {

        complaintList.innerHTML += `
            <div class="complaint-card" data-id="${complaint.id}">

                <h3>${complaint.category}</h3>

                <p><strong>Resident:</strong> ${complaint.name}</p>

                <p><strong>Room:</strong> ${complaint.room}</p>

                <p><strong>Problem:</strong> ${complaint.description}</p>

                <p><strong>Priority:</strong> ${complaint.priority}</p>

                <p><strong>Date:</strong> ${complaint.date}</p>

                <p>
                    <strong>Status:</strong>
                    <span class="status">${complaint.status}</span>
                </p>

                <select class="status-select">
                    <option ${complaint.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option ${complaint.status === "In Progress" ? "selected" : ""}>In Progress</option>
                    <option ${complaint.status === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>

                <br>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

    });


    let statusSelects = document.querySelectorAll(".status-select");

    statusSelects.forEach(function(select) {

        select.addEventListener("change", async function() {

            let card = select.parentElement;

            let id = card.getAttribute("data-id");

            let status = select.value;


            let response = await fetch(
                "http://localhost:4000/complaints/" + id,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


            let data = await response.json();

            alert(data.message);

            loadComplaints();

        });

    });


    let deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function(button) {

        button.addEventListener("click", async function() {

            let card = button.parentElement;

            let id = card.getAttribute("data-id");


            let response = await fetch(
                "http://localhost:4000/complaints/" + id,
                {
                    method: "DELETE"
                }
            );


            let data = await response.json();

            alert(data.message);

            loadComplaints();

        });

    });

}


loadComplaints();