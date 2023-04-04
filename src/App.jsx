import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Weather from "./components/Weather";
import Loader from "./components/Loader";

function App() {
  /* estado que guarda las coordenadas */
  const [coords, setCoords] = useState();

  /* estado que guarda toda la informacion de la respuesta de la api */
  const [weather, setWeather] = useState();

  /* estado que almacena los valores en celsius y kelvin */
  const [temp, setTemp] = useState();

  /* funcion que se ejecuta al momento de recibir confirmacion del usuario de acceder a su ubicacion, en pos llega la informacion */
  const success = (pos) => {
    const crd = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude,
    };
    setCoords(crd);
  };

  /* Efecto que solicita la informacion de la ubicacion, que recibe como callback la funcion que captura las coordenadas */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, []);
  /* conexion con la API */
  useEffect(() => {
    /* verificamos si ya estan listas las coordenadas para ahi si guardar la EndPoint */
    if (coords) {
      const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=7370961fe6d19a20e2adc8579369fa3e`;

      /* hacemos la conexion con la API */
      axios
        .get(URL)
        .then((res) => {
          setWeather(res.data);
          const tempCelsius = (res.data.main.temp - 273.15).toFixed(1);
          const temFahrenheit = (tempCelsius * (9 / 5) + 32).toFixed(1);
          const newTemps = {
            celsius: tempCelsius,
            fahrenheit: temFahrenheit,
          };
          setTemp(newTemps);
        })
        .catch((err) => console.log(err));
    }
  }, [coords]);

  return (
    <div className="App grid place-content-center min-h-screen bg-[url('/images/bg1.jpg')] bg-cover px-2">
      {/* verificamos que weather tenga informacion, mientas llega, se carga el loader */}
      {weather ? <Weather weather={weather} temp={temp} /> : <Loader />}
    </div>
  );
}

export default App;
