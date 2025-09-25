// Sample recipes data
const recipes = [
  {
    id: 1,
    title: "Spaghetti Carbonara",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "200g spaghetti",
      "100g pancetta",
      "2 large eggs",
      "50g Pecorino cheese",
      "Freshly ground black pepper",
      "Salt"
    ],
    instructions: "1. Cook spaghetti in salted boiling water until al dente.\n2. Fry pancetta until crisp.\n3. Beat eggs and mix with grated Pecorino cheese.\n4. Drain spaghetti and quickly mix with pancetta and egg mixture off heat.\n5. Serve immediately with extra cheese and pepper."
  },
  {
    id: 2,
    title: "Classic Pancakes",
    image: "https://images.unsplash.com/photo-1523983302520-d2f38d280e50?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "1 cup all-purpose flour",
      "2 tbsp sugar",
      "2 tsp baking powder",
      "Pinch of salt",
      "1 cup milk",
      "1 large egg",
      "2 tbsp melted butter"
    ],
    instructions: "1. Mix flour, sugar, baking powder, and salt.\n2. Whisk milk, egg, and melted butter.\n3. Combine wet and dry ingredients.\n4. Heat pan and cook pancakes 2-3 mins each side.\n5. Serve with syrup or toppings."
  },
  {
    id: 3,
    title: "Avocado Toast",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "Salt",
      "Pepper",
      "Chili flakes (optional)",
      "Lemon juice"
    ],
    instructions: "1. Toast bread slices.\n2. Mash avocado with salt, pepper, and lemon juice.\n3. Spread avocado on toast.\n4. Sprinkle chili flakes if desired.\n5. Enjoy immediately."
  }
];

// DOM elements
const recipeGrid = document.getElementById("recipeGrid");
const searchInput = document.getElementById("searchInput");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalIngredients = document.getElementById("modalIngredients");
const modalInstructions = document.getElementById("modalInstructions");
const favoriteBtn = document.getElementById("favoriteBtn");

let currentRecipeId = null;

// Local Storage key
const FAVORITES_KEY = "favoriteRecipes";

// Render recipe cards
function renderRecipes(recipesToRender) {
  recipeGrid.innerHTML = "";
  if (recipesToRender.length === 0) {
    recipeGrid.innerHTML = `<p style="text-align:center; color:#777;">No recipes found.</p>`;
    return;
  }
  recipesToRender.forEach(recipe => {
    const card = document.createElement("article");
    card.className = "recipe-card";
    card.setAttribute("tabindex", 0);
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View details for ${recipe.title}`);

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" />
      <div class="recipe-info">
        <h3 class="recipe-title">${recipe.title}</h3>
      </div>
    `;

    card.addEventListener("click", () => openModal(recipe.id));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(recipe.id);
      }
    });

    recipeGrid.appendChild(card);
  });
}

// Open modal with recipe details
function openModal(recipeId) {
  const recipe = recipes.find(r => r.id === recipeId);
  if (!recipe) return;
  currentRecipeId = recipeId;

  modalTitle.textContent = recipe.title;

  modalIngredients.innerHTML = recipe.ingredients
    .map(i => `<li>${i}</li>`)
    .join("");

  modalInstructions.textContent = recipe.instructions;

  updateFavoriteBtn();

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden"; // prevent background scroll

  modal.focus();
}

// Close modal
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
  currentRecipeId = null;
}

// Get favorites from localStorage
function getFavorites() {
  const favs = localStorage.getItem(FAVORITES_KEY);
  return favs ? JSON.parse(favs) : [];
}

// Save favorites to localStorage
function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

// Toggle favorite status for current recipe
function toggleFavorite() {
  if (currentRecipeId === null) return;
  let favs = getFavorites();
  if (favs.includes(currentRecipeId)) {
    favs = favs.filter(id => id !== currentRecipeId);
  } else {
    favs.push(currentRecipeId);
  }
  saveFavorites(favs);
  updateFavoriteBtn();
}

// Update favorite button text
function updateFavoriteBtn() {
  const favs = getFavorites();
  if (currentRecipeId !== null && favs.includes(currentRecipeId)) {
    favoriteBtn.textContent = "Remove from Favorites";
  } else {
    favoriteBtn.textContent = "Add to Favorites";
  }
}

// Filter recipes based on search input
function filterRecipes(query) {
  query = query.trim().toLowerCase();
  if (!query) {
    return recipes;
  }
  return recipes.filter(recipe => {
    const inTitle = recipe.title.toLowerCase().includes(query);
    const inIngredients = recipe.ingredients.some(ingredient =>
      ingredient.toLowerCase().includes(query)
    );
    return inTitle || inIngredients;
  });
}

// Event listeners
searchInput.addEventListener("input", e => {
  const filtered = filterRecipes(e.target.value);
  renderRecipes(filtered);
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", e => {
  if (e.target === modal) {
    closeModal();
  }
});
favoriteBtn.addEventListener("click", toggleFavorite);

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// Initial render
renderRecipes(recipes);
