// Инициализация вкладок
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('href').substring(1);

            // Прокрутка к секции
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});