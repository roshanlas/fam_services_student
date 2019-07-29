const request = require('supertest');
const mongoose = require('mongoose');
const sampleDB = require('./sample_db');
const server = require('../server');
const StudentModel = require('./Student');

jest.setTimeout(30000);

describe('server', ()=>{
    let app;
    let serverInstance;
    let mockEntries;
    let insertedItems;

    beforeAll( async () => {
        // await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true });
        // await mongoose.connection.once('open', function () {
        //     console.log("Test DB is connected");
        // });
        mockEntries = sampleDB;
        app = request( await server() );
    });

    afterAll(async () => {
        mongoose.connection.close();
    });

    describe('POST /register', () => {
        beforeEach( async ()=>{
            await StudentModel.insertMany(mockEntries, { ordered: false });          
            insertedItems = await StudentModel.find();  
            console.log('itemes are', insertedItems);      
        });
        afterEach( ()=>{
            StudentModel.deleteMany({}).exec()
            .then(x=>x).catch(err=>console.log(err))
        });
        it('should create a new entry', async () => {
            const response = await app.post('/register').send(
                {
                   student: {
                   name: 'Mary Jane', email: 'mary2@gmail.com', password: 'asd23123' 
                    }
                }
            ); 
            expect(response.status).toEqual(200);
        });

        it('should NOT create a new entry if the email exists', async () => {
            const response = await app.post('/register').send(
                {
                    student: {
                   name: 'Mary Jane', email: 'jane@gmail.com', password: 'asd23123' 
                    }
                }
            ).then(x=>x)
            .catch(err => console.log('err', err))

            console.log(response.body);
            expect(response.status).toEqual(400);
        });
    });  
});
