
var ownerName = "Owner";

var ownerProperties = [];

var ownerAppointments = [];

var nextPropertyId = 1;

var editingPropertyIndex = -1;

document.getElementById("owner-user-name").innerHTML = ownerName;

document.getElementById("owner-property-form").onsubmit = function () {

    var title = document.getElementById("owner-property-title").value;
    var location = document.getElementById("owner-property-location").value;
    var type = document.getElementById("owner-property-type").value;
    var price = document.getElementById("owner-property-price").value * 1;
    var beds = document.getElementById("owner-property-beds").value * 1;
    var baths = document.getElementById("owner-property-baths").value * 1;
    var area = document.getElementById("owner-property-area").value * 1;
    var image = document.getElementById("owner-property-image").value;
    var description = document.getElementById("owner-property-description").value;

    if (title == "" || location == "" || type == "" ||
        price <= 0 || beds < 0 || baths < 0 || area <= 0) {

        alert("Please enter valid property information.");
        return false;
    }

    var property = {
        id: nextPropertyId,
        title: title,
        location: location,
        type: type,
        price: price,
        beds: beds,
        baths: baths,
        area: area,
        image: image,
        description: description,
        ownerName: ownerName
    };

    if (editingPropertyIndex == -1) {

        ownerProperties.push(property);

        nextPropertyId++;

        alert("Property added successfully.");

    } else {

        property.id = ownerProperties[editingPropertyIndex].id;

        ownerProperties[editingPropertyIndex] = property;

        editingPropertyIndex = -1;

        document.getElementById("owner-submit-btn").innerHTML = "Add Property";

        alert("Property updated successfully.");
    }

    document.getElementById("owner-property-form").reset();

    ownerUpdateDashboard();

    ownerShowSection("owner-my-properties");

    return false;
};


function ownerShowSection(sectionId) {

    document.getElementById("owner-dashboard").style.display = "none";

    document.getElementById("owner-my-properties").style.display = "none";

    document.getElementById("owner-add-property").style.display = "none";

    document.getElementById("owner-appointments").style.display = "none";

    document.getElementById(sectionId).style.display = "block";
}


function ownerRenderProperties() {

    var propertyList = document.getElementById("owner-property-list");

    var output = "";

    if (ownerProperties.length == 0) {

        output = "<p>No properties available. Add your first property.</p>";

    } else {

        for (var i = 0; i < ownerProperties.length; i++) {

            var property = ownerProperties[i];

            output += `
                <div class="owner-property-card">

                    ${property.image != "" ? `<img src="${property.image}" alt="${property.title}">` : ""}

                    <div class="owner-property-details">

                        <h3>${property.title}</h3>

                        <p>Location: ${property.location}</p>

                        <p>Type: ${property.type}</p>

                        <p>Bedrooms: ${property.beds}</p>

                        <p>Bathrooms: ${property.baths}</p>

                        <p>Area: ${property.area} sqft</p>

                        <p class="owner-property-price">
                            Tk ${property.price} / month
                        </p>

                        <p>${property.description}</p>

                        <div class="owner-property-actions">

                            <button class="owner-edit-btn"
                                onclick="ownerEditProperty(${i})">
                                Edit
                            </button>

                            <button class="owner-delete-btn"
                                onclick="ownerDeleteProperty(${i})">
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            `;
        }
    }

    propertyList.innerHTML = output;
}


function ownerEditProperty(index) {

    var property = ownerProperties[index];

    editingPropertyIndex = index;

    document.getElementById("owner-property-title").value = property.title;

    document.getElementById("owner-property-location").value = property.location;

    document.getElementById("owner-property-type").value = property.type;

    document.getElementById("owner-property-price").value = property.price;

    document.getElementById("owner-property-beds").value = property.beds;

    document.getElementById("owner-property-baths").value = property.baths;

    document.getElementById("owner-property-area").value = property.area;

    document.getElementById("owner-property-image").value = property.image;

    document.getElementById("owner-property-description").value = property.description;

    document.getElementById("owner-submit-btn").innerHTML = "Update Property";

    ownerShowSection("owner-add-property");
}


function ownerDeleteProperty(index) {

    var answer = confirm("Are you sure you want to delete this property?");

    if (answer == true) {

        for (var i = index; i < ownerProperties.length - 1; i++) {

            ownerProperties[i] = ownerProperties[i + 1];
        }

        ownerProperties.length = ownerProperties.length - 1;

        ownerUpdateDashboard();

        alert("Property deleted successfully.");
    }
}


function ownerRenderRecentProperties() {

    var recentList = document.getElementById("owner-recent-properties");

    var output = "";

    if (ownerProperties.length == 0) {

        output = "<p>No properties added yet.</p>";

    } else {

        var start = ownerProperties.length - 3;

        if (start < 0) {
            start = 0;
        }

        for (var i = ownerProperties.length - 1; i >= start; i--) {

            var property = ownerProperties[i];

            output += `
                <div class="owner-recent-item">

                    <div>
                        <h3>${property.title}</h3>
                        <p>${property.location}</p>
                    </div>

                    <strong>Tk ${property.price}</strong>

                </div>
            `;
        }
    }

    recentList.innerHTML = output;
}


function ownerRenderAppointments() {

    var appointmentBody = document.getElementById("owner-appointment-body");

    var output = "";

    if (ownerAppointments.length == 0) {

        output = `
            <tr>
                <td colspan="7">
                    No appointment requests available.
                </td>
            </tr>
        `;

    } else {

        for (var i = 0; i < ownerAppointments.length; i++) {

            var appointment = ownerAppointments[i];

            var propertyFound = false;

            for (var j = 0; j < ownerProperties.length; j++) {

                if (appointment.property == ownerProperties[j].title) {
                    propertyFound = true;
                }
            }

            if (propertyFound == true) {

                var status = appointment.status;

                if (status == "") {
                    status = "Pending";
                }

                output += `
                    <tr>

                        <td>${appointment.renterName}</td>

                        <td>${appointment.property}</td>

                        <td>${appointment.date}</td>

                        <td>${appointment.time}</td>

                        <td>${appointment.note}</td>

                        <td>${status}</td>

                        <td>
                            ${
                                status == "Pending"
                                ?
                                `
                                    <button onclick="ownerApproveAppointment(${i})">
                                        Approve
                                    </button>

                                    <button onclick="ownerRejectAppointment(${i})">
                                        Reject
                                    </button>
                                `
                                :
                                "No action"
                            }
                        </td>

                    </tr>
                `;
            }
        }
    }

    appointmentBody.innerHTML = output;
}


function ownerApproveAppointment(index) {

    ownerAppointments[index].status = "Approved";

    alert("Appointment approved successfully.");

    ownerUpdateDashboard();
}


function ownerRejectAppointment(index) {

    ownerAppointments[index].status = "Rejected";

    alert("Appointment rejected.");

    ownerUpdateDashboard();
}


function ownerUpdateDashboard() {

    var pendingCount = 0;

    var approvedCount = 0;

    var totalAppointments = 0;

    for (var i = 0; i < ownerAppointments.length; i++) {

        var appointment = ownerAppointments[i];

        var propertyFound = false;

        for (var j = 0; j < ownerProperties.length; j++) {

            if (appointment.property == ownerProperties[j].title) {
                propertyFound = true;
            }
        }

        if (propertyFound == true) {

            totalAppointments++;

            if (appointment.status == "" || appointment.status == "Pending") {

                pendingCount++;
            }

            if (appointment.status == "Approved") {

                approvedCount++;
            }
        }
    }

    document.getElementById("owner-total-properties").innerHTML = ownerProperties.length;

    document.getElementById("owner-total-appointments").innerHTML = totalAppointments;

    document.getElementById("owner-pending-appointments").innerHTML = pendingCount;

    document.getElementById("owner-approved-appointments").innerHTML = approvedCount;

    ownerRenderProperties();

    ownerRenderRecentProperties();

    ownerRenderAppointments();
}


ownerUpdateDashboard();
