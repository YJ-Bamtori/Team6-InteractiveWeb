//클릭 스티커 생성이벤트
document.getElementById('click-area').addEventListener('click', function(event) {
    const images = ['sticker01.png', 'sticker02.png', 'sticker03.png', 'sticker04.png', 'sticker05.png', 'sticker06.png', 'sticker07.png', 'sticker08.png'];//스티커 랜덤배열
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imgElement = document.createElement('img');
    imgElement.src = 'img/' + randomImage;
    imgElement.onload = function() {
    const imageWidth = imgElement.width;
    const imageHeight = imgElement.height;
    const adjustedX = event.clientX - imageWidth / 2; //x좌표
    const adjustedY = event.clientY - imageHeight / 2; //y좌표
    const randomAngle = Math.floor(Math.random() * 360); //각도랜덤
        
        imgElement.style.position = 'absolute';
        imgElement.style.left = adjustedX + 'px';
        imgElement.style.top = adjustedY + 'px';
        imgElement.style.transform = 'rotate(' + randomAngle + 'deg)'; // 랜덤 각도 적용
        imgElement.classList.add('temp-sticker'); // 임시 스티커 표시
        document.getElementById('click-area').appendChild(imgElement);

        showModal(imgElement); // 모달 창을 스티커와 함께 활성화
    };
    });
    
    function showModal(tempImg) {
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
    
    // 저장 버튼 이벤트를 재설정
    document.querySelector('.modal03 button').onclick = function() {
        tempImg.classList.remove('temp-sticker'); // 스티커를 임시에서 영구로 전환
        modal.style.display = 'none';
    };
    
    // 모달 창 닫기 버튼
    document.querySelector('.modal .close').onclick = function() {
        if (tempImg.classList.contains('temp-sticker')) {
            tempImg.remove(); // 스티커 제거
        }
        modal.style.display = 'none';
    };
    
    // 화면 바깥 클릭 시 모달 닫기
    window.onclick = function(event) {
        if (event.target == modal) {
            if (tempImg.classList.contains('temp-sticker')) {
                tempImg.remove(); // 스티커 제거
            }
            modal.style.display = 'none';
        }
    };
    }
    
    // 저장 버튼 클릭 이벤트
    document.querySelector('.modal03 button').addEventListener('click', function() {
    const title = document.querySelector('.modal02 .title').value;
    const content = document.querySelector('.modal02 textarea').value;
    const nickname = document.querySelector('.modal03 input[type="text"]').value;
    const category = document.querySelector('.modal01 select').value;
    
    addMemo(title, content, nickname, category);
    
    // 모달 창 닫기
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
    });  
    
    function updateMemoContainer() {
        const memoContainer = document.getElementById('memoContainer');
        const gridRows = document.querySelectorAll('.grid-row');
        let rowCount = 0;
    
        // 메모가 있는 grid-row만 세기
        gridRows.forEach(row => {
            if (row.children.length > 0) {
                rowCount++;
            }
        });
    
        // grid-template-rows 스타일 동적으로 업데이트
        memoContainer.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`;
    
        // addmemo 클래스가 적용되어 있지 않다면 추가
        if (!memoContainer.classList.contains('addmemo')) {
            memoContainer.classList.add('addmemo');
        }
    }

    function addMemo(title, content, nickname, category) { // 새로운 메모 엘리먼트 생성
        const memo = document.createElement('div');
        
        memo.className = 'memo-list';
        memo.innerHTML = `
            <div class="container">
                <h3>${title}</h3>
                <p>${content}</p>
            </div>
            <footer>by ${nickname}</footer>
        `;
        
        memo.style.display = 'flex';
        memo.style.flexDirection = 'column';
        memo.style.justifyContent = 'space-between';
        memo.style.border = 'transparent';
        memo.style.padding = '48px 36px';
        memo.style.color = '#fff';
        memo.style.height = '100%';
        memo.style.width = '100%';
        memo.dataset.category = category;
    
       // 메모를 grid-row에 순차적으로 추가하기
    const gridRows = document.querySelectorAll('.grid-row');
    let added = false;
    for (let i = 0; i < gridRows.length; i++) {
        if (gridRows[i].children.length < 3) {
            gridRows[i].appendChild(memo);
            added = true;
            break;  // 메모를 추가한 후 반복 종료
        }
    }

    if (added) {
        document.querySelector('.disable-icon').style.display = 'none';  // 메모 추가 후 disable-icon 숨기기
        updateMemoContainer();  // 그리드 업데이트 호출
    } else {
        console.error("모든 grid-row가 이미 최대 메모 수를 초과했습니다.");
    }

    checkIfEmpty();  // 모든 grid-row 검사하여 disable-icon 업데이트
}

document.addEventListener('DOMContentLoaded', function() {
    updateMemoContainer();  // 초기 그리드 설정
    checkIfEmpty();         // 비어 있는지 검사
});

function checkIfEmpty() {
    const gridRows = document.querySelectorAll('.grid-row');
    const disableIcon = document.querySelector('.disable-icon');
    const pagination = document.querySelector('.pagination');
    const memoContainer = document.querySelector('#memoContainer');
    let isEmpty = true;

    gridRows.forEach(row => {
        if (row.children.length > 0) {
            isEmpty = false;
        }
    });
    if (isEmpty) {
        disableIcon.style.display = 'flex'; // 메모가 없으면 disable-icon 보이기
        pagination.style.display = 'none';   // 메모가 없으면 pagination 숨기기
        memoContainer.style.display = 'none';
    } else {
        disableIcon.style.display = 'none';  // 메모가 있으면 disable-icon 숨기기
        pagination.style.display = 'flex';   // 메모가 있으면 pagination 보이기
        memoContainer.style.display = 'grid';
    }
}

// 페이지 로드 시 검사
document.addEventListener('DOMContentLoaded', checkIfEmpty);




// 드롭다운 필터 로직
document.getElementById('categoryFilter').addEventListener('change', function() {
    const category = this.value;
    const memos = document.querySelectorAll('#memoContainer .memo');
    memos.forEach(memo => {
    if (category === 'all' || memo.dataset.category === category) {
    memo.style.display = ''; // 보이기
    } else {
    memo.style.display = 'none'; // 숨기기
    }
    });
    });



    