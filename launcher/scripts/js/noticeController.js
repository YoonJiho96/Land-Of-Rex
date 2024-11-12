async function initializeNotices() {
    const noticeListElement = document.querySelector('.notice-list');
    const paginationElement = document.querySelector('.notice-pagination');

    let currentPage = 1;
    const pageSize = 5;

    async function loadNotices(page) {
        const data = await window.noticeAPI.getNotices(page, pageSize);
        if (data && data.notices) {
            renderNotices(data.notices);
            setupPagination(data.totalPages, page);
        } else {
            noticeListElement.innerHTML = '<li class="notice-item">공지사항을 불러올 수 없습니다.</li>';
        }
    }

    function renderNotices(notices) {
        noticeListElement.innerHTML = ''; // 기존 공지사항 초기화
        notices.forEach(notice => {
            const li = document.createElement('li');
            li.classList.add('notice-item');

            const category = document.createElement('span');
            category.classList.add('notice-category');
            category.textContent = notice.category;

            const content = document.createElement('div');
            content.classList.add('notice-content');
            content.textContent = notice.content;

            const date = document.createElement('span');
            date.classList.add('notice-date');
            date.textContent = formatDate(notice.date);

            li.appendChild(category);
            li.appendChild(content);
            li.appendChild(date);

            noticeListElement.appendChild(li);
        });
    }

    function setupPagination(totalPages, currentPage) {
        paginationElement.innerHTML = ''; // 기존 페이지네이션 초기화

        // 이전 버튼
        const prevButton = document.createElement('button');
        prevButton.classList.add('page-button');
        prevButton.textContent = '<';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                loadNotices(currentPage - 1);
            }
        });
        paginationElement.appendChild(prevButton);

        // 페이지 번호 버튼
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('page-button');
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.textContent = i;
            pageButton.addEventListener('click', () => {
                loadNotices(i);
            });
            paginationElement.appendChild(pageButton);
        }

        // 다음 버튼
        const nextButton = document.createElement('button');
        nextButton.classList.add('page-button');
        nextButton.textContent = '>';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                loadNotices(currentPage + 1);
            }
        });
        paginationElement.appendChild(nextButton);
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}.${month}.${day}`;
    }

    // 초기 로드
    loadNotices(currentPage);
}