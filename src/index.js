document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById("toy-collection");
  const toyForm = document.querySelector(".add-toy-form");
  const toyFormContainer = document.querySelector(".container");
  const addBtn = document.querySelector("#new-toy-btn");
  let addToy = false;

  // Toggle Form Visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and Display Toys
  function fetchToys() {
    fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
        toys.forEach(renderToy);
      });
  }

  // Render a Single Toy Card
  function renderToy(toy) {
    const toyCard = document.createElement("div");
    toyCard.className = "card";
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;

    // Like Button Event Listener
    toyCard.querySelector(".like-btn").addEventListener("click", (event) => {
      increaseLikes(event.target, toy, toyCard);
    });

    toyCollection.appendChild(toyCard);
  }

  // Add New Toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0
    };

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(toy => {
        renderToy(toy);
        toyForm.reset();
      });
  });

  // Increase Toy Likes
  function increaseLikes(button, toy, toyCard) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        toy.likes = updatedToy.likes;
        toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }

  // Initialize App
  fetchToys();
});