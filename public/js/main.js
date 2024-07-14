document.addEventListener("DOMContentLoaded", () => {
  // sort function
  const sortButtons = document.querySelectorAll(".sort");
  // console.log(sortButtons);
  sortButtons.forEach((element) => {
    element.addEventListener("click", () => {
      // console.log(element);
      let column = element.getAttribute("id");
      let order = element.getAttribute("data-order");
      if (order == "desc") element.setAttribute("data-order", "asc");
      else element.setAttribute("data-order", "desc");
      sortTable(column, order);
    });
  });
  // sort table
  function sortTable(column, order) {
    let rows = document.querySelectorAll("tbody tr");
    rows = Array.from(rows).sort(function (a, b) {
      let A = a.getElementsByTagName("td")[column].innerText.toUpperCase();
      let B = b.getElementsByTagName("td")[column].innerText.toUpperCase();
      if (!isNaN(Number(A))) {
        A = Number(A);
        B = Number(B);
      }
      if (A < B) {
        return order === "asc" ? -1 : 1;
      } else if (A > B) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
    document.querySelector("tbody").innerHTML = "";
    rows.forEach(function (row) {
      document.querySelector("tbody").append(row);
    });
  }
  // search function
  const searchButton = document.querySelector("#search");
  const rows = document.querySelectorAll("tbody tr");
  searchButton.addEventListener("keyup", () => {
    let found = searchButton.value.toLowerCase();
    const filteredItems = Array.from(rows).filter((row) => {
      return row.textContent.toLowerCase().includes(found);
    });
    const tableBody = document.querySelector("tbody");
    tableBody.innerHTML = "";
    filteredItems.forEach((item) => {
      tableBody.appendChild(item);
    });
  });
});
