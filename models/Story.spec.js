const request = require('supertest');
const mongoose = require('mongoose');
const sampleDB = require('./sample_db');
const server = require('../server');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

describe('server', ()=>{
    let app;

    beforeAll( async () => {
        app = request( await server() );
    });

    describe('POST /story-of-day', () => {
        it('should get the story of the day', async () => {

            var mock = new MockAdapter(axios);
            const data = { 
                "week_number":34,
                "utc_offset":"+01:00",
                "utc_datetime":"2019-08-31T14:14:30.13988+00:00",
                "unixtime":1566310470,
                "timezone":"Africa/Lagos",
                "raw_offset":3600,
                "dst_until":null,
                "dst_offset":0,
                "dst_from":null,
                "dst":false,
                "day_of_year":232,
                "day_of_week":6,
                "datetime":"2019-08-30T15:14:30.139880+01:00",
                "client_ip":"92.97.90.58",
                "abbreviation":"WAT"
            };
            mock.onGet('http://worldtimeapi.org/api/timezone/Africa/Lagos.json').reply(200, data);

            const res = await app.post('/story-of-day').send(); 
            expect(res.status).toEqual(200);
            expect(res.body.calendar).toEqual([26,27,28,29,30,31,1])
            expect(res.body.currentDay).toEqual(2)
        });
    });  
});
