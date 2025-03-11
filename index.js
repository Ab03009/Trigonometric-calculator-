
$(document).ready(function(){
  $('.function-buttons button').click(function(){
    var func = $(this).data('func');
    var inputValue = parseFloat($('#value').val());
    if(isNaN(inputValue)) {
      $('#result').html("Խնդրում ենք մուտքագրել ստույգ թվային արժեք:");
      return;
    }
    
    // Для asin и acos значение должно быть в диапазоне [-1, 1]
    if((func === "asin" || func === "acos") && (inputValue < -1 || inputValue > 1)) {
      $('#result').html("Для выбранной функции значение должно быть в диапазоне Ընտրած ֆունկցիայի համար ընտրած արԺեքը պատկանում է  [-1, 1].");
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
      resultText = "Արդյունքը: " + computedY.toFixed(4) + "°";
    } else {
      computedY = angleRadians;
      resultText = "Արդյունքը: " + computedY.toFixed(4) + " ռադ.";
    }
    
    $('#result').html(resultText);
    
    // Генерация данных для графика
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
    
    // Если график уже существует, уничтожаем его перед созданием нового
    if (window.chart) {
      window.chart.destroy();
    }
    
    var ctx = document.getElementById('chart').getContext('2d');
    window.chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: func + " функция",
            data: data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.1,
            showLine: true,
            pointRadius: 0,
          },
          {
            label: 'Введённое значение',
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
              text: "Իմաստը"
            }
          },
          y: {
            title: {
              display: true,
              text: "Արդյունքը (" + (unit === "degrees" ? "°" : "Ռադ") + ")"
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

