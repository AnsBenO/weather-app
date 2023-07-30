import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../../api";
import "./Search.css";

interface Data {
	data: City[];
}

interface City {
	id: number;
	wikiDataId: string;
	type: string;
	city: string;
	name: string;
	country: string;
	countryCode: string;
	region: string;
	regionCode: string;
	regionWdId: string;
	latitude: number;
	longitude: number;
	population: number;
}

interface Search {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onSearchChange: (value: any) => void;
	userLocation: number[];
}

const Search: React.FC<Search> = ({ onSearchChange, userLocation }) => {
	const [searchValue, setSearchValue] = useState<string | unknown>("");

	const handleOnChange = (inputValue: unknown) => {
		setSearchValue(inputValue);
		onSearchChange(inputValue);
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const LoadOptions: any = async (search: string) => {
		const joinedUserLocation = userLocation.join("");
		const fetchUrl =
			search !== "" || (userLocation[0] === 0 && userLocation[0] === 0)
				? `${GEO_API_URL}/cities?namePrefix=${search === "" ? "london" : search
				}&limit=10&minPopulation=100000&sort=-population`
				: `${GEO_API_URL}/locations/${joinedUserLocation}/nearbyCities?radius=100`;

		return fetch(fetchUrl, geoApiOptions)
			.then(response => response.json())
			.then((response: Data) => {
				return {
					options: response.data.map((city: City) => {
						return {
							value: `${city.latitude} ${city.longitude}`,
							label: `${city.name}, ${city.countryCode}`,
						};
					}),
				};
			}).catch(err => console.error(err));
	};
	return (
		<AsyncPaginate
			className="asyncPag"
			placeholder="Search for city..."
			value={searchValue}
			onChange={handleOnChange}
			debounceTimeout={600}
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			loadOptions={LoadOptions}
		/>
	);
};

export default Search;
