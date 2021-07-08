const presaleABI = [{"inputs":[],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[{"internalType":"address payable","name":"reciever","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"recoverBNB","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"tokenAddress","type":"address"},{"internalType":"uint256","name":"tokenAmount","type":"uint256"}],"name":"recoverERC20","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"resetUsers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"maxAmount","type":"uint256"}],"internalType":"struct TokenPresale.Whitelist[]","name":"whitelisted","type":"tuple[]"}],"name":"whitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"depositAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"isIndexed","type":"bool"},{"internalType":"uint256","name":"whitelistedAmount","type":"uint256"}],"stateMutability":"view","type":"function"}]

const bnbPrecision = 1e18

const presaleAddress = "0x08cAda8Ea87919D42e6F5034476783055C9ad2bC" // "0xd93049b7312cB10B9D033C248A342DB710028E5D"

let web3
let loginInt
let attempts = 0

const user = {
    address: undefined,
	bnbBalance: undefined
}

$(document).ready(function() {
	window.addEventListener('load', async function () {
		await ethereum.request( {method: 'eth_requestAccounts'} )
		ethereum.request({ method: 'eth_accounts' }).then(function (result) {
			user.address = result[0]
			$('.user-address')[0].innerHTML = result[0].toLowerCase()

			web3 = new Web3(window.web3.currentProvider)
		})
		if(user.address != undefined){
			initContracts()
        }else 
			beginLogins()
	})
})
async function beginLogins(){
	await ethereum.request({method: 'eth_requestAccounts'})
	await userLoginAttempt()
	setTimeout(() => {
		if(user.address == undefined && attempts < 3){
			setTimeout(() => {
				if(user.address == undefined && attempts < 3){
					attempts++
					beginLogins()
				}
			}, 300)
		}
	}, 300)
}
async function userLoginAttempt(){
	await ethereum.request({method: 'eth_requestAccounts'})
	ethereum.request({ method: 'eth_accounts' }).then(function (result) {
		user.address = result[0]
		$('.user-address')[0].innerHTML = result[0].toLowerCase()
		web3 = new Web3(window.web3.currentProvider)
		initContracts()
	})
	loginInt = setInterval(async () => {
		ethereum.request({ method: 'eth_accounts' }).then(function (result) {
			if (window.ethereum && user.address !== result[0]) location.reload()
		})
	}, 5000)

}
async function initContracts(){
	try{
		await (presaleContract = new web3.eth.Contract(presaleABI, presaleAddress))
		getBalances()

	}catch(e){
		console.log(e)
		setTimeout(() => {
			initContracts()
		}, 250)
	}
}

async function getBalances() {
	if(user.address != undefined){
		user.bnbBalance = await web3.eth.getBalance(user.address) / bnbPrecision
		$('.user-bnbBalance')[0].innerHTML = user.bnbBalance.toLocaleString()

		let owner = await presaleContract.methods.owner().call()
		$('.owner-address')[0].innerHTML = owner.toLowerCase()
	}
	setTimeout(() => {
		getBalances()
	}, 2000)
}

let whitelistData = []
async function whitelistSetup(){
    whitelistData = JSON.parse( $('.whitelist-data')[0].value )
    for(let i = 0; i < whitelistData.length; i++){
        let maxAmount = whitelistData[i].maxAmount
        whitelistData[i].maxAmount = await web3.utils.toHex(maxAmount)
    }
    whitelist()
}

async function whitelist(){
    console.log(whitelistData)
	await presaleContract.methods.whitelist(whitelistData).send({
		from: user.address,
		shouldPollResponse: true,
	}, function(error, res){
		if(error)
			console.log(error)
		else{
			console.log(res)
			$('.tx-hash')[0].innerHTML = "TX Hash: " + res
			return res
		}
	})
}