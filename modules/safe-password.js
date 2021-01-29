module.exports = {
    createPassword(length) {
        const digits = ['1','2','3','4','5','6','7','8','9','0'];
        const alphas = [
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
        ];
        const specs = ['!','@','#','$','%','^','&','*'];
        let password = "";
        const alphaIdx = parseInt(length / 3);
        const digitIdx = parseInt(length*2 / 3);
        const specIdx = parseInt(length*3 / 3) - 1;

        for(let i=0; i<length; ++i) {

            let currentChar;

            if(i === alphaIdx)
                currentChar = alphas[parseInt(Math.random() * alphas.length)];
            else if(i === digitIdx)
                currentChar = digits[parseInt(Math.random() * digits.length)];
            else if(i === specIdx)
                currentChar = specs[parseInt(Math.random() * specs.length)];
            else {
                const charType = parseInt(Math.random() * 3);
                
                if(charType === 0)
                    currentChar = alphas[parseInt(Math.random() * alphas.length)];
                else if(charType === 1)
                    currentChar = digits[parseInt(Math.random() * digits.length)];
                else if(charType === 2)
                    currentChar = specs[parseInt(Math.random() * specs.length)];
            }
            
            password += currentChar;
        }

        return password;
    },
}