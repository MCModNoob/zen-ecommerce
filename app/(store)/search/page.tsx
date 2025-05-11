import React from 'react'

async function SearchPage({
    searchParams,
}: {
    searchParams: {
        query: string;
    };
}) {

    const { query } = await searchParams;

    return <div>Search result for { query } </div>
    
}

export default SearchPage