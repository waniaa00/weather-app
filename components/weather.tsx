"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";
//useState is used to manage data
//ChangeEvent and FormEvent is used to manage and handle event.

interface WeatherData {
  temperature: number;
  description: string;
  location: string;
  unit: string;
}

export default function Weather() {
  const [location, setLocation] = useState<string>(" "); //when location will be added setlocation will update it
  const [weather, setWeather] = useState<WeatherData | null>(null); //when weather will be added setweather will update it
  const [error, setError] = useState<string | null>(null); // when any data will be incorrect it seterror will show error message
  const [isLoading, setIsLoading] = useState<boolean>(false); // when page will load setloading will update it

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    //async for loading in parallel
    e.preventDefault(); //preventdefault is used for staying on same page and updating without refreshing

    const trimmedLocation = location.trim(); //trim is a built-in js function which trims extra spaces around string
    if (trimmedLocation === "") {
      setError("Please enter a valid location.");
      setWeather(null);
      return;
    }
    setIsLoading(true); //when taking data loading will be true
    setError(null); //0 error

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      ); //fetch is used to retrive data from js and API
      if (!response.ok) {
        throw new Error("City not found");
      }
      const data = await response.json();
      const weatherData: WeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData); //fetched data will be shown to UI
    } catch (error) {
      setError("City not found. Please try again."); // if error occurs then...
      setWeather(null); //new information will execute now,previous will be removed
    } finally {
      setIsLoading(false); // loading will not appear whether result is +ve 0r -ve (condition which runs in both ways)
    }
  };
  function getTemperatureMessage(temperature: number, unit: string): string {
    if (unit == "C") {
      if (temperature < 0) {
        return `It's freezing at ${temperature}°C. Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°. Comfortable for a light jacket`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather.`;
      } else {
        return `It's hot at ${temperature}. Stay hyderated!`;
      }
    } else {
      return `${temperature}° ${unit}`; //placeholder for other temperature unit(e.g fahrenheit)
    }
  }

  function getweatherMessage(description: string): string {
    switch (description.toLocaleLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunder storm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be carefu, there's fog outside.";
      default:
        return description; // default to returning the description as it
    }
  }

  function getLocationMessage(location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    return `${location} ${isNight ? "at Night" : "During the day"}`;
  }

  return(
    <div className="flex justify-center items-center h-screen bg-blue-200">
        <Card className="w-full max-w-md mx-auto text-center text-blue-600 bg-blue-100">
            <CardHeader>
                <CardTitle>Weather widget</CardTitle>
                <CardDescription>Search for the current weather conditions in your city.</CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                type="text"
                placeholder="Enter a city name."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                />
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Search"}
                </Button>

            </form>
            {error && <div className="t-4 text-red-500">{error}</div>}
            {weather && (
                <div className="mt-4 grid gap-2">
                    <div className="flex items-center gap-2">
                        <ThermometerIcon className="w-6 h-6" />
                        {getTemperatureMessage(weather.temperature, weather.unit)}
                    </div>

                    <div className="flex items-center gap-2">
                        <CloudIcon className="w-6 h-6" />
                        {getweatherMessage(weather.description)}
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPinIcon className="w-6 h-6" />
                        {getLocationMessage(weather.location)}
                    </div>


                </div>
            )}
            </CardContent>
        </Card>
    </div>
  )
}
