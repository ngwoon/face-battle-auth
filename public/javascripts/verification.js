$(document).ready(function() {
    $(".js-btn").on("click", (event) => {

        event.preventDefault();

        const verificationCode = $(".js-verification-code").val();

        console.log(verificationCode);
        
        const url = "http://localhost:3000/verification/email";
        const method = "POST";
        const dataType = "json";
        const contentType = "application/json";
        const data = JSON.stringify({ "code": verificationCode });
        const success = (data) => {
            switch(data.resultCode) {
                case "00":
                    alert("이메일 인증 성공!");
                    break;
                case "01":
                    alert("이메일 인증 실패");
                    break;
            }
        };

        $.ajax({
            url,
            method,
            dataType,
            contentType,
            data,
            success,
            fail: (error) => {
                alert("ajax 에러");
                alert(error);
            }
        });
    });
});