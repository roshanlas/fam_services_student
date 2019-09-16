const request = require('supertest');
const mongoose = require('mongoose');
const { sampleSubmissions } = require('./sample_db');
const server = require('../server');
const passport = require('passport');
const SubmissionModel = require('./Submission');

jest.setTimeout(30000);

describe('server', ()=>{
    let app;
    let mockEntries;

    beforeAll( async () => {
        passport.authenticate = jest.fn(
            (authType, options, callback) => (req, res) => { 
                res.end('Authenticated!');
            }
        );

        mockEntries = sampleSubmissions;
        app = request( await server() );
    });

    afterAll(async () => {
        mongoose.connection.close();
    });

    describe('GET /submission/', () => {
        // beforeEach( async ()=>{
        //     await StudentModel.insertMany(mockEntries, { ordered: false });          
        //     insertedItems = await StudentModel.find();    
        // });

        // afterEach( async ()=>{
        //     await StudentModel.deleteMany({})
        //     .then(data=>data)
        //     .catch(err=>console.log(err))
        // });

        it('should retrieve student submission if credentials correct', async () => {

            const response = await app.get('/submission/retrieve')
            .then(data=>data)
            .catch(err => console.log('err', err));

            expect(response.status).toEqual(200);
        });
    });
});
