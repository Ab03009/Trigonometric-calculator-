$(document).ready(function(){
  $('.function-buttons button').click(function(){
    var func = $(this).data('func');
    var inputValue = parseFloat($('#value').val());
    if(isNaN(inputValue)) {
      $('#result').html("Please enter a valid numeric value:");
      return;
    }
    
    // For asin and acos, the value must be in the range [-1, 1]
    if((func === "asin" || func === "acos") && (inputValue < -1 || inputValue > 1)) {
      $('#result').html("For the selected function, the value must be in the range [-1, 1].");
      return;
    }
    
    var angleRadians;
    if(func === "asin") {
      angleRadians = Math.asin(inputValue);
    } else if(func === "acos") {
      angleRadians = Math.acos(inputValue);
    } else if(func === "atan") {
      angleRadians = Math.atan(inputValue);
    }
    
    var unit = $('#unit').val();
    var computedY;
    var resultText = "";
    if(unit === "degrees") {
      computedY = angleRadians * (180 / Math.PI);
      resultText = "Result: " + computedY.toFixed(4) + "°";
    } else {
      computedY = angleRadians;
      resultText = "Result: " + computedY.toFixed(4) + " rad.";
    }
    
    $('#result').html(resultText);
    
    // Generating data for the graph
    var data = [];
    var start, end, step;
    if (func === "asin" || func === "acos") {
      start = -1;
      end = 1;
      step = (end - start) / 100;
    } else if (func === "atan") {
      start = -10;
      end = 10;
      step = (end - start) / 100;
    }
    
    for (var x = start; x <= end; x += step) {
      var y;
      if (func === "asin") {
        y = Math.asin(x);
      } else if (func === "acos") {
        y = Math.acos(x);
      } else if (func === "atan") {
        y = Math.atan(x);
      }
      if (unit === "degrees") {
        y = y * (180 / Math.PI);
      }
      data.push({ x: x, y: y });
    }
    
    // If the graph already exists, destroy it before creating a new one
    if (window.chart) {
      window.chart.destroy();
    }
    
    var ctx = document.getElementById('chart').getContext('2d');
    window.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: func + " function",
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.1,
            showLine: true,
            pointRadius: 0,
          },
          {
            label: 'Entered value',
            data: [{ x: inputValue, y: computedY }],
            borderColor: 'red',
            backgroundColor: 'red',
            pointRadius: 5,
            showLine: false,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            title: {
              display: true,
              text: "Value"
            }
          },
          y: {
            title: {
              display: true,
              text: "Result (" + (unit === "degrees" ? "°" : "Rad") + ")"
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                return "(" + context.parsed.x.toFixed(2) + ", " + context.parsed.y.toFixed(2) + ")";
              }
            }
          }
        }
      }
    });
  });
});
