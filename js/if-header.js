$('.head')[0].innerHTML =
`
	<div class="header"></div>
	<div class="header-links"></div>
`

$('.header')[0].innerHTML =
	`
	<img class="header-logo" src="img/tinv.png" alt="TINV"></img></h1>
	<h1 class="header-text">Tinville Finance Presale</h1>
	<img class="header-logo-right" src="img/tinvs.png" alt="TINVS"></img></h1>
	`

$('.header-links')[0].innerHTML =
`
	<div class="" style="padding-bottom: 10px;">
		<div class="center">
			<a href="https://t.me/The_Industry_Network_Official" target="_blank">
			<img src="./img/sm-telegram.png"></a>
		</div >
	</div>
`

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
	$('.header-links')[0].innerHTML =
		`
			<div class="" style="padding-bottom: 10px;">
				<div class="center">
					<a href="https://t.me/The_Industry_Network_Official" target="_blank">
					<img src="./img/sm-telegram.png"></a>
				</div >
			</div>
		`
}
