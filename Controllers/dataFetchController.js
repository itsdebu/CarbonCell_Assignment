const fetch = require('node-fetch');

// Controller function for fetching filtered data from the public API
const getFilteredData = async (req, res) => {

    try {
        // Fetch data from the public API using node-fetch
        const response = await fetch('https://api.publicapis.org/entries');
        const { entries } = await response.json();

        // Apply filtering based on category as category is the needed thing..
        const category = req.query.category.toLowerCase();

        let filteredData = entries.filter(
            api => api.Category.toLowerCase() === category
        );

        // Further user can also filter them by name and limit the number of results.

        if (req.query.name) {

            const name = req.query.name.toLowerCase();

            filterdData = filteredData.filter(
                api => api.API.toLowerCase().includes(name)
            );
        }

        // Also user can limit the number of result..
        if (req.query.limit) {
            const limit = parseInt(req.query.limit);
            filteredData = filteredData.slice(0, limit);
        }
        // Return filtered data
        return res.status(200).json({ count: filteredData.length, entries: filteredData });
    }
    catch (Error) {
        console.error('Error fetching data:', Error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getFilteredData };