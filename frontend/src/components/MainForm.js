import React, { useState, useEffect } from 'react';
import SearchResults from './SearchResults';

function MainForm() {

    const [stationId, setStationId] = useState();
    const [itemId, setItemId] = useState();
    const [searchResults, setSearchResults] = useState();
    const [allStations, setAllStations] = useState();
    const [allItems, setAllItems] = useState();
    const [month, setMonth] = useState('');


    useEffect(() => {
        fetch(
            `http://localhost:3001/getAllStations`
        ).then(res => res.json()).then(data => setAllStations(data) );

        fetch(
            `http://localhost:3001/getAllItems`
        ).then(res => res.json()).then(data => 
            {
                console.log(data);
                setAllItems(data); 
            });
        
    }, []);


    const getStation = async () => {
        const response = await fetch(
            `http://localhost:3001/getStationMeasurements/${stationId}/${month}`
        );
        return await response.json();
    };

    const submitSearchForm = async event => {
        event.preventDefault();

        return await getStation()
            .then(data => setSearchResults(data) )
            .catch(error => console.error(error));
    }

    return (
        <div className="results-page"> 
            <h2 className="main-form-title">Insert filters</h2>
            <form onSubmit={submitSearchForm} className="search-form" >

                <div className="form-group">
                    <label htmlFor="station-input">Research Station</label>
                    <select
                        className="form-input" id="station-input" type="text"
                        name={stationId}
                        onChange={event => { setStationId(event.target.value)} }>
                        <option value="000">Select Station</option>
                        {allStations &&
                            allStations.map(station =>
                                <option key={station.StationCode} value={station.StationCode}>{station.StationDistrict} ({station.StationCode})</option>)
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="item-input">Compound</label>
                    <select
                        className="form-input" id="item-input" type="text"
                        name={itemId}
                        onChange={event => { 
                            setItemId(event.target.value);
                            console.log(event.target.value);
                        }}>
                        <option value="000">Select Item</option>
                        {allItems &&
                            allItems.map(item => {
                                return (<option key={item.ItemCode} value={item.ItemName}>{item.ItemName}</option>);
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="date-input">Month</label>
                    <input type="month" id="date-input" className="form-input"
                        min="2017-01" max="2018-12" 
                        value={month} 
                        onChange={event => { 
                            setMonth(event.target.value);
                            console.log(event.target.value);
                        }}/>
                </div>
                <button className="submit-button" type="submit">Submit</button>
            </form>

            {(searchResults && itemId) && 
                <SearchResults results={searchResults} compound={itemId} />}
        </div>

    );

}

export default MainForm;
