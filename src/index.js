let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  loadInitialToyCards();

  const form = document.querySelector("form.add-toy-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = event.target.name;
    const imageInput = event.target.image;

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: nameInput.value,
        image: imageInput.value,
        likes: 0,
      }),
    })
      .then((response) => response.json())
      .then((toy) => {
        renderToyCard(toy);
      });
  });
});

function loadInitialToyCards() {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      for (const toy of toys) {
        renderToyCard(toy);
      }
    });
}

function renderToyCard(toy) {
  const toyCard = document.createElement("div");
  toyCard.className = "card";

  const toyHeader = document.createElement("h2");
  toyHeader.innerText = toy.name;
  toyCard.append(toyHeader);

  const toyImg = document.createElement("img");
  toyImg.src = toy.image;
  toyImg.className = "toy-avatar";
  toyCard.append(toyImg);

  const toyLikes = document.createElement("p");
  toyLikes.innerText = toy.likes + " likes";
  toyCard.append(toyLikes);

  const toyBtn = document.createElement("button");
  toyBtn.className = "like-btn";
  toyBtn.id = toy.id;
  toyBtn.innerText = "Like ❤️";
  toyBtn.addEventListener("click", () => {
    fetch("http://localhost:3000/toys/" + toy.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: ++toy.likes,
      }),
    })
      .then((response) => response.json())
      .then((toy) => {
        toyLikes.innerText = toy.likes + " likes";
      });
  });
  toyCard.append(toyBtn);

  document.querySelector("#toy-collection").appendChild(toyCard);
}
