import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../../api";
import "./Search.css";
import SearchData from "../../types/SearchData.type";
import City from "../../types/City.type";

interface Data {
	data: City[];
}

interface Search {
	onSearchChange: (value: SearchData) => void;
	userLocation: number[];
}

const Search: React.FC<Search> = ({ onSearchChange, userLocation }) => {
	const [searchValue, setSearchValue] = useState<string | SearchData>("");

	const handleOnChange = (inputValue: unknown) => {
		setSearchValue(inputValue as SearchData);
		onSearchChange(inputValue as SearchData);
	};
	const LoadOptions = async (search: string): Promise<{ options: SearchData[] }> => {
		const joinedUserLocation = userLocation.join("");
		const fetchUrl =
			search !== "" || (userLocation[0] === 0 && userLocation[0] === 0)
				? `${GEO_API_URL}/cities?namePrefix=${search === "" ? "london" : search
				}&limit=10&minPopulation=100000&sort=-population`
				: `${GEO_API_URL}/locations/${joinedUserLocation}/nearbyCities?radius=100`;

		try {
			const response = await fetch(fetchUrl, geoApiOptions);
			const responseData = await response.json() as Data;

			const options: SearchData[] = responseData.data.map((city: City) => ({
				value: `${city.latitude} ${city.longitude}`,
				label: `${city.name}, ${city.countryCode}`,
			}));

			return { options };
		} catch (err) {
			console.error(err);
			return { options: [] };
		}
	};

	return (
		<AsyncPaginate
			className="asyncPag"
			placeholder="Search for city..."
			value={searchValue}
			onChange={handleOnChange}
			debounceTimeout={600}
			loadOptions={LoadOptions}
		/>
	);
};

export default Search;
