const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());


const fileName = "complaints.json";


function readComplaints() {

    let data = fs.readFileSync(fileName, "utf8");

    return JSON.parse(data);

}


function saveComplaints(complaints) {

    fs.writeFileSync(
        fileName,
        JSON.stringify(complaints, null, 2)
    );

}


app.get("/", function(request, response) {

    response.send("StayFix Backend is running!");

});


app.post("/complaints", function(request, response) {

    let complaints = readComplaints();

    let complaint = request.body;

    complaint.id = Date.now();

    complaint.status = "Pending";

    complaints.push(complaint);

    saveComplaints(complaints);

    response.send({
        message: "Complaint submitted successfully!",
        complaint: complaint
    });

});


app.get("/complaints", function(request, response) {

    let complaints = readComplaints();

    response.send(complaints);

});


app.delete("/complaints/:id", function(request, response) {

    let complaints = readComplaints();

    let id = Number(request.params.id);

    complaints = complaints.filter(function(complaint) {

        return complaint.id !== id;

    });

    saveComplaints(complaints);

    response.send({
        message: "Complaint deleted successfully!"
    });

});


app.put("/complaints/:id", function(request, response) {

    let complaints = readComplaints();

    let id = Number(request.params.id);

    let complaint = complaints.find(function(complaint) {

        return complaint.id === id;

    });


    if (!complaint) {

        return response.status(404).send({
            message: "Complaint not found"
        });

    }


    complaint.status = request.body.status;

    saveComplaints(complaints);

    response.send({
        message: "Complaint status updated successfully!",
        complaint: complaint
    });

});


app.listen(4000, function() {

    console.log("Server started on port 4000");

});