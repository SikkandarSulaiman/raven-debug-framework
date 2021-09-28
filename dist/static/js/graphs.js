$('#graphs-trigger').on('click', function() {
	if ($(this).hasClass('selected-navkey')) return
	$('.mainmenu-navkey').each(function() { $(this).removeClass('selected-navkey') })
	$(this).addClass('selected-navkey')
	$('.dispmeter-sidenav').hide('slide', {direction: 'right'})
	$('#shorthand-tabs').hide('slide', {direction: 'down'})
	$.when($('.mainmenu-mainbody').each(function() { $(this).hide('slide', {direction: 'left'}) })).done(function() {
		$('#graphs-mainbody').show('slide', {direction: 'left'})
	})
})

var xArray = [50,60,70,80,90,100,110,120,130,140,150,160];
var yArray = [7,8,8,9,9,9,10,11,14,14,15,6];

// Define Data
var data = [{
  x: xArray,
  y: yArray,
  mode:"lines"
}];

// Define Layout
var layout = {
  xaxis: {range: [40, 160], title: "Square Meters"},
  yaxis: {range: [5, 16], title: "Price in Millions"},
  title: "House Prices vs. Size"
};

// Display using Plotly
Plotly.newPlot("myPlot", data, layout);
