var ownerName = "Owner";

var loggedInUser = JSON.parse(localStorage.getItem("user"));

if (loggedInUser != null) {

    if (loggedInUser.username != undefined) {
        ownerName = loggedInUser.username;
    }
    else if (loggedInUser.name != undefined) {
        ownerName = loggedInUser.name;
    }
}

document.getElementById("owner-user-name").innerHTML = ownerName;


var editingCard = null;


function ownerShowSection(sectionId) {

    document.getElementById("owner-dashboard").style.display = "none";

    document.getElementById("owner-my-properties").style.display = "none";

    document.getElementById("owner-add-property").style.display = "none";

    document.getElementById(sectionId).style.display = "block";
}


function ownerCreatePropertyCard(title, location, type, price, beds, baths, area, image, description) {

    var card = document.createElement("div");

    card.className = "owner-property-card";


    card.dataset.title = title;

    card.dataset.location = location;

    card.dataset.type = type;

    card.dataset.price = price;

    card.dataset.beds = beds;

    card.dataset.baths = baths;

    card.dataset.area = area;

    card.dataset.image = image;

    card.dataset.description = description;


    if (image != "") {

        var propertyImage = document.createElement("img");

        propertyImage.src = image;

        propertyImage.alt = title;

        card.appendChild(propertyImage);
    }


    var details = document.createElement("div");

    details.className = "owner-property-details";


    var propertyTitle = document.createElement("h3");

    propertyTitle.textContent = title;


    var propertyLocation = document.createElement("p");

    propertyLocation.textContent = "Location: " + location;


    var propertyType = document.createElement("p");

    propertyType.textContent = "Type: " + type;


    var propertyBeds = document.createElement("p");

    propertyBeds.textContent = "Bedrooms: " + beds;


    var propertyBaths = document.createElement("p");

    propertyBaths.textContent = "Bathrooms: " + baths;


    var propertyArea = document.createElement("p");

    propertyArea.textContent = "Area: " + area + " sqft";


    var propertyPrice = document.createElement("p");

    propertyPrice.className = "owner-property-price";

    propertyPrice.textContent = "Tk " + price + " / month";


    var propertyDescription = document.createElement("p");

    propertyDescription.textContent = description;


    var actions = document.createElement("div");

    actions.className = "owner-property-actions";


    var editButton = document.createElement("button");

    editButton.className = "owner-edit-btn";

    editButton.textContent = "Edit";


    editButton.onclick = function () {

        ownerEditProperty(card);

    };


    var deleteButton = document.createElement("button");

    deleteButton.className = "owner-delete-btn";

    deleteButton.textContent = "Delete";


    deleteButton.onclick = function () {

        ownerDeleteProperty(card);

    };


    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    details.appendChild(propertyTitle);

    details.appendChild(propertyLocation);

    details.appendChild(propertyType);

    details.appendChild(propertyBeds);

    details.appendChild(propertyBaths);

    details.appendChild(propertyArea);

    details.appendChild(propertyPrice);

    details.appendChild(propertyDescription);

    details.appendChild(actions);


    card.appendChild(details);


    return card;
}


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


    var newCard = ownerCreatePropertyCard(
        title,
        location,
        type,
        price,
        beds,
        baths,
        area,
        image,
        description
    );


    var propertyList = document.getElementById("owner-property-list");


    if (editingCard == null) {

        var existingCards = propertyList.getElementsByClassName("owner-property-card");

        if (existingCards.length == 0) {

            propertyList.innerHTML = "";
        }

        propertyList.appendChild(newCard);

        alert("Property added successfully.");

    }

    else {

        propertyList.removeChild(editingCard);

        propertyList.appendChild(newCard);

        editingCard = null;

        alert("Property updated successfully.");
    }


    document.getElementById("owner-property-form").reset();

    document.getElementById("owner-submit-btn").innerHTML = "Add Property";


    ownerUpdateDashboard();


    ownerShowSection("owner-my-properties");


    return false;
};


function ownerEditProperty(card) {

    editingCard = card;


    document.getElementById("owner-property-title").value = card.dataset.title;

    document.getElementById("owner-property-location").value = card.dataset.location;

    document.getElementById("owner-property-type").value = card.dataset.type;

    document.getElementById("owner-property-price").value = card.dataset.price;

    document.getElementById("owner-property-beds").value = card.dataset.beds;

    document.getElementById("owner-property-baths").value = card.dataset.baths;

    document.getElementById("owner-property-area").value = card.dataset.area;

    document.getElementById("owner-property-image").value = card.dataset.image;

    document.getElementById("owner-property-description").value = card.dataset.description;


    document.getElementById("owner-submit-btn").innerHTML = "Update Property";


    ownerShowSection("owner-add-property");
}


function ownerDeleteProperty(card) {

    var answer = confirm("Are you sure you want to delete this property?");

    if (answer == true) {

        card.remove();

        var propertyList = document.getElementById("owner-property-list");

        var cards = propertyList.getElementsByClassName("owner-property-card");

        if (cards.length == 0) {

            propertyList.innerHTML = "<p class='owner-empty-message'>No properties added yet.</p>";
        }

        ownerUpdateDashboard();

        alert("Property deleted successfully.");
    }
}


function ownerRenderRecentProperties() {

    var recentList = document.getElementById("owner-recent-properties");

    var propertyList = document.getElementById("owner-property-list");

    var cards = propertyList.getElementsByClassName("owner-property-card");


    recentList.innerHTML = "";


    var totalProperties = cards.length;


    if (totalProperties == 0) {

        recentList.innerHTML = "<p>No properties added yet.</p>";
    }

    else {

        var shownProperties = 0;


        for (var i = totalProperties - 1; i >= 0; i--) {

            if (shownProperties < 3) {

                var property = cards[i];


                var recentItem = document.createElement("div");

                recentItem.className = "owner-recent-item";


                var propertyInfo = document.createElement("div");


                var propertyTitle = document.createElement("h3");

                propertyTitle.textContent = property.dataset.title;


                var propertyLocation = document.createElement("p");

                propertyLocation.textContent = property.dataset.location;


                var propertyPrice = document.createElement("strong");

                propertyPrice.textContent = "Tk " + property.dataset.price;


                propertyInfo.appendChild(propertyTitle);

                propertyInfo.appendChild(propertyLocation);


                recentItem.appendChild(propertyInfo);

                recentItem.appendChild(propertyPrice);


                recentList.appendChild(recentItem);


                shownProperties++;
            }
        }
    }
}


function ownerUpdateDashboard() {

    var propertyList = document.getElementById("owner-property-list");

    var cards = propertyList.getElementsByClassName("owner-property-card");


    var totalProperties = cards.length;


    document.getElementById("owner-total-properties").innerHTML = totalProperties;


    ownerRenderRecentProperties();
}


document.getElementById("owner-property-form").onreset = function () {

    editingCard = null;

    document.getElementById("owner-submit-btn").innerHTML = "Add Property";
};


ownerUpdateDashboard();