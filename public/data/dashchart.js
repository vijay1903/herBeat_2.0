//  Heartrate Chart
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var DAYS = [];

for(var i =1; i <= 31; i++){
	DAYS[i-1] = String(i);
}

var randomScalingFactor = function(min, max) {
	var mn = min?min:0;
	var mx = max?max:100;
    return Math.floor(Math.random() * (mx - mn)) + mn;
};
var color = Chart.helpers.color;

var generateHourlyAvgData = function() {
	var data = [];
	for (var i = 0; i < 168; i++) {
	  data.push({
		x: i/24,
		y: randomScalingFactor(60,120)
	  });
	}
	return data;
  };
  
  // generates daily avg data by calculating the hourly
  // avg for each day
  var generateDailyAvgData = function(hourlyAvgData) {
	var chunkSize = 24;
	var data = [];
	
	for (var i = 0; i < hourlyAvgData.length / chunkSize; i++) {
	  var startIndex = i * chunkSize;
	  var slicedData = hourlyAvgData.slice(startIndex, startIndex + chunkSize);
	  var sum = slicedData.reduce(function(acc, val, index) {
		return acc + slicedData[index].y;
	  }, slicedData[0].y);
	  for(var j = 0; j<=startIndex; j++){
	  data.push({x: j+1, y:sum / chunkSize});
	  }
	}
	
	return data;
  };
  
  var hourlyAvgData = generateHourlyAvgData();
  var dailyAvgData = generateDailyAvgData(hourlyAvgData);

console.log(dailyAvgData);

var config_ya = {
	type: 'radar',
	data: {
		labels: [['Eating', 'Dinner'], ['Drinking', 'Water'], 'Sleeping', ['Designing', 'Graphics'], 'Coding', 'Cycling', 'Running'],
		datasets: [{
			label: 'My First dataset',
			backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
			borderColor: window.chartColors.red,
			pointBackgroundColor: window.chartColors.red,
			data: [
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500)
			]
		}, {
			label: 'My Second dataset',
			backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
			borderColor: window.chartColors.blue,
			pointBackgroundColor: window.chartColors.blue,
			data: [
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500)
			]
		}]
	},
	options: {
		legend: {
			position: 'top',
		},
		title: {
			display: true,
			text: 'Your Activities'
		},
		scale: {
			ticks: {
				beginAtZero: true
			}
		}
	}
};

var config_hr = {
	type: 'bar',
	data: {
	  labels: ["1", "2", "3", "4", "5", "6", "7"],
	  datasets: [{
		type: 'bar',
		label: 'Daily Avg',
		backgroundColor: chartColors.red,
		data: dailyAvgData,
		// xAxisID: 'x-axis-1',
		borderColor: 'white',
		borderWidth: 2
	  }, {
		type: 'line',
		label: 'Hourly Avg',
		borderColor: chartColors.green,
		backgroundColor: chartColors.green,
		borderWidth: 1,
		fill: false,
		pointRadius: 1,
		xAxisID: 'x-axis-2',
		data: hourlyAvgData
	  }]
	},
	options: {
	  responsive: true,
	  title: {
		display: true,
		text: 'Heartrate'
	  },
	  tooltips: {
		mode: 'nearest',
		intersect: true
	  },
	  scales: {
		xAxes: [{	
		  }, {
		  id: 'x-axis-2',
		  type: 'linear',
		  position: 'top',
		  display: true,
		}]
	  }
	}
  };

var config_bc = {
	type: 'line',
	data: {
		labels: ['1', '2', '3', '4', '5', '6', '7'],
		datasets: [{
			label: 'Battery Percentage',
			backgroundColor: window.chartColors.red,
			borderColor: window.chartColors.red,
			data: [
				randomScalingFactor(0,100),
				randomScalingFactor(0,100),
				randomScalingFactor(0,100),
				randomScalingFactor(0,100),
				randomScalingFactor(0,100),
				randomScalingFactor(0,100),
				randomScalingFactor(0,100)
			],
			fill: false,
		}]
	},
	options: {
		responsive: true,
		title: {
			display: true,
			text: 'Watch Battery'
		},
		tooltips: {
			mode: 'index',
			intersect: false,
		},
		hover: {
			mode: 'nearest',
			intersect: true
		},
		scales: {
			xAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Day'
				}
			}],
			yAxes: [{
				display: true,
				scaleLabel: {
					display: true,
					labelString: 'Charge percentage'
				}
			}]
		}
	}
};

var config_wc = {
	type: 'line',
	data: {
		labels: ['1', '2', '3', '4', '5', '6'],
		datasets: [{
			label: 'Wifi Connection',
			steppedLine: 'after',
			data: [
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2)
	],
			borderColor: window.chartColors.blue,
			fill: false,
		}]
	},
	options: {
		responsive: true,
		title: {
			display: true,
			text: 'Bluetooth Connection',
		},
		scales: {
			yAxes: [{
			   ticks: {
				  stepSize: 1
			   }
			}]
		}
	}
};

var config_bt = {
	type: 'line',
	data: {
		labels: ['1', '2', '3', '4', '5', '6'],
		datasets: [{
			label: 'Bluetooth Connection',
			steppedLine: 'after',
			data:[
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2),
				randomScalingFactor(0,2)
	],
			borderColor: window.chartColors.purple,
			fill: false,
		}]
	},
	options: {
		responsive: true,
		title: {
			display: true,
			text: 'Bluetooth Connection',
		},
		scales: {
			yAxes: [{
			   ticks: {
				  stepSize: 1
			   }
			}]
		}
	}
};

var color = Chart.helpers.color;

var config_ac = {
	type: 'horizontalBar',
	data: {
		labels: ['1', '2', '3', '4', '5', '6', '7'],
		datasets: [{
			label: 'Sitting Duration',
			backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
			borderColor: window.chartColors.red,
			borderWidth: 1,
			data: [
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500)
			]
		}, {
			label: 'Sitting Target',
			backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
			borderColor: window.chartColors.blue,
			data: [
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500)
			]
		}, {
			label: 'Walking Duration',
			backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
			borderColor: window.chartColors.red,
			data: [
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500)
			]
		}, {
			label: 'Walking Target',
			backgroundColor: color(window.chartColors.blue).alpha(0.5).rgbString(),
			borderColor: window.chartColors.blue,
			data: [
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500),
				randomScalingFactor(0,500)
			]
		}]
	
	},
	options: {
		elements: {
			rectangle: {
				borderWidth: 2,
			}
		},
		responsive: true,
		legend: {
			position: 'top',
			labels : {
				usePointStyle : true
			}
		},
		title: {
			display: true,
			text: 'Your Activities'
		}
	}
};



window.onload = function() {
	var ctx_hr = document.getElementById('heartrateChart').getContext('2d');
    window.myLine = new Chart(ctx_hr, config_hr);
	
	var ctx_ac = document.getElementById('activity-chart').getContext('2d');
	window.myHorizontalBar = new Chart(ctx_ac, config_ac);
	
	var ctx_bc = document.getElementById('batteryChart').getContext('2d');
	window.myLine_bc = new Chart(ctx_bc, config_bc);

	var ctx_wc = document.getElementById('wifiChart').getContext('2d');
	window.myLine_wc = new Chart(ctx_wc, config_wc);

	var ctx_bt = document.getElementById('bluetoothChart').getContext('2d');
	window.myLine_bt = new Chart(ctx_bt, config_bt);

	var ctx_ya = document.getElementById('your-activities');
	window.myRadar = new Chart(ctx_ya, config_ya);
};

// Heartrate Chart

document.getElementById('randomizeData_hr').addEventListener('click', function() {
	config_hr.data.datasets.forEach(function(dataset) {
		dataset.data = dataset.data.map(function() {
			return randomScalingFactor(60, 120);
		});

	});

	window.myLine.update();
});

var colorNames_hr = Object.keys(window.chartColors);

document.getElementById('addData_hr').addEventListener('click', function() {
	if (config_hr.data.datasets.length > 0) {
		var day = DAYS[config_hr.data.labels.length % DAYS.length];
		config_hr.data.labels.push(day);

		config_hr.data.datasets.forEach(function(dataset) {
			dataset.data.push(randomScalingFactor(60,120));
		});

		window.myLine.update();
	}
});

document.getElementById('removeData_hr').addEventListener('click', function() {
	config_hr.data.labels.splice(-1, 1); // remove the label first

	config_hr.data.datasets.forEach(function(dataset) {
		dataset.data.pop();
	});

	window.myLine.update();
});


// Activity Chart



document.getElementById('randomizeData_ya').addEventListener('click', function() {
	config_ya.data.datasets.forEach(function(dataset) {
		dataset.data = dataset.data.map(function() {
			return randomScalingFactor(0,500);
		});
	});

	window.myRadar.update();
});

var colorNames_ya = Object.keys(window.chartColors);

document.getElementById('addDataset_ya').addEventListener('click', function() {
	var colorName = colorNames_ya[config_ya.data.datasets.length % colorNames_ya.length];
	var newColor = window.chartColors[colorName];

	var newDataset = {
		label: 'Dataset ' + config_ya.data.datasets.length,
		borderColor: newColor,
		backgroundColor: color(newColor).alpha(0.2).rgbString(),
		pointBorderColor: newColor,
		data: [],
	};

	for (var index = 0; index < config_ya.data.labels.length; ++index) {
		newDataset.data.push(randomScalingFactor(0,500));
	}

	config_ya.data.datasets.push(newDataset);
	window.myRadar.update();
});

// document.getElementById('addData_ya').addEventListener('click', function() {
// 	if (config_ya.data.datasets.length > 0) {
// 		config_ya.data.labels.push('dataset #' + config_ya.data.labels.length);

// 		config_ya.data.datasets.forEach(function(dataset) {
// 			dataset.data.push(randomScalingFactor());
// 		});

// 		window.myRadar.update();
// 	}
// });

document.getElementById('removeDataset_ya').addEventListener('click', function() {
	config_ya.data.datasets.splice(0, 1);
	window.myRadar.update();
});

// document.getElementById('removeData_ya').addEventListener('click', function() {
// 	config_ya.data.labels.pop(); // remove the label first

// 	config_ya.data.datasets.forEach(function(dataset) {
// 		dataset.data.pop();
// 	});

// 	window.myRadar.update();
// });


// Battery Chart


document.getElementById('randomizeData_bc').addEventListener('click', function() {
	config_bc.data.datasets.forEach(function(dataset) {
		dataset.data = dataset.data.map(function() {
			return randomScalingFactor(0,100);
		});

	});

	window.myLine_bc.update();
});

var colorNames_bc = Object.keys(window.chartColors);

document.getElementById('addData_bc').addEventListener('click', function() {
	if (config_bc.data.datasets.length > 0) {
		var day = DAYS[config_bc.data.labels.length % DAYS.length];
		config_bc.data.labels.push(day);

		config_bc.data.datasets.forEach(function(dataset) {
			dataset.data.push(randomScalingFactor(0,100));
		});

		window.myLine_bc.update();
	}
});

document.getElementById('removeData_bc').addEventListener('click', function() {
	config_bc.data.labels.splice(-1, 1); // remove the label first

	config_bc.data.datasets.forEach(function(dataset) {
		dataset.data.pop();
	});

	window.myLine_bc.update();
});



document.getElementById('randomizeData_bc').addEventListener('click', function() {
	config_bc.data.datasets.forEach(function(dataset) {
		dataset.data = dataset.data.map(function() {
			return randomScalingFactor(0,100);
		});

	});

	window.myLine_bc.update();
});

var colorNames = Object.keys(window.chartColors);

document.getElementById('addData_bc').addEventListener('click', function() {
	if (config_bc.data.datasets.length > 0) {
		var day = DAYS[config_bc.data.labels.length % DAYS.length];
		config_bc.data.labels.push(day);

		config_bc.data.datasets.forEach(function(dataset) {
			dataset.data.push(randomScalingFactor(0,100));
		});

		window.myLine_bc.update();
	}
});

document.getElementById('removeData_bc').addEventListener('click', function() {
	config_bc.data.labels.splice(-1, 1); // remove the label first

	config_bc.data.datasets.forEach(function(dataset) {
		dataset.data.pop();
	});

	window.myLine_bc.update();
});



//Your Activities


document.getElementById('randomizeData_ac').addEventListener('click', function() {
    config_ac.data.datasets.forEach(function(dataset) {
        dataset.data = dataset.data.map(function() {
            return randomScalingFactor(100,500);
        });
    });

    window.myHorizontalBar.update();
});

var colorNames_ac = Object.keys(window.chartColors);

document.getElementById('addData_ac').addEventListener('click', function() {
	if (config_ac.data.datasets.length > 0) {
		var day = DAYS[config_ac.data.labels.length % DAYS.length];
		config_ac.data.labels.push(day);

		config_ac.data.datasets.forEach(function(dataset) {
			dataset.data.push(randomScalingFactor(0,500));
		});

		window.myHorizontalBar.update();
	}
});

document.getElementById('removeData_ac').addEventListener('click', function() {
	config_ac.data.labels.splice(-1, 1); // remove the label first

	config_ac.data.datasets.forEach(function(dataset) {
		dataset.data.pop();
	});

	window.myHorizontalBar.update();
});

