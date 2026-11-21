// If your login page is in another folder, change this one line.
const LOGIN_PAGE = "../LOGIN/login.html";

const sections = ["dashboard", "properties", "add", "appointments", "users"];
const statuses = ["All", "Pending", "Approved", "Rejected"];
let currentFilter = "All";
let editIndex = -1;

// ---------- Load saved data ----------
let propertyList = JSON.parse(localStorage.getItem("properties") || "null");
if (propertyList === null) {
  // property.js gives the starting list
  propertyList = (typeof properties !== "undefined") ? properties.slice() : [];
  saveProperties();
}

let appointments = JSON.parse(localStorage.getItem("appointments") || "null");
if (appointments === null) {
  appointments = [
    { renter: "Demo Renter", property: "Lake View Apartment", date: "2026-11-02", time: "10:00 AM", note: "Need parking info", status: "Pending" },
    { renter: "Demo Renter", property: "Family Flat", date: "2026-11-05", time: "3:00 PM", note: "—", status: "Pending" },
    { renter: "Demo Renter", property: "Green Villa", date: "2026-11-08", time: "12:00 PM", note: "Coming with family", status: "Approved" }
  ];
  saveAppointments();
}

let users = JSON.parse(localStorage.getItem("users") || "[]");

function saveProperties() { localStorage.setItem("properties", JSON.stringify(propertyList)); }
function saveAppointments() { localStorage.setItem("appointments", JSON.stringify(appointments)); }
function saveUsers() { localStorage.setItem("users", JSON.stringify(users)); }

// Stops user text from breaking the page
function esc(text) {
  return String(text === undefined ? "" : text)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function logout() {
  window.location.href = LOGIN_PAGE;
}

// ---------- Tabs ----------
function showSection(name) {
  for (const s of sections) {
    document.getElementById(s).style.display = "none";
    let tab = document.getElementById("tab-" + s);
    tab.style.color = "";
    tab.style.borderBottom = "";
  }
  document.getElementById(name).style.display = "block";
  let active = document.getElementById("tab-" + name);
  active.style.color = "#663399";
  active.style.borderBottom = "3px solid #663399";

  if (name === "dashboard") { renderDashboard(); }
  if (name === "properties") { showProperties(); }
  if (name === "appointments") { renderAppointments(); }
  if (name === "users") { renderUsers(); }
}

// ---------- Dashboard ----------
function countStatus(status) {
  if (status === "All") { return appointments.length; }
  let count = 0;
  for (const a of appointments) {
    if (a.status === status) { count++; }
  }
  return count;
}

function renderDashboard() {
  document.getElementById("propCount").innerHTML = propertyList.length;
  document.getElementById("apptCount").innerHTML = appointments.length;
  document.getElementById("pendingCount").innerHTML = countStatus("Pending");
  document.getElementById("userCount").innerHTML = users.length;

  let text = "";
  let shown = 0;
  for (let i = appointments.length - 1; i >= 0 && shown < 3; i--) {
    let a = appointments[i];
    text += "<tr><td>" + esc(a.renter || "Renter") + "</td><td><strong>" + esc(a.property) + "</strong></td><td>" +
            esc(a.date) + "</td><td><span class='status " + a.status.toLowerCase() + "'>" + a.status + "</span></td></tr>";
    shown++;
  }
  if (text === "") { text = "<tr><td colspan='4'>No requests yet.</td></tr>"; }
  document.getElementById("recentBody").innerHTML = text;
}

// ---------- Properties ----------
function showProperties() {
  let search = document.getElementById("search").value.toLowerCase();
  let text = "";
  let found = 0;

  for (let i = 0; i < propertyList.length; i++) {
    let p = propertyList[i];
    let nameMatch = p.title.toLowerCase().indexOf(search) !== -1;
    let locationMatch = p.location.toLowerCase().indexOf(search) !== -1;

    if (nameMatch || locationMatch) {
      found++;
      text += "<tr>" +
                "<td><img src='" + esc(p.image) + "' alt='' onerror=\"this.style.visibility='hidden'\"></td>" +
                "<td><strong>" + esc(p.title) + "</strong></td>" +
                "<td>" + esc(p.location) + "</td>" +
                "<td><span class='pill'>" + esc(p.type) + "</span></td>" +
                "<td>" + Number(p.price).toLocaleString() + " Tk</td>" +
                "<td><button onclick='editProperty(" + i + ")'>Edit</button>" +
                "<button class='btn-danger' onclick='deleteProperty(" + i + ")'>Delete</button></td>" +
              "</tr>";
    }
  }
  if (found === 0) { text = "<tr><td colspan='6'>No property matches your search.</td></tr>"; }
  document.getElementById("propBody").innerHTML = text;
  document.getElementById("resultCount").innerHTML = found + " property(s) found";
}

function showMessage(text, color) {
  let msg = document.getElementById("formMsg");
  msg.innerHTML = text;
  if (text === "") {
    msg.style.display = "none";
  } else if (color === "green") {
    msg.style.display = "block";
    msg.style.color = "#1e7b3c";
    msg.style.backgroundColor = "#e3f5e9";
  } else {
    msg.style.display = "block";
    msg.style.color = "#c0392b";
    msg.style.backgroundColor = "#fde8e8";
  }
}

function newProperty() {
  editIndex = -1;
  document.getElementById("formTitle").innerHTML = "Add Property";
  document.getElementById("title").value = "";
  document.getElementById("location").value = "";
  document.getElementById("type").value = "apartment";
  document.getElementById("price").value = "";
  document.getElementById("beds").value = "";
  document.getElementById("baths").value = "";
  document.getElementById("area").value = "";
  document.getElementById("image").value = "";
  document.getElementById("description").value = "";
  document.getElementById("isNew").checked = true;
  showMessage("", "");
  showSection("add");
}

function editProperty(i) {
  let p = propertyList[i];
  editIndex = i;
  document.getElementById("formTitle").innerHTML = "Edit Property";
  document.getElementById("title").value = p.title;
  document.getElementById("location").value = p.location;
  document.getElementById("type").value = p.type;
  document.getElementById("price").value = p.price;
  document.getElementById("beds").value = p.beds;
  document.getElementById("baths").value = p.baths;
  document.getElementById("area").value = p.area;
  document.getElementById("image").value = p.image;
  document.getElementById("description").value = p.description;
  document.getElementById("isNew").checked = p.isNew;
  showMessage("", "");
  showSection("add");
}

function saveProperty() {
  let title = document.getElementById("title").value.trim();
  let location = document.getElementById("location").value.trim();
  let price = Number(document.getElementById("price").value);
  let beds = document.getElementById("beds").value;
  let baths = document.getElementById("baths").value;
  let area = Number(document.getElementById("area").value);

  let error = "";
  if (title === "") { error = "Please enter a title."; }
  else if (location === "") { error = "Please enter a location."; }
  else if (price <= 0) { error = "Rent must be more than 0."; }
  else if (beds === "" || Number(beds) < 0) { error = "Please enter the number of beds."; }
  else if (baths === "" || Number(baths) < 0) { error = "Please enter the number of baths."; }
  else if (area <= 0) { error = "Please enter the area in sqft."; }

  if (error !== "") {
    showMessage(error, "red");
    return false;
  }

  let image = document.getElementById("image").value.trim();
  if (image === "") { image = "image/1.jpg"; }

  let newId = 1;
  for (const p of propertyList) {
    if (p.id >= newId) { newId = p.id + 1; }
  }

  let item = {
    id: editIndex === -1 ? newId : propertyList[editIndex].id,
    title: title,
    location: location,
    type: document.getElementById("type").value,
    price: price,
    beds: Number(beds),
    baths: Number(baths),
    area: area,
    isNew: document.getElementById("isNew").checked,
    image: image,
    description: document.getElementById("description").value.trim()
  };

  if (editIndex === -1) {
    propertyList.push(item);
  } else {
    propertyList[editIndex] = item;
  }
  saveProperties();
  showSection("properties");
  return false;
}

function deleteProperty(i) {
  if (confirm("Delete " + propertyList[i].title + "?")) {
    let newList = [];
    for (let j = 0; j < propertyList.length; j++) {
      if (j !== i) { newList.push(propertyList[j]); }
    }
    propertyList = newList;
    saveProperties();
    showProperties();
  }
}

// ---------- Appointments ----------
function filterStatus(status) {
  currentFilter = status;
  renderAppointments();
}

function setStatus(i, status) {
  appointments[i].status = status;
  saveAppointments();
  renderAppointments();
}

function renderAppointments() {
  for (const s of statuses) {
    let btn = document.getElementById("filter-" + s);
    btn.innerHTML = s + " (" + countStatus(s) + ")";
    if (s === currentFilter) {
      btn.style.backgroundColor = "#663399";
      btn.style.color = "white";
    } else {
      btn.style.backgroundColor = "";
      btn.style.color = "";
    }
  }

  let text = "";
  for (let i = 0; i < appointments.length; i++) {
    let a = appointments[i];
    if (currentFilter === "All" || a.status === currentFilter) {
      let action = "";
      if (a.status === "Pending") {
        action = "<button class='btn-approve' onclick='setStatus(" + i + ", \"Approved\")'>Approve</button>" +
                 "<button class='btn-danger' onclick='setStatus(" + i + ", \"Rejected\")'>Reject</button>";
      }
      text += "<tr>" +
                "<td>" + esc(a.renter || "Renter") + "</td>" +
                "<td><strong>" + esc(a.property) + "</strong></td>" +
                "<td>" + esc(a.date) + "</td>" +
                "<td>" + esc(a.time) + "</td>" +
                "<td>" + esc(a.note) + "</td>" +
                "<td><span class='status " + a.status.toLowerCase() + "'>" + a.status + "</span></td>" +
                "<td>" + action + "</td>" +
              "</tr>";
    }
  }
  document.getElementById("apptBody").innerHTML = text;
  document.getElementById("noAppt").innerHTML = text === "" ? "No " + currentFilter.toLowerCase() + " appointments." : "";
}

// ---------- Users ----------
function renderUsers() {
  users = JSON.parse(localStorage.getItem("users") || "[]");
  let text = "";
  for (let i = 0; i < users.length; i++) {
    let u = users[i];
    text += "<tr>" +
              "<td><strong>" + esc(u.name) + "</strong></td>" +
              "<td>" + esc(u.email) + "</td>" +
              "<td>" + esc(u.phone) + "</td>" +
              "<td><span class='pill'>" + esc(u.role) + "</span></td>" +
              "<td><button class='btn-danger' onclick='deleteUser(" + i + ")'>Remove</button></td>" +
            "</tr>";
  }
  document.getElementById("userBody").innerHTML = text;
  document.getElementById("noUser").innerHTML = text === "" ? "No one has registered yet." : "";
}

function deleteUser(i) {
  if (confirm("Remove " + users[i].name + "?")) {
    users.splice(i, 1);
    saveUsers();
    renderUsers();
  }
}

showSection("dashboard");
