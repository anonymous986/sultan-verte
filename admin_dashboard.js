document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar__nav-item');
    const tabs = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');

            if (target) {
                // Deactivate all links and tabs
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                tabs.forEach(tab => tab.classList.remove('active'));

                // Activate the clicked link and corresponding tab
                link.classList.add('active');
                document.getElementById(target).classList.add('active');
            }
        });
    });
});
