import crypto from 'crypto-browserify'
const date = new Date()



const pid = process.env.REACT_APP_PID
const hmacKey = process.env.REACT_APP_HMACKEY


const ymd = date.getFullYear().toString()
.concat(String(date.getMonth() + 1).padStart(2, "0"))
.concat(date.getDate().toString().padStart(2, "0"))


const hmacVal = getHmac(pid, ymd)
function getHmac(pid, ymd) {
    const value = pid.toString().concat(ymd)
    let hmac=crypto.createHmac("sha256",hmacKey).update(value).digest('hex')
    console.log(hmac.toString("base64"));
    return hmac.toString("base64")
}
export { hmacVal }