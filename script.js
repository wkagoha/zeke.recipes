// 1. ИНИЦИАЛИЗАЦИЯ ЗВЁЗД
function initStars() {
    const container = document.getElementById('starContainer');
    container.innerHTML = '';
    const count = 50;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 1 + 'px';
        star.style.width = size;
        star.style.height = size;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        container.appendChild(star);
    }
}

// 2. ИСПРАВЛЕНИЕ ПЕРЕХОДА
function openApp() {
    initStars();
    document.getElementById('hero').classList.add('hidden');
    const app = document.getElementById('app');
    app.classList.remove('hidden');
    window.scrollTo(0, 0);
    renderList();
    loadAutoSaved();
}

// ГЛАВНОЕ ФОТО
function fileInputHandler(input, imgId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById(imgId);
            img.src = e.target.result;
            img.classList.remove('hidden');
            document.getElementById('main-label').classList.add('hidden');
            document.getElementById('remove-main-img').classList.remove('hidden');
            autoSave();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function removeMainPhoto(event) {
    event.stopPropagation(); // ИЗМЕНЕНИЕ: останавливает всплытие клика
    const img = document.getElementById('main-preview');
    img.src = "";
    img.classList.add('hidden');
    document.getElementById('remove-main-img').classList.add('hidden');
    document.getElementById('main-label').classList.remove('hidden');
    // Сброс значения input, чтобы можно было загрузить то же фото
    document.getElementById('main-file').value = "";
    autoSave();
}

// ИНГРЕДИЕНТЫ (МНОЖЕСТВЕННАЯ ЗАГРУЗКА)
let ingredientImages = [];
function triggerIngUpload(event) { 
    event.stopPropagation();
    document.getElementById('ing-file-input').click(); 
}

function handleMultiUpload(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            ingredientImages.push(e.target.result);
            renderIngGallery();
            autoSave();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function renderIngGallery() {
    const container = document.getElementById('ingredients-gallery');
    const btn = document.getElementById('add-ing-btn');
    container.innerHTML = '';
    ingredientImages.forEach((src, i) => {
        const div = document.createElement('div');
        div.className = 'ing-container';
        div.innerHTML = `
            <img src="${src}" class="preview-img">
            <button class="delete-btn" style="width:16px; height:16px; font-size:10px; top:2px; right:2px;" onclick="removeIngPhoto(event, ${i})">×</button>
        `;
        container.appendChild(div);
    });
    container.appendChild(btn);
}

function removeIngPhoto(event, index) {
    event.stopPropagation();
    ingredientImages.splice(index, 1);
    renderIngGallery();
    autoSave();
}

// COOKING MODE
function toggleCookingMode() {
    const mode = document.getElementById('cookingMode');
    if(mode.classList.contains('hidden')) {
        document.getElementById('modeTitleDisplay').innerText = document.getElementById('recipeName').innerText || "New Recipe";
        document.getElementById('modeMainImg').src = document.getElementById('main-preview').src || "";
        document.getElementById('modeIngredientsDisplay').innerText = document.getElementById('ingredients').innerText;
        document.getElementById('modeInstructionsDisplay').innerText = document.getElementById('instructions').innerText;
        document.getElementById('modeNotes').innerText = document.getElementById('recipeNote').innerText;
        mode.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        mode.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// АВТОСОХРАНЕНИЕ
function autoSave() {
    const data = {
        name: document.getElementById('recipeName').innerText,
        time: document.getElementById('cookingTime').innerText,
        note: document.getElementById('recipeNote').innerText,
        ing: document.getElementById('ingredients').innerText,
        ins: document.getElementById('instructions').innerText,
        mainImg: document.getElementById('main-preview').src,
        ingImages: ingredientImages
    };
    localStorage.setItem('zachi_autosave', JSON.stringify(data));
}

function loadAutoSaved() {
    const data = JSON.parse(localStorage.getItem('zachi_autosave'));
    if(data) {
        document.getElementById('recipeName').innerText = data.name || "";
        document.getElementById('cookingTime').innerText = data.time || "";
        document.getElementById('recipeNote').innerText = data.note || "";
        document.getElementById('ingredients').innerText = data.ing || "";
        document.getElementById('instructions').innerText = data.ins || "";
        ingredientImages = data.ingImages || [];
        renderIngGallery();
        if(data.mainImg && data.mainImg.length > 100) {
            const img = document.getElementById('main-preview');
            img.src = data.mainImg;
            img.classList.remove('hidden');
            document.getElementById('main-label').classList.add('hidden');
            document.getElementById('remove-main-img').classList.remove('hidden');
        }
    }
}

function renderList() {
    const list = document.getElementById('recipeList');
    list.innerHTML = `<div class="pixel-text" style="font-size:0.9rem; opacity:0.6;">No recipes yet...</div>`;
}

function resetForm() {
    if(confirm("Start a new page?")) {
        localStorage.removeItem('zachi_autosave');
        location.reload();
    }
}

function saveRecipe() { alert("Saved!"); }
function filterRecipes() {}

window.onload = initStars;