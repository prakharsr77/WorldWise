import Spinner from "./Spinner";
import Message from "./Message";
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import { useCities } from "../contexts/CitiesContext";

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map 🗺️" />
    );

  const countries = [
    ...new Set(
      cities.map((city) =>
        JSON.stringify({
          country: city.country,
          emoji: city.emoji,
        })
      )
    ),
  ];

  return (
    <ul className={styles.countryList}>
      {countries.map((countryString) => {
        const country = JSON.parse(countryString);
        return <CountryItem country={country} key={country.country} />;
      })}
    </ul>
  );
}

export default CountryList;
