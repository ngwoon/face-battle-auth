$(document).ready(function(){

    const btn = $(".js-btn");

    btn.on("click", (event) => {

        event.preventDefault();

        const email = $(".js-email").val();
        const name = $(".js-name").val();
        const password = $(".js-password").val();
        const birth_date = $(".js-birth-date").val();
        const question = $(".js-selector").val();
        const answer = $(".js-answer").val();
    
        console.log(`${email}, ${name}, ${password}, ${birth_date}, ${question}, ${answer}`);

        const data = {
            email,
            name,
            password,
            birth_date,
            question,
            answer,
        };
        
        const url = "http://localhost:3000/registration";
        const method = "POST";
        const dataType = "json";
        const contentType = "application/json";
        const sendData = JSON.stringify(data);
        const success = (data) => {
            switch(data.resultCode) {
                case "00":
                    alert("인증 메일이 전송되었습니다.");
                    document.location.href = "http://localhost:3000/verification/email";
                    break;
                case "01":
                    alert("이미 가입된 회원입니다.");
                    break;
                case "02":
                    alert("인증 메일 전송에 실패했습니다.");
                    break;
                case "03":
                    alert("서버에서 인증 코드 저장에 실패했습니다.");
                    break;
            }
        };

        $.ajax({
            "url": url,
            "method": method,
            "dataType": dataType,
            "data": sendData,
            "contentType": contentType,
            "success": success,
            "fail": (error) => {
                alert("ajax 에러");
                alert(error);
            }
        });
    });
});