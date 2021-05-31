// nav - home
function home_click(){
    // $('.about-container').hide();
    // $('.file-upload').show();
    // $('.about-container').hide();
    document.getElementsByClassName('about-container').style.display = "block";
}


//about display
function about_click(){
    $('.file-upload').hide();
}


//image uploads

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.image-upload-wrap').hide();

            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();

            $('.image-title').html(input.files[0].name);
        };

        reader.readAsDataURL(input.files[0]);

        // 사진 업로드 후 모델 생성(async, await -> then)
        init()
            .catch(() => {
                console.log('loading');
            })
            .then(() => {
                // console.log("init completed");
                predict();
                
            });
        
        loadingMsg = "모자는 고민에 빠졌습니다...<br>결과가 나올때까지 잠시만 기다려주세요."
        $('.result-msg').html(loadingMsg);
        
        
    } else {
        removeUpload();
    }
}

function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
    
    prediction = [];
}
$('.image-upload-wrap').bind('dragover', function () {
    $('.image-upload-wrap').addClass('image-dropping');
});
$('.image-upload-wrap').bind('dragleave', function () {
    $('.image-upload-wrap').removeClass('image-dropping');
});

// GOOGLE TEACHABLE MACHINE

// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = 'https://teachablemachine.withgoogle.com/models/5of55d06K/';

let model, webcam, labelContainer, maxPredictions;

// Load the image model and setup the webcam
async function init() {
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    // const flip = true; // whether to flip the webcam
    // webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    // await webcam.setup(); // request access to the webcam
    // await webcam.play();
    // window.requestAnimationFrame(loop);

    // append elements to the DOM
    // document.getElementById('webcam-container').appendChild(webcam.canvas);
    
    // 결과값 반복해서 넣기
    // labelContainer = document.getElementById('label-container');
    // for (let i = 0; i < maxPredictions; i++) {
    //     // and class labels
    //     labelContainer.appendChild(document.createElement('div'));
    // }
}

// async function loop() {
//     webcam.update(); // update the webcam frame
//     await predict();
//     window.requestAnimationFrame(loop);
// }

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element

    var image = document.getElementById('face-image');

    const prediction = await model.predict(image, false);
    // 예측 높은 순으로 정렬
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    // console.log(prediction[0]);
    var resultMsg = 0;
    switch (prediction[0].className) {
        case 'gryffindor':
            resultMsg =
                '당신의 기숙사는 용기와 결의, 강인하면서도 숭고한 마음을 지닌 <b><span class="house-txt" style="color:rgb(160 63 64)">그리핀도르</span></b>입니다.<br><br><span class="fav-txt">유리한 특성</span><br> 용감함, 기사도, 고귀함, 경쟁적, 대담함, 모험심, 다른 이를 위해 기꺼이 맞섬<br><span class="unfav-txt">불리한 특성</span><br> 충동적, 완고함, 격해지기 쉬움, 거만함, 무모함<br><br>🏆 🍬 👊 🔥 🍀<br>Welcome to Gryffindor!<br>Gryffindor values courage, bravery, nerve, and chivalry.<br><span class="fav-txt">Favorable Traits</span><br> Brave, Chivalrous, Noble, Competitive, Daring, Adventurous, Willing to Stand Up for Others<br><span class="unfav-txt">Unfavorable Traits</span><br>Impulsive, Stubborn, Hot-headed, Arrogant, Reckless';
            break;
        case 'hufflepuff':
            resultMsg =
                '당신은 근면, 인내, 정의 및 충성심을 가치로 여기는 <b><span class="house-txt" style="color:rgba(148, 107, 45,1)">후플푸프</span></b> 학생입니다.<br><br><span class="fav-txt">유리한 특성</span><br> 근면함, 헌신적, 공정함, 인내심, 충성, 친절, 겸손, 정직<br><span class="unfav-txt">불리한 특성</span><br> 귀가 얇음, 멍함, 순진, 줏대가 없음, 쉽게 이용당함<br><br>🌻 🍽 ☕ ❤︎ 🌱<br>Welcome to Hufflepuff!<br>Hufflepuff values hard work, patience, justice, and loyalty.<br><span class="fav-txt">Favorable Traits</span><br>Hard-working, Dedicated, Fair, Patient, Loyal, Kind, Humble, Honest<br><span class="unfav-txt">Unfavorable Traits</span><br>Too Trusting, Absent-minded, Naive, Spineless, Easy Taken Advantage Of';
            break;
        case 'ravenclaw':
            resultMsg =
                '당신은 지능, 학습, 지혜 및 재치를 가치있게 생각하는 <b><span class="house-txt" style="color:#4172b5">레번클로</span></b> 학생입니다.<br><br><span class="fav-txt">유리한 특성</span><br> 현명함, 지능적, 창의적, 영리함, 지식이 많음, 기발함<br><span class="unfav-txt">불리한 특성</span><br> 잘난척, 헛된 노력, 대립, 무시를 잘함, 지나친 자부심<br><br>🦅 🌙 📖 ✨ 🎨<br>Welcome to Ravenclaw!<br>Ravenclaw values intelligence, learning, wisdom and wit.<br><span class="fav-txt">Favorable Traits</span><br>Wise, Intelligent, Creative, Clever, Knowledgeable, Quirky<br><span class="unfav-txt">Unfavorable Traits</span><br>Know-it-all, Vain, Standoffish, Dismissive, Overly Proud';
            break;
        case 'slytherin':
            resultMsg =
                '당신의 기숙사는 목적을 달성하기 위해선 수단과 방법을 가리지 않을 야심가들과 재간꾼들을 위한 기숙사인 <b><span class="house-txt" style="color:rgb(44 128 74)">슬리데린</span></b>입니다.<br><br><span class="fav-txt">유리한 특성</span><br> 교활함, 영리함, 야심적, 자부심, 수완, 단호함<br><span class="unfav-txt">불리한 특성</span><br> 교활함, 무자비함, 이기적, 조작적<br><br>🐍 🌲 🌠 🌩 🍷<br>Welcome to Slytherin!<br>Slytherin values ambition, cunning, leadership, and resourcefulness.<br><span class="fav-txt">Favorable Traits</span><br>Sly, Clever, Ambitious, Prideful, Resourceful, Determined<br><span class="unfav-txt">Unfavorable Traits</span><br>Cunning, Ruthless, Selfish, Entitled, Manipulative';
            break;
        case 'muggle':
            resultMsg = '당신은 마법을 사용할 수 없는 <span style="color:rgba(93, 93, 93,1)">머글</span>입니다. 안타깝지만 호그와트에 입학할 수 없습니다.<br>😥😩😭<br>Sorry, You are a muggle who cannot be admitted to Hogwarts, school for witches and wizards.';
            break;
        default:
            resultMsg = '기숙사 배정 불가(No Result)';
    }

    //jquery를 이용하여 결과메세지 넣기
    $('.result-msg').html(resultMsg);

    // labelContainer에 결과값 넣기
    // for (let i = 0; i < maxPredictions; i++) {
    //     const classPrediction =
    //         prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
    //     labelContainer.childNodes[i].innerHTML = classPrediction;
    // }
    
    // CHART.JS
    // 차트 데이터 설정
    const data = {
      labels: [
          prediction[0].className,
          prediction[1].className,
          prediction[2].className,
          prediction[3].className,
          prediction[4].className
          
      ],
      datasets: [{
        label: 'RESULT',
        data: [          
          prediction[0].probability.toFixed(2)*100,
          prediction[1].probability.toFixed(2)*100,
          prediction[2].probability.toFixed(2)*100,
          prediction[3].probability.toFixed(2)*100,
          prediction[4].probability.toFixed(2)*100
        ],
        backgroundColor: [
            "rgba(116, 0, 1,0.4)",
            "rgba(26, 71, 42,0.4)",
            "rgba(71,45,104,0.4)",
            "rgba(148, 107, 45, 0.4)",
            "rgba(93, 93, 93,0.4)"
        ],
        borderColor: [
            "rgba(116, 0, 1,1)",
            "rgba(26, 71, 42,1)",
            "rgba(71,45,104,1)",
            "rgba(148, 107, 45, 1)",
            "rgba(93, 93, 93,1)"
        ],
        borderWidth: 2,
        hoverBackgroudColor: [
            "rgba(116, 0, 1,0.6)",
            "rgba(26, 71, 42,0.6)",
            "rgba(71,45,104,0.6)",
            "rgba(148, 107, 45, 0.4)",
            "rgba(93, 93, 93,0.6)"
        ],
        hoverBorderColor: [
            "rgba(116, 0, 1,1)",
            "rgba(26, 71, 42,1)",
            "rgba(71,45,104,1)",
            "rgba(148, 107, 45, 1)",
            "rgba(93, 93, 93,1)"
        ],
        hoverOffset: 0,
      }]
    };    
    
    // 차트 타입 설정
    const config = {
      type: 'doughnut',
      data: data,
    };
    
    const options = { 
        responsive: true, 
        legend: false, 
        maintainAspectRatio : false, 
        animation: false, 
        pieceLabel: { mode:"label", position:"outside", fontSize: 11, fontStyle: 'bold' },
        plugins: {
            labels: {
                render: function (options) {
                    var value = options.value;
                    return value + "%";
                }
            }
        }
    }
                
    Chart.defaults.font.family = 'DungGeunMo';
    Chart.defaults.font.size = 12;
    Chart.defaults.plugins.legend.position = 'right';
    
    // 차트그리기
    var myChart = new Chart(
        document.getElementById('myChart'),
        config,
        options
    );
}
