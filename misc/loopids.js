const axios = require('axios')
const fs = require('fs')

const tsoUrl = a => `https://rest.tsoapi.com/PubTrans/GetModuleInfoPublic?Key=ROUTES&id=${a}&lan=en`
const minCompanyId = 0
const maxCompanyId = 50000 // arbitrary, after I-Bus at 49454

let k = minCompanyId

const upK = () => {
  ;(k += 1)
  fireETA()
}

const runGet = async () => {
  if (k >= maxCompanyId) process.exit(0)
  const companyid = k
  let cdata
  try {
    let { data } = await axios.get(tsoUrl(companyid))
    cdata = data
  } catch (err) {
    return runGet()
  }

  upK()

  if (cdata !== `[]`) {
    console.log(`👍  Got ${companyid}`)
    fs.appendFileSync('loops.txt', String(companyid) + '\n')
  }

  runGet()
}
const startTime = Date.now()
let textETA = ''

setInterval(() => {
  const elapsed = (Date.now() - startTime) / 1000 // seconds
  const rate = ((k - minCompanyId) / elapsed)
  const ETA = Math.round((maxCompanyId - k) / rate) // => seconds left
  const min = Math.floor(ETA / 60)
  if (min >= 60) textETA = `${Math.floor(min / 60)}hr ${min % 60}min ${ETA % 60}s`
  else if (ETA >= 60) textETA = `${min}min ${ETA % 60}s`
  else textETA = `${ETA % 60}s`
  fireETA()
}, 1000)

const fireETA = () => {
  process.stdout.write(`\x1b[KCurrently at ${k} (${textETA} remaining)\x1b[0G`)
}

runGet()
