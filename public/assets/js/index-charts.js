'use strict';

/* Chart.js docs: https://www.chartjs.org/ */

window.chartColors = {
	green: '#75c181',
	gray: '#a9b5c9',
	text: '#252930',
	border: '#e7e9ed'
};

/* Random number generator for demo purpose */
var randomDataPoint = function () { return Math.round(Math.random() * 10000) };


//Chart.js Line Chart Example 

var lineChartConfig = {
	type: 'line',

	data: {
		labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],

		datasets: [{
			label: 'Current week',
			fill: false,
			backgroundColor: window.chartColors.green,
			borderColor: window.chartColors.green,
			data: [
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint()
			],
		}, {
			label: 'Previous week',
			borderDash: [3, 5],
			backgroundColor: window.chartColors.gray,
			borderColor: window.chartColors.gray,

			data: [
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint(),
				randomDataPoint()
			],
			fill: false,
		}]
	},
	options: {
		responsive: true,
		aspectRatio: 1.5,

		legend: {
			display: true,
			position: 'bottom',
			align: 'end',
		},

		title: {
			display: true,
			text: 'Chart.js Line Chart Example',

		},
		tooltips: {
			mode: 'index',
			intersect: false,
			titleMarginBottom: 10,
			bodySpacing: 10,
			xPadding: 16,
			yPadding: 16,
			borderColor: window.chartColors.border,
			borderWidth: 1,
			backgroundColor: '#fff',
			bodyFontColor: window.chartColors.text,
			titleFontColor: window.chartColors.text,

			callbacks: {
				//Ref: https://stackoverflow.com/questions/38800226/chart-js-add-commas-to-tooltip-and-y-axis
				label: function (tooltipItem, data) {
					if (parseInt(tooltipItem.value) >= 1000) {
						return "$" + tooltipItem.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					} else {
						return '$' + tooltipItem.value;
					}
				}
			},

		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.border,
				},
				scaleLabel: {
					display: false,

				}
			}],
			yAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.border,
				},
				scaleLabel: {
					display: false,
				},
				ticks: {
					beginAtZero: true,
					userCallback: function (value, index, values) {
						return '$' + value.toLocaleString();   //Ref: https://stackoverflow.com/questions/38800226/chart-js-add-commas-to-tooltip-and-y-axis
					}
				},
			}]
		}
	}
};



// Chart.js Bar Chart Example 

var barChartConfig = {
	type: 'bar',

	data: {
		labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
		datasets: [{
			label: 'Orders',
			backgroundColor: window.chartColors.green,
			borderColor: window.chartColors.green,
			borderWidth: 1,
			maxBarThickness: 16,

			data: [
				23,
				45,
				76,
				75,
				62,
				37,
				83
			]
		}]
	},
	options: {
		responsive: true,
		aspectRatio: 1.5,
		legend: {
			position: 'bottom',
			align: 'end',
		},
		title: {
			display: true,
			text: 'Chart.js Bar Chart Example'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
			titleMarginBottom: 10,
			bodySpacing: 10,
			xPadding: 16,
			yPadding: 16,
			borderColor: window.chartColors.border,
			borderWidth: 1,
			backgroundColor: '#fff',
			bodyFontColor: window.chartColors.text,
			titleFontColor: window.chartColors.text,

		},
		scales: {
			xAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.border,
				},

			}],
			yAxes: [{
				display: true,
				gridLines: {
					drawBorder: false,
					color: window.chartColors.borders,
				},


			}]
		}

	}
}






function ivDoughtnutChart(option) {
	if (option == 0) {
		var endpoint = `http://localhost:3000/charts/iv/week`;
	} else {
		var endpoint = `http://localhost:3000/charts/iv/${option}`;

	}

	return fetch(endpoint)
		.then(response => response.json())
		.then(result => {
			var new_data = [];
			for (var i = 0; i < result.length; i++) {
				new_data.push(result[i].count);
			}

			var doughnutChartConfig = {
				type: 'doughnut',
				data: {
					datasets: [{
						data: new_data,
						backgroundColor: [
							window.chartColors.green,
							window.chartColors.blue,
							window.chartColors.gray,

						],
						label: 'Dataset 1'
					}],
					labels: [
						`Pending: ${new_data[0]}`,
						`Approved: ${new_data[1]}`,
						`Denied: ${new_data[2]}`,

					]
				},
				options: {
					responsive: true,
					legend: {
						display: true,
						position: 'bottom',
						align: 'center',
					},

					tooltips: {
						titleMarginBottom: 10,
						bodySpacing: 10,
						xPadding: 16,
						yPadding: 16,
						borderColor: window.chartColors.border,
						borderWidth: 1,
						backgroundColor: '#fff',
						bodyFontColor: window.chartColors.text,
						titleFontColor: window.chartColors.text,

						animation: {
							animateScale: true,
							animateRotate: true
						},

						/* Display % in tooltip - https://stackoverflow.com/questions/37257034/chart-js-2-0-doughnut-tooltip-percentages */
						callbacks: {
							label: function (tooltipItem, data) {
								//get the concerned dataset
								var dataset = data.datasets[tooltipItem.datasetIndex];
								//calculate the total of this data set
								var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
									return previousValue + currentValue;
								});
								//get the current items value
								var currentValue = dataset.data[tooltipItem.index];
								//calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
								var percentage = Math.floor(((currentValue / total) * 100) + 0.5);

								return percentage + "%";
							},
						},


					},
				}
			};
			return doughnutChartConfig;
		})

}

function iiBarChart(option) {
	if (option == 0) {
		var endpoint = `http://localhost:3000/charts/ii/week`;
	} else {
		var endpoint = `http://localhost:3000/charts/ii/${option}`;

	}

	return fetch(endpoint)
		.then(response => response.json())
		.then(result => {
			var new_data = [];
			for (var i = 0; i < result.length; i++) {
				new_data.push(result[i].count);
			}


			var barChartConfig = {
				type: 'bar',

				data: {
					labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
					datasets: [{
						label: 'Orders',
						backgroundColor: window.chartColors.green,
						borderColor: window.chartColors.green,
						borderWidth: 1,
						maxBarThickness: 16,

						data: [
							23,
							45,
							76,
							75,
							62,
							37,
							83
						]
					}]
				},
				options: {
					responsive: true,
					aspectRatio: 1.5,
					legend: {
						position: 'bottom',
						align: 'end',
					},
					title: {
						display: true,
						text: 'Chart.js Bar Chart Example'
					},
					tooltips: {
						mode: 'index',
						intersect: false,
						titleMarginBottom: 10,
						bodySpacing: 10,
						xPadding: 16,
						yPadding: 16,
						borderColor: window.chartColors.border,
						borderWidth: 1,
						backgroundColor: '#fff',
						bodyFontColor: window.chartColors.text,
						titleFontColor: window.chartColors.text,

					},
					scales: {
						xAxes: [{
							display: true,
							gridLines: {
								drawBorder: false,
								color: window.chartColors.border,
							},

						}],
						yAxes: [{
							display: true,
							gridLines: {
								drawBorder: false,
								color: window.chartColors.borders,
							},


						}]
					}

				}
			}
			return barChartConfig;
		})

}

// Generate charts on load
window.addEventListener('load', function () {
	//chart by id
	var doughnutChart = document.getElementById('chart-doughnut').getContext('2d');

	// var lineChart = document.getElementById('canvas-linechart').getContext('2d');
	// window.myLine = new Chart(lineChart, lineChartConfig);

	var barChart = document.getElementById('canvas-barchart').getContext('2d');
	window.myBar = new Chart(barChart, barChartConfig);

	//select box on change
	var selectBox = document.getElementById('iv-doughnut');
	selectBox.addEventListener('change', function () {
		var selected = selectBox.options[selectBox.selectedIndex].value;
		ivDoughtnutChart(selected).then(response => window.myDoughnut = new Chart(doughnutChart, response));
	});


	ivDoughtnutChart(0).then(response => window.myDoughnut = new Chart(doughnutChart, response));



});

