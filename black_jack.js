const shape = ["♥","♠","◆", "♣"];
const num = [1,2,3,4,5,6,7,8,9,10,"J","Q","K"];
let max_deck=[];
let current_deck;
let player_deck = [];
let dealer_deck = [];
let start = document.querySelector('.start');
let stand = document.querySelector('.stand');
let end = "off";
let 잔소리 = "on";
let auto = "off";

//첫 시작시 전체 덱 도감 생성
for (let i=0; i<shape.length; i++) {
    for (let j=0; j<num.length; j++) {
        let deck = {shape: shape[i], num: num[j]};
        max_deck.push(deck); 
    }
}; 


//덱 도감과 현재 덱 분리
current_deck = max_deck;

// 플레이어와 딜러에게 랜덤으로 처음엔 2장, 이후 1장씩 카드 지급
function shuffle() {
    if (end === "on") {
        end_();
    } else {
        if (player_deck.length === 0) {
                player_get();
                player_get();
                
                dealer_get();
                dealer_get();
            } else {
                player_get();
                dealer_get();
            }    
    }
            
}

//랜덤 카드 지정
function random_() {
    return Math.floor(Math.random()*current_deck.length);
}

//플레이어 카드 획득 처리
function player_get() {
    let deck = random_();
    player_deck.push(current_deck[deck]);
    deck_delete(deck);
    displayPlayerDeck();
}

// 딜러 카드 획득 처리
function dealer_get() {
    let deck = random_();
    dealer_deck.push(current_deck[deck]);
    deck_delete(deck);
    displayDealerDeck();
    let sum = 0;        
    // 딜러 카드 합 17 체크용
       dealer_deck.forEach(card => {
            sum += card_num_trans(card.num);
            if (sum >= 17) {
                end = "on";
            }
        });
        if (end === "on") {
            end_();
        }
}

//뽑아간 current_deck은 비우기 - 없는걸 줄 수는 없음
function deck_delete(deck) {
    current_deck.splice(deck,1);
} 


// 화면에 플레이어 덱 표시 
function displayPlayerDeck() {
    let deckElement = document.getElementById("player-deck");

    // 기존 카드 요소를 모두 지움
    deckElement.innerHTML = "";

    player_deck.forEach(card => {
        // 카드 요소 생성
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        
        if (card.num === "J") {
            cardElement.innerText = `${card.shape}${card.num}(11)`;
        } else if (card.num === "Q") {
            cardElement.innerText = `${card.shape}${card.num}(12)`;
        } else if (card.num === "K") {
            cardElement.innerText = `${card.shape}${card.num}(13)`;
        } else {
            cardElement.innerText = `${card.shape}${card.num}`;
        }
        
        // 카드 요소를 덱 요소에 추가
        deckElement.appendChild(cardElement);
    });
}

// 화면에 딜러 덱 표시(첫 카드 빼곤 전부 가림)
function displayDealerDeck() {

    let deckElement = document.getElementById("dealer-deck");

    // 기존 카드 요소를 모두 지움
    deckElement.innerHTML = "";

    let reversed_deck = dealer_deck.slice().reverse();
    reversed_deck.forEach((card, index) => {
        // 카드 요소 생성
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        if (index === reversed_deck.length - 1) {
            if (card.num === "J") {
                cardElement.innerText = `${card.shape}${card.num}(11)`;
            } else if (card.num === "Q") {
                cardElement.innerText = `${card.shape}${card.num}(12)`;
            } else if (card.num === "K") {
                cardElement.innerText = `${card.shape}${card.num}(13)`;
            } else {
                cardElement.innerText = `${card.shape}${card.num}`;
            }
        } else {
            // cardElement.innerText += `${card.shape}${card.num}`;
        }
        // 카드 요소를 덱 요소에 추가
        deckElement.appendChild(cardElement);
    });
}

//카드 데이터 숫자화(알파벳도 숫자로)
function card_num_trans(num) {
    if (num === "J") {
        return 11;
    } else if (num === "Q") {
        return 12;
    } else if (num === "K") {
        return 13;
    } else {
        return Number(num);
    }
}

//플레이어 더 이상 카드 받기 싫을 때
function auto_process() {
    if (player_deck.length === 0) {
        alert('최초 1회 셔플은 필수입니다.')
    } else {
        auto = "on";
        if (end !== "on") {
            dealer_get();
            return auto_process();
        } else {
            end_();
        }
    }
}

function end_() {
    let player_sum=0, dealer_sum=0, player_distance=0, dealer_distance=0;
    
    player_deck.forEach(card => {
        player_sum += card_num_trans(card.num);
    });

    dealer_deck.forEach(card => {
        dealer_sum += card_num_trans(card.num);
    });

    //마지막에는 딜러의 팩 모두 오픈
    final_deck_open();
    // 승패 계산

    setTimeout(() => {
    if (auto === "off") {
        if (player_sum > 21 && dealer_sum > 21) {
            alert('둘 다 21점을 넘겼습니다! \n무승부로 하세요!');
        } else if (player_sum > 21 && dealer_sum <= 21) {
            alert('당신은 21점을 넘겼습니다! \n 당신의 패배입니다!');
        } else if (player_sum <= 21 && dealer_sum > 21) {
            alert('딜러가 21점을 넘겼습니다! \n 당신의 승리입니다!');
        } else {
            player_distance = 21 - player_sum;
            dealer_distance = 21 - dealer_sum;

            if (player_distance < dealer_distance) {
                alert(`당신이 21점에 ${dealer_distance-player_distance}점만큼 더 가깝습니다! \n 당신의 승리입니다!`);
            } else if (player_distance > dealer_distance) {
                alert(`딜러가 21점에 ${player_distance-dealer_distance}점만큼 당신보다 더 가깝습니다! \n 딜러의 승리입니다!`);
            } else {
                alert('둘의 점수가 같습니다! \n 무승부입니다!')
            }
        }
    } else if (auto === "on" && 잔소리 === "on") {
        잔소리 = "off";
        if (player_sum > 21 && dealer_sum > 21) {
                    alert('둘 다 21점을 넘겼습니다! \n무승부로 하세요!');
                } else if (player_sum > 21 && dealer_sum <= 21) {
                    alert('당신은 21점을 넘겼습니다! \n 당신의 패배입니다!');
                } else if (player_sum <= 21 && dealer_sum > 21) {
                    alert('딜러가 21점을 넘겼습니다! \n 당신의 승리입니다!');
                } else {
                    player_distance = 21 - player_sum;
                    dealer_distance = 21 - dealer_sum;

                    if (player_distance < dealer_distance) {
                        alert(`당신이 21점에 ${dealer_distance-player_distance}점만큼 더 가깝습니다! \n 당신의 승리입니다!`);
                    } else if (player_distance > dealer_distance) {
                        alert(`딜러가 21점에 ${player_distance-dealer_distance}점만큼 당신보다 더 가깝습니다! \n 딜러의 승리입니다!`);
                    } else {
                        alert('둘의 점수가 같습니다! \n 무승부입니다!')
                    }
                }
    } },500);

}


//마지막 딜러 패 모두 오픈
function final_deck_open() {
    let deckElement = document.getElementById("dealer-deck");

    // 기존 카드 요소를 모두 지움
    deckElement.innerHTML = "";

    let reversed_deck = dealer_deck.slice().reverse();
    reversed_deck.forEach((card, index) => {
        // 카드 요소 생성
        const cardElement = document.createElement("div");
        cardElement.className = "card";
        if (card.num === "J") {
            cardElement.innerText = `${card.shape}${card.num}(11)`;
        } else if (card.num === "Q") {
            cardElement.innerText = `${card.shape}${card.num}(12)`;
        } else if (card.num === "K") {
            cardElement.innerText = `${card.shape}${card.num}(13)`;
        } else {
            cardElement.innerText = `${card.shape}${card.num}`;
        }
        // 카드 요소를 덱 요소에 추가
        deckElement.appendChild(cardElement);
    });
}



// 최초 게임 시작 
start.addEventListener('click', shuffle);
stand.addEventListener('click',auto_process);
