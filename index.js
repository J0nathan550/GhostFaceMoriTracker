const survivors = [
	'Dwight Fairfield', 'Meg Thomas', 'Claudette Morel', 'Jake Park', 'Nea Karlsson',
	'Laurie Strode', 'Ace Visconti', 'Bill Overbeck', 'Feng Min', 'David King',
	'David Tapp', 'Kate Denson', 'Adam Francis', 'Jeff Johansen', 'Jane Romero', 'Ash Williams',
	'Nancy Wheeler', 'Steve Harrington', 'Yui Kimura', 'Zarina Kassir', 'Cheryl Mason',
	'Felix Richter', 'Élodie Rakoto', 'Yun-Jin Lee', 'Jill Valentine', 'Leon S. Kennedy',
	'Mikaela Reid', 'Jonah Vasquez', 'Yoichi Asakawa', 'Haddie Kaur', 'Ada Wong',
	'Rebecca Chambers', 'Vittorio Toscano', 'Thalita Lyra', 'Renato Lyra', 'Gabriel Soma',
	'Nicolas Cage', 'Ellen Ripley', 'Alan Wake', 'Sable Ward', 'Orela Rose',
	'The Troupe (Aestri Yazar)', 'The Troupe (Baermar Uraz)', 'Lara Croft', 'Trevor Belmont', 
	'Taurie Cain', 'Rick Grimes', 'Michonne Grimes'
];

let trackedSurvivors = new Set();

function loadTrackedSurvivors() {
	const saved = localStorage.getItem('ghostfaceTrackedSurvivors');
	if (saved) {
		trackedSurvivors = new Set(JSON.parse(saved));
	}
}

function saveTrackedSurvivors() {
	localStorage.setItem('ghostfaceTrackedSurvivors', JSON.stringify([...trackedSurvivors]));
}

function getSurvivorImagePath(name) {
	const filename = name
		.replace(/\s+/g, '_') 
		.replace(/[^\w\s\-\(\)]/g, '')
		.replace(/\(/g, '_')
		.replace(/\)/g, '')
		.toLowerCase();
	
	return `gallery/portraits/${filename}.webp`;
}

function createSurvivorCard(survivor) {
	const isTracked = trackedSurvivors.has(survivor);
	const imagePath = getSurvivorImagePath(survivor);
	
	return `
		<div class="survivor-card ${isTracked ? 'tracked' : ''}" data-survivor="${survivor}">
			<div class="crossed-overlay">
				<img src="gallery/crossed.png" alt="Crossed Out" class="crossed-image" onerror="this.style.display='none'">
			</div>
			<img src="${imagePath}" alt="${survivor}" class="survivor-image" onerror="handleImageError(this)">
			<div class="survivor-name">${survivor}</div>
		</div>
	`;
}

function handleImageError(img) {
	img.style.backgroundColor = '#333333';
	img.style.display = 'flex';
	img.style.alignItems = 'center';
	img.style.justifyContent = 'center';
	img.style.fontSize = '10px';
	img.style.color = '#666666';
	img.innerHTML = 'No Image';
	img.classList.add('error');
}

function renderSurvivors() {
	const grid = document.getElementById('survivorsGrid');
	grid.innerHTML = survivors.map(survivor => createSurvivorCard(survivor)).join('');
	
	document.querySelectorAll('.survivor-card').forEach(card => {
		card.addEventListener('click', () => {
			const survivor = card.dataset.survivor;
			toggleSurvivor(survivor);
		});
	});

	updateStats();
}

function toggleSurvivor(survivor) {
	if (trackedSurvivors.has(survivor)) {
		trackedSurvivors.delete(survivor);
	} else {
		trackedSurvivors.add(survivor);
	}
	
	saveTrackedSurvivors();
	renderSurvivors();
	filterSurvivors();
}

function updateStats() {
	const statsText = document.getElementById('statsText');
	statsText.textContent = `${trackedSurvivors.size} out of ${survivors.length} survivors tracked`;
}

function filterSurvivors() {
	const searchTerm = document.getElementById('searchBar').value.toLowerCase();
	const cards = document.querySelectorAll('.survivor-card');
	
	cards.forEach(card => {
		const survivorName = card.dataset.survivor.toLowerCase();
		if (survivorName.includes(searchTerm)) {
			card.classList.remove('hidden');
		} else {
			card.classList.add('hidden');
		}
	});
}

function showConfirmModal(title, message, onConfirm) {
	const modal = document.getElementById('confirmModal');
	const modalTitle = document.getElementById('modalTitle');
	const modalMessage = document.getElementById('modalMessage');
	const confirmBtn = document.getElementById('confirmBtn');
	
	modalTitle.textContent = title;
	modalMessage.textContent = message;
	modal.style.display = 'block';
	
	const newConfirmBtn = confirmBtn.cloneNode(true);
	confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
	
	newConfirmBtn.addEventListener('click', () => {
		onConfirm();
		modal.style.display = 'none';
	});
}

function hideConfirmModal() {
	document.getElementById('confirmModal').style.display = 'none';
}

function selectAllSurvivors() {
	survivors.forEach(survivor => trackedSurvivors.add(survivor));
	saveTrackedSurvivors();
	renderSurvivors();
	filterSurvivors();
}

function deselectAllSurvivors() {
	trackedSurvivors.clear();
	saveTrackedSurvivors();
	renderSurvivors();
	filterSurvivors();
}

window.handleImageError = handleImageError;

function init() {
	loadTrackedSurvivors();
	renderSurvivors();

	document.getElementById('searchBar').addEventListener('input', filterSurvivors);

	document.getElementById('selectAllBtn').addEventListener('click', () => {
		showConfirmModal(
			'Select All Survivors',
			'Are you sure you want to mark all survivors as tracked?',
			selectAllSurvivors
		);
	});

	document.getElementById('deselectAllBtn').addEventListener('click', () => {
		showConfirmModal(
			'Deselect All Survivors',
			'Are you sure you want to untrack all survivors?',
			deselectAllSurvivors
		);
	});

	document.getElementById('cancelBtn').addEventListener('click', hideConfirmModal);

	window.addEventListener('click', (event) => {
		const modal = document.getElementById('confirmModal');
		if (event.target === modal) {
			hideConfirmModal();
		}
	});
}

document.addEventListener('DOMContentLoaded', init);