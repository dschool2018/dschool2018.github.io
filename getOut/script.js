let remote = axios.create({
    baseURL: 'http://192.168.43.84/',
    timeout: 100,
})

// const ipSetup = document.getElementById('ip-setup')
// const ipSetupBtn = document.getElementById('ip-setup-btn')
const greenBtn = document.getElementById('green-btn')
const orangeBtn = document.getElementById('orange-btn')
const redBtn = document.getElementById('red-btn')
const stopBtn = document.getElementById('stop-btn')

const setButtonAction = (btn, action) => {
    btn.addEventListener("click", function() {
        remote.get(`/${action}`)
    })
}

setButtonAction(greenBtn, 'g')
setButtonAction(orangeBtn, 'o')
setButtonAction(redBtn, 'r')
setButtonAction(stopBtn, 'n')

// ipSetupBtn.addEventListener('click', function() {
//     const ip = ipSetup.value
//     remote = axios.create({
//         baseURL: `http://${ip}/`,
//         timeout: 100,
//     })
// })