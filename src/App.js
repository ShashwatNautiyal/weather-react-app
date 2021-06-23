import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import cityName from './world-cities.json';

function App() {
	const [input, setInput] = useState('');
	const [info, setInfo] = useState([]);
	const [cities, setCities] = useState([]);

	const citiesName = cityName.map((city) => city.name);

	const fetchWeather = () => {
		const apiKey = '777fada3af8749ba8a3200421212206';

		fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${input}&aqi=yes`)
			.then((Response) => Response.json())
			.then((data) =>
				setInfo({
					name: data.location.name,
					icon: data.current.condition.icon,
					temp: data.current.temp_c,
					wind: data.current.wind_kph,
					condition: data.current.condition.text,
					humidity: data.current.humidity,
					visibility: data.current.vis_km,
					aqi: data.current.air_quality.so2,
				})
			)
			.catch((err) => console.error(err));
	};

	const suggBox = (e) => {
		let i = 0;
		setCities(
			citiesName.filter((city) => {
				if (city.toLowerCase().includes(e.toLowerCase()) && i < 6) {
					i += 1;
					return true;
				}
				return false;
			})
		);
	};

	const selectCity = (e) => {
		setInput(e.target.innerText);
		setCities([]);
	};

	const searchCity = (e) => {
		if (e.key === 'Enter') {
			fetchWeather(cities[0]);
			setCities([]);
			bgChanger(e.target.parentElement.parentElement.parentElement);
		}
	};

	const bgChanger = (e) => {
		const randomColorRight = Math.floor(Math.random() * 16777215).toString(16);
		const randomColorLeft = Math.floor(Math.random() * 16777215).toString(16);
		e.style.background = `linear-gradient(to right, #${randomColorLeft}, #${randomColorRight})`;
		e.style.background = `-webkit-linear-gradient(to right, #${randomColorLeft}, #${randomColorRight})`;
	};

	return (
		<div className="app">
			<div className="weather-card">
				<div className="input-box">
					<input
						onKeyUp={searchCity}
						className={
							cities.length === 0 || cities.length === citiesName.length || !input
								? 'input'
								: 'input active'
						}
						value={input}
						onChange={(e) => {
							setInput(e.target.value);
							suggBox(e.target.value);
						}}
						type="text"
						placeholder="City"
					/>
					<div className="search-btn" onClick={fetchWeather}>
						<FontAwesomeIcon icon={faSearch} />
					</div>
				</div>

				<div className="searchSugg" style={{ display: input ? 'block' : 'none' }}>
					<ul>
						{cities.map((res, index) => (
							<li key={index} onClick={selectCity}>
								{res}
							</li>
						))}
					</ul>
				</div>

				<div className="weather-info">
					<div className="left-info">
						<p>Weather in {info.name}</p>
						<div className="temperature-info">
							<img className="icon" src={info.icon} alt="" />
							<h2>{info.temp}°C</h2>
						</div>
						<p>{info.condition}</p>
					</div>
					<div className="right-info">
						<div>
							<p>Air Quality:</p>
							<span>
								{Math.floor(info.aqi)} <sup>so2</sup>
							</span>
						</div>
						<div>
							<p>Humidity: </p>
							<span>{info.humidity}%</span>
						</div>
						<div>
							<p>Visibilty: </p>
							<span>{info.visibility} km</span>
						</div>
						<div>
							<p>Wind: </p>
							<span>{info.wind} km/h</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
