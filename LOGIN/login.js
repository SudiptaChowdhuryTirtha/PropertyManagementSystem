const params = new URLSearchParams(window.location.search);
const redirect = params.get("redirect");

document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const role = document.getElementById("role").value;

  localStorage.setItem("user", JSON.stringify({ name: username, role: role }));

  const rolePages = {
    renter: "../renter.html",
    owner: "../OWNER/owner.html",
    admin: "../ADMIN/admin.html",
  };

  const safeRedirect =
    redirect && !redirect.includes(":") && !redirect.includes("//");

  if (safeRedirect) {
    window.location.href = redirect;
  } else {
    window.location.href = rolePages[role];
  }
});
