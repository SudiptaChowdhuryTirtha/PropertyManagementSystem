function renderProperties(list) {
  const grid = document.getElementById("property-grid");
  let html = "";

  list.forEach(function (p) {
    html += `
            <div class="card">
                ${p.isNew ? '<span class="badge-new">New</span>' : ""}
                <button class="heart-btn" data-id="${p.id}">♡</button>
                <a href="property.html?id=${p.id}" class="card-link">
                    <img src="${p.image}" alt="${p.title}">
                    <div class="card-body">
                        <h3 class="card-price">${p.price.toLocaleString()} Tk <span>/ month</span></h3>
                        <p class="card-title">${p.title}</p>
                        <p class="card-location">${p.location}</p>
                        <div class="card-meta">
                            <span>🛏 ${p.beds} Bed</span>
                            <span>🛁 ${p.baths} Bath</span>
                            <span>📐 ${p.area} sqft</span>
                        </div>
                    </div>
                </a>
            </div>
        `;
  });

  grid.innerHTML = html;
}

renderProperties(properties);

document.addEventListener("click", function (e) {
  const favBtn = e.target.closest(".btn-fav, .heart-btn");
});
