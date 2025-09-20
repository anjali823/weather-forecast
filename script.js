const btn = document.getElementById('btn');
btn.addEventListener('click', getWeather);

function setBackground(condition) {
  const map = {
    'Sunny': ['#FDB813','#FDB813'], 'Clear': ['#2980B9','#6DD5FA'],
    'Partly cloudy': ['#6dd5ed','#2193b0'], 'Cloudy': ['#bdc3c7','#2c3e50'],
    'Rain': ['#4e54c8','#8f94fb'], 'Snow': ['#83a4d4','#b6fbff'],
    'Thunder': ['#232526','#414345']
  };
  let colors = map[condition] || ['#74ebd5','#ACB6E5'];
  document.body.style.background = `linear-gradient(to bottom right, ${colors[0]}, ${colors[1]})`;
}

async function getWeather() {
  const loc = document.getElementById('locationInput').value.trim();
  if (!loc) return alert('Please enter a location');

  const key = '7b5edb5b45e446fdbd730930253107';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${encodeURIComponent(loc)}&days=5&aqi=no&alerts=no`;

  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error('Location not found');
    const data = await resp.json();

    const c = data.current.condition;
    setBackground(c.text);
    document.getElementById('today').innerHTML = `
      <h2>Today in ${data.location.name}</h2>
      <img src="https:${c.icon}" alt="${c.text}">
      <p>${c.text}</p>
      <p><strong>${data.current.temp_c}°C</strong></p>
    `;

    let fcHtml = data.forecast.forecastday.map(d => {
      const icon = `<img src="https:${d.day.condition.icon}" alt="${d.day.condition.text}">`;
      return `
      <div class="forecast-day">
        <div>${new Date(d.date).toLocaleDateString('en-US',{weekday:'short'})}</div>
        ${icon}
        <div>${d.day.avgtemp_c}°C</div>
      </div>`;
    }).join('');
    document.getElementById('forecast').innerHTML = fcHtml;

  } catch (e) {
    alert('Error: ' + e.message);
  }
}
