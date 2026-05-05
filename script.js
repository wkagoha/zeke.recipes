let recipes = JSON.parse(localStorage.getItem('zachi_recipes')) || [];
let ingredientImages = [];

// ЗВЕЗДЫ
function initStars() {
    const container = document.getElementById('starContainer');
    if(!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1 + 'px';
        star.style.width = size; star.style.height = size;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(star);
    }
}

function openApp() {
    document.getElementById('hero').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    initStars();
    renderList();
}

// ФОТО ЛОГИКА
function fileInputHandler(input, imgId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.getElementById(imgId);
            img.src = e.target.result;
            img.classList.remove('hidden');
            document.getElementById('main-label').classList.add('hidden');
            document.getElementById('remove-main-img').classList.remove('hidden');
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function removeMainPhoto(event) {
    if(event) event.stopPropagation();
    const img = document.getElementById('main-preview');
    img.src = "";
    img.classList.add('hidden');
    document.getElementById('remove-main-img').classList.add('hidden');
    document.getElementById('main-label').classList.remove('hidden');
    document.getElementById('main-file').value = "";
}

function triggerIngUpload(event) { 
    event.stopPropagation();
    document.getElementById('ing-file-input').click(); 
}

function handleMultiUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            ingredientImages.push(e.target.result);
            renderIngGallery();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function renderIngGallery() {
    const container = document.getElementById('ingredients-gallery');
    const btn = document.getElementById('add-ing-btn');
    container.querySelectorAll('.ing-container').forEach(el => el.remove());
    ingredientImages.forEach((src, i) => {
        const div = document.createElement('div');
        div.className = 'ing-container';
        div.innerHTML = `<img src="${src}" class="preview-img"><button class="delete-btn" style="width:18px;height:18px;font-size:12px;top:2px;right:2px;" onclick="removeIngPhoto(event, ${i})">×</button>`;
        container.insertBefore(div, btn);
    });
}

function removeIngPhoto(event, index) {
    event.stopPropagation();
    ingredientImages.splice(index, 1);
    renderIngGallery();
}

// СОХРАНЕНИЕ И СПИСОК
function saveRecipe() {
    const name = document.getElementById('recipeName').innerText.trim();
    if (!name) { alert("Write a name first!"); return; }

    const id = document.getElementById('currentRecipeId').value || Date.now().toString();
    
    const recipeData = {
        id: id,
        name: name,
        time: document.getElementById('cookingTime').innerText,
        diff: document.getElementById('difficulty').innerText,
        note: document.getElementById('recipeNote').innerText,
        ing: document.getElementById('ingredients').innerText,
        ins: document.getElementById('instructions').innerText,
        mainImg: document.getElementById('main-preview').src,
        ingImg: [...ingredientImages]
    };

    const index = recipes.findIndex(r => r.id === id);
    if (index > -1) { recipes[index] = recipeData; } 
    else { recipes.push(recipeData); }

    localStorage.setItem('zachi_recipes', JSON.stringify(recipes));
    document.getElementById('currentRecipeId').value = id;
    renderList();
    alert("Recipe saved to Collection!");
}

function renderList() {
    const list = document.getElementById('recipeList');
    list.innerHTML = '';
    recipes.forEach(r => {
        const div = document.createElement('div');
        div.className = 'recipe-item';
        div.innerHTML = `
            <span style="flex:1" onclick="loadRecipe('${r.id}')">${r.name}</span>
            <span class="del-item" onclick="deleteRecipe(event, '${r.id}')">×</span>
        `;
        list.appendChild(div);
    });
}

function loadRecipe(id) {
    const r = recipes.find(rec => rec.id === id);
    if (!r) return;

    document.getElementById('currentRecipeId').value = r.id;
    document.getElementById('recipeName').innerText = r.name;
    document.getElementById('cookingTime').innerText = r.time;
    document.getElementById('difficulty').innerText = r.diff;
    document.getElementById('recipeNote').innerText = r.note;
    document.getElementById('ingredients').innerText = r.ing;
    document.getElementById('instructions').innerText = r.ins;
    
    ingredientImages = r.ingImg || [];
    renderIngGallery();

    const mainImg = document.getElementById('main-preview');
    if (r.mainImg && r.mainImg.length > 50) {
        mainImg.src = r.mainImg;
        mainImg.classList.remove('hidden');
        document.getElementById('main-label').classList.add('hidden');
        document.getElementById('remove-main-img').classList.remove('hidden');
    } else {
        removeMainPhoto();
    }
}

function deleteRecipe(event, id) {
    event.stopPropagation();
    if (confirm("Delete this recipe forever?")) {
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem('zachi_recipes', JSON.stringify(recipes));
        renderList();
        if (document.getElementById('currentRecipeId').value === id) resetForm(false);
    }
}

// НОВЫЙ РЕЦЕПТ
function resetForm(ask = true) {
    if (ask && !confirm("Create new recipe? Current unsaved work will be lost.")) return;
    
    document.getElementById('currentRecipeId').value = "";
    document.getElementById('recipeName').innerText = "";
    document.getElementById('cookingTime').innerText = "";
    document.getElementById('difficulty').innerText = "";
    document.getElementById('recipeNote').innerText = "";
    document.getElementById('ingredients').innerText = "";
    document.getElementById('instructions').innerText = "";
    ingredientImages = [];
    renderIngGallery();
    removeMainPhoto();
}

// COOK MODE
function toggleCookingMode() {
    const mode = document.getElementById('cookingMode');
    if(mode.classList.contains('hidden')) {
        document.getElementById('modeTitleDisplay').innerText = document.getElementById('recipeName').innerText || "Masterpiece";
        document.getElementById('modeMainImg').src = document.getElementById('main-preview').src || "";
        document.getElementById('modeIngredientsDisplay').innerText = document.getElementById('ingredients').innerText;
        document.getElementById('modeInstructionsDisplay').innerText = document.getElementById('instructions').innerText;
        document.getElementById('modeNotes').innerText = document.getElementById('recipeNote').innerText;
        mode.classList.remove('hidden');
    } else {
        mode.classList.add('hidden');
    }
}

// ПОИСК
function filterRecipes() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.recipe-item');
    items.forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
    });
}

window.onload = initStars;