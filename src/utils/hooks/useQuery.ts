import qs from 'qs';
import { useEffect, useState } from 'react';

export const useQuery = <T>() => {
	const [query, setQuery] = useState<T>();
	useEffect(() => {
		if (window.location.search) {
			setQuery(qs.parse(window.location.search.slice(1)) as T);
		} else {
			setQuery({} as T);
		}
	}, []);
	return query;
};
