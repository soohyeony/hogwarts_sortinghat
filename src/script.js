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
        loadingMsg = "모자는 고민에 빠졌습니다..잠시만 기다려주세요."
        $('.result-msg').html(loadingMsg);
    } else {
        removeUpload();
    }
}

function removeUpload() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
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
const URL = 'https://teachablemachine.withgoogle.com/models/whxHMzrv7/';

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
                '당신의 기숙사는 용기와 결의, 강인하면서도 숭고한 마음을 지닌 <b>그리핀도르</b>입니다.<br> 🏆 🍬 👊 🔥 🍀 <br>Welcome to Gryffindor!<br>Gryffindor values courage, bravery, nerve, and chivalry.';
            break;
        case 'hufflepuff':
            resultMsg =
                '당신은 근면, 인내, 정의 및 충성심을 가치로 여기는 <b>후플푸프</b> 학생입니다.<br> 🌻 🍽 ☕ ❤︎ 🌱 <br>Welcome to Hufflepuff!<br>Hufflepuff values hard work, patience, justice, and loyalty.';
            break;
        case 'ravenclaw':
            resultMsg =
                '당신은 지능, 학습, 지혜 및 재치를 가치있게 생각하는 <b>레번클로</b> 학생입니다.<br> 🦅 🌙 📖 ✨ 🎨 <br>Welcome to Ravenclaw!<br>Ravenclaw values intelligence, learning, wisdom and wit.';
            break;
        case 'slytherin':
            resultMsg =
                '당신의 기숙사는 목적을 달성하기 위해선 수단과 방법을 가리지 않을 야심가들과 재간꾼들을 위한 기숙사인 <b>슬리데린</b>입니다.<br>🐍 🌲 🌠 🌩 🍷 <br>Welcome to Slytherin!<br>Slytherin values ambition, cunning, leadership, and resourcefulness.';
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
          prediction[3].className
      ],
      datasets: [{
        label: 'RESULT',
        data: [          
          prediction[0].probability.toFixed(2)*100,
          prediction[1].probability.toFixed(2)*100,
          prediction[2].probability.toFixed(2)*100,
          prediction[3].probability.toFixed(2)*100],
        backgroundColor: [
            "rgba(156,18,3,0.4)",
            "rgba(227,160,0,0.4)",
            "rgba(3,56,7,0.4)",
            "rgba(0,22,94,0.4)"
        ],
        borderColor: [
            "rgba(156,18,3,1)",
            "rgba(227,160,0,1)",
            "rgba(3,56,7,1)",
            "rgba(0,22,94,1)"
        ],
        borderWidth: 2,
        hoverBackgroudColor: [
            "rgba(156,18,3,0.6)",
            "rgba(227,160,0,0.6)",
            "rgba(3,56,7,0.6)",
            "rgba(0,22,94,0.6)"
        ],
        hoverBorderColor: [
            "rgba(156,18,3,1)",
            "rgba(227,160,0,1)",
            "rgba(3,56,7,1)",
            "rgba(0,22,94,1)"
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
    Chart.defaults.font.size = 14;
    Chart.defaults.plugins.legend.position = 'left';
    
    // 차트그리기
    var myChart = new Chart(
        document.getElementById('myChart'),
        config,
        options
    );
}
