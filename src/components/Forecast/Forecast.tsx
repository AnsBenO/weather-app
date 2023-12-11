import {
    Accordion,
    AccordionItem,
    AccordionItemButton,
    AccordionItemHeading,
    AccordionItemPanel,
} from "react-accessible-accordion";
import "./Forecast.css";
import { useSelector } from "react-redux";
import { selectForecast } from "../../store/slices/weatherSlice";

const Forecast: React.FC = () => {
    const data = useSelector(selectForecast);
    function formatDate(dateString: string) {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        const dateObj = new Date(dateString);
        const day = dateObj.toLocaleString("en-us", { weekday: "short" });
        const month = months[dateObj.getMonth()];
        const dayOfMonth = dateObj.getDate();
        const year = dateObj.getFullYear();
        const time = `${dateObj.getHours()}:${dateObj
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

        return `${day}, ${month} ${dayOfMonth}, ${year} ${time}`;
    }

    return (
        <>
            {data && (
                <div className="forecast-div">
                    <label className="title">Extented Forecast</label>
                    <Accordion>
                        {data.list.map((item, index) => (
                            <AccordionItem
                                key={index}
                                className="accordion-item"
                            >
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        <div className="hourly-item">
                                            <img
                                                src={`/weather-app/icons/${item.weather[0].icon}.png`}
                                                alt="weather"
                                                className="icon-small"
                                                draggable="false"
                                            />
                                            <label className="time">
                                                {formatDate(item.dt_txt)}
                                            </label>
                                            <label className="description">
                                                {item.weather[0].description}
                                            </label>
                                            <label className="temperature">{`${Math.round(
                                                item.main.temp - 273.15
                                            )}°C`}</label>
                                        </div>
                                    </AccordionItemButton>
                                </AccordionItemHeading>

                                <AccordionItemPanel>
                                    <div className="hourly-detail-grid">
                                        <div className="hourly-detail-grid-item">
                                            <label>Pressure</label>
                                            <label>
                                                {item.main.pressure} hPa
                                            </label>
                                        </div>
                                        <div className="hourly-detail-grid-item">
                                            <label>Humidity</label>
                                            <label>
                                                {item.main.humidity} %
                                            </label>
                                        </div>
                                        <div className="hourly-detail-grid-item">
                                            <label>Clouds</label>
                                            <label>{item.clouds.all} %</label>
                                        </div>
                                        <div className="hourly-detail-grid-item">
                                            <label>Wind speed</label>
                                            <label>{item.wind.speed} m/s</label>
                                        </div>
                                        <div className="hourly-detail-grid-item">
                                            <label>Visibility</label>
                                            <label>
                                                {(
                                                    item.visibility / 1000
                                                ).toFixed(2)}{" "}
                                                km
                                            </label>
                                        </div>
                                        <div className="hourly-detail-grid-item">
                                            <label>Feels like</label>
                                            <label>
                                                {Math.round(
                                                    item.main.feels_like -
                                                    273.15
                                                )}
                                                °C
                                            </label>
                                        </div>
                                    </div>
                                </AccordionItemPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            )}
        </>
    );
};

export default Forecast;
