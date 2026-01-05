export const resetSearchParams = () => {
	const url = new URL(window.location.toString());
	url.searchParams.delete('users');
	history.pushState({}, '', url);
};

export const setSearchParam = (key: string, value: string) => {
	const url = new URL(window.location.toString());
	url.searchParams.set(key, value);
	history.pushState({}, '', url);
};

export const setSearchParamsByList = (items: string[][]) => {
	const url = new URL(window.location.toString());
	items.forEach(([key, val]) => {
		url.searchParams.set(key, val);
	});

	history.pushState({}, '', url);
};
