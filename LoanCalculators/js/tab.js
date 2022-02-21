const tabs = document.querySelectorAll('[data-tab-target]');
const tabContents = document.querySelectorAll('[data-tab-content]');

tabs.forEach( tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget);
        //remove active from all content sections
        tabContents.forEach(tabContent => {
            tabContent.classList.add('inActive');
            tabContent.classList.remove('active');
        });
        //remove active from all the tabs
        tabs.forEach(tabNow => {
            tabNow.classList.add('inActive');
            tabNow.classList.remove('active');
        });
    
        tab.classList.add('active');//add active to the activated tab
        target.classList.remove('inActive');//remove inactive from the activated section content
        target.classList.add('active');//add active to the activated section content
    });
});
