import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from "react-accessible-accordion";
import { ForecastData } from "../../types/ForecastType";
import "./Forecast.css"
interface ForecastProps {
    data: ForecastData;

}

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const Forecast: React.FC<ForecastProps> = ({ data }) => {
    const dayInAWeek = new Date().getDay();
    const forecasteDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length).concat(WEEK_DAYS.slice(0, dayInAWeek));

    return (
        <div className="forecast-div">
            <label className="title">Daily</label>
            <Accordion>
                {data.list.slice(0, 7).map((item, index) => (
                    <AccordionItem key={index} className="accordion-item">
                        <AccordionItemHeading>
                            <AccordionItemButton>
                                <div className="daily-item">
                                    <img src={`../icons/${item.weather[0].icon}.png`} alt="weather" className="icon-small" />
                                    <label className="day">{forecasteDays[index]}</label>
                                    <label className="description">{item.weather[0].description}</label>
                                    <label className="min-max">{`${Math.round(item.main.temp_min - 273.15)}°C / ${Math.round(item.main.temp_max - 273.15)}°C`}</label>

                                </div>
                            </AccordionItemButton>
                        </AccordionItemHeading>

                        <AccordionItemPanel>
                            <div className="daily-detail-grid">
                                <div className="daily-detail-grid-item">
                                    <label >Pressure</label>
                                    <label >{item.main.pressure}hPa</label>
                                </div>
                                <div className="daily-detail-grid-item">
                                    <label >Humidity</label>
                                    <label >{item.main.humidity}%</label>
                                </div>
                                <div className="daily-detail-grid-item">
                                    <label >Clouds</label>
                                    <label >{item.clouds.all}%</label>
                                </div>
                                <div className="daily-detail-grid-item">
                                    <label >Wind speed</label>
                                    <label >{item.wind.speed}m/s</label>
                                </div>
                                <div className="daily-detail-grid-item">
                                    <label >Sea level</label>
                                    <label >{item.main.sea_level}m</label>
                                </div>
                                <div className="daily-detail-grid-item">
                                    <label >Feels like</label>
                                    <label >{Math.round(item.main.feels_like - 273.15)}°C</label>
                                </div>
                            </div>
                        </AccordionItemPanel>

                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}

export default Forecast;