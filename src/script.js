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
    labelContainer = document.getElementById('label-container');
    for (let i = 0; i < maxPredictions; i++) {
        // and class labels
        labelContainer.appendChild(document.createElement('div'));
    }
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

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
    // console.log(prediction);
}