import React from 'react';
import Location from './location.js'

function calculateSeason() {
    const nowDate = new Date()
    const month = nowDate.getMonth()
    console.log(month)
    if (3 <= month && month <= 5) {
        return 'spring';
    }

    if (6 <= month && month <= 8) {
        return 'summer';
    }

    if (9 <= month && month <= 11) {
        return 'fall';
    }

    return 'winter';
}

function App() {
    return (
        <div className={'wrapper ' + calculateSeason()}>
            <main>
                 <Location/>
            </main>
        </div>
    )
}

export default App;
