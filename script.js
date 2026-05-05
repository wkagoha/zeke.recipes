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
    loadAutoSaved();
}

function fileInputHandler(input, imgId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
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
    event.stopPropagation();
    const img = document.getElementById('main-preview');
    img.src = "";
    img.classList.add('hidden');
    document.getElementById('remove-main-img').classList.add('hidden');
    document.getElementById('main-label').classList.remove('hidden');
    document.getElementById('main-file').value = "";
    autoSave();
}

let ingredientImages = [];
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
        div.innerHTML = `<img src="${src}" class="preview-img"><button class="delete-btn" style="width:16px;height:16px;font-size:10px;top:2px;right:2px;" onclick="removeIngPhoto(event, ${i})">×</button>`;
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

function toggleCookingMode() {
    const mode = document.getElementById('cookingMode');
    if(mode.classList.contains('hidden')) {
        document.getElementById('modeTitleDisplay').innerText = document.getElementById('recipeName').innerText || "New Recipe";
        document.getElementById('modeMainImg').src = document.getElementById('main-preview').src || "";
        document.getElementById('modeIngredientsDisplay').innerText = document.getElementById('ingredients').innerText;
        document.getElementById('modeInstructionsDisplay').innerText = document.getElementById('instructions').innerText;
        document.getElementById('modeNotes').innerText = document.getElementById('recipeNote').innerText;
        mode.classList.remove('hidden');
    } else {
        mode.classList.add('hidden');
    }
}

function autoSave() {
    const data = {
        name: document.getElementById('recipeName').innerText,
        time: document.getElementById('cookingTime').innerText,
        diff: document.getElementById('difficulty').innerText,
        note: document.getElementById('recipeNote').innerText,
        ing: document.getElementById('ingredients').innerText,
        ins: document.getElementById('instructions').innerText,
        mainImg: document.getElementById('main-preview').src,
        ingImg: ingredientImages
    };
    localStorage.setItem('zachi_save', JSON.stringify(data));
}

function loadAutoSaved() {
    const data = JSON.parse(localStorage.getItem('zachi_save'));
    if(data) {
        document.getElementById('recipeName').innerText = data.name || "";
        document.getElementById('cookingTime').innerText = data.time || "";
        document.getElementById('difficulty').innerText = data.diff || "";
        document.getElementById('recipeNote').innerText = data.note || "";
        document.getElementById('ingredients').innerText = data.ing || "";
        document.getElementById('instructions').innerText = data.ins || "";
        ingredientImages = data.ingImg || [];
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

function resetForm() {
    if(confirm("Start new recipe?")) {
        localStorage.removeItem('zachi_save');
        location.reload();
    }
}

function saveRecipe() { alert("Saved!"); }
function filterRecipes() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    // Логика фильтрации списка слева
}

window.onload = () => {
    initStars();
};