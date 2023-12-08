import { useCallback, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "../../api";
import "./Search.css";
import SearchData from "../../types/SearchData.type";
import City from "../../types/City.type";
import { useSelector } from "react-redux";
import { selectCoord } from "../../store/slices/weatherSlice";

interface OptionsData {
	data: City[];
}

interface SearchProps {
	onSearch: (value: SearchData) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
	const userLocation = useSelector(selectCoord)
	const [searchValue, setSearchValue] = useState<string | SearchData>("");


	const handleOnChange = (inputValue: unknown) => {
		setSearchValue(inputValue as SearchData);
		onSearch(inputValue as SearchData);
	};
	const LoadOptions = useCallback(async (search: SearchData | string): Promise<{ options: SearchData[] }> => {
		const joinedUserLocation = userLocation ? Object.values(userLocation).reverse().join("") : [35.56666667, -5.36666667].join("");

		let fetchUrl;
		if (typeof search === "string") {
			if (search !== "") {
				fetchUrl = `${GEO_API_URL}/cities?namePrefix=${search}&limit=10&minPopulation=100000&sort=-population`;
			} else {
				fetchUrl = `${GEO_API_URL}/locations/${joinedUserLocation}/nearbyCities?radius=100`;
			}
		} else {
			const { value } = search;
			fetchUrl = `${GEO_API_URL}/locations/${value.replace(/\s/g, "")}/nearbyCities?radius=100`;
		}
		try {
			const response = await fetch(fetchUrl, geoApiOptions);
			const responseData = await response.json() as OptionsData;

			const options: SearchData[] = responseData.data.map((city: City) => ({
				value: `${city.latitude} ${city.longitude}`,
				label: `${city.name}, ${city.countryCode}`,
			}));

			return { options };
		} catch (err) {
			console.error(err);
			return { options: [] };
		}
	}, [userLocation]);

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
