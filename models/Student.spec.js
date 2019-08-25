const request = require('supertest');
const mongoose = require('mongoose');
const { sampleDB } = require('./sample_db');
const server = require('../server');
const StudentModel = require('./Student');
let sendMail = require('../mailjet');
jest.mock('../mailjet', () => jest.fn());

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
        });
        afterEach( async ()=>{
            await StudentModel.deleteMany({})
            .then(x=>x).catch(err=>console.log(err))
        });
        it('should create a new entry', async () => {
            const response = await app.post('/register').send(
                {
                    "email" : "jane@gmail.com",
                    "password" : "1111",
                    "firstName" : "Jane",
                    "lastName" : "Jo",
                    "dob" : "030303",
                    "gender" : "female",
                    "marriageStatus" : "single",
                    "occupation" : "student",
                    "residence" : "Villa",
                    "country": "Nigeria",
                    "city" : "Abuja",
                    "homeAddress" : "101, Somewhere St.",
                    "postCode" : "231004",
                }
            ); 
            expect(response.status).toEqual(200);
        });

        it('should send an email if creation is successful', async ()=> {

            const response = await app.post('/register').send(
                {
                    "email" : "jane@gmail.com",
                    "password" : "1111",
                    "firstName" : "Jane",
                    "lastName" : "Jo",
                    "dob" : "030303",
                    "gender" : "female",
                    "marriageStatus" : "single",
                    "occupation" : "student",
                    "residence" : "Villa",
                    "country": "Nigeria",
                    "city" : "Abuja",
                    "homeAddress" : "101, Somewhere St.",
                    "postCode" : "231004",
                }
            ); 

            expect(response.status).toEqual(200);
            expect(sendMail).toHaveBeenCalledWith(
                'register', 
                'jane@gmail.com', 
                'Jane Jo', 
                expect.any(Object)
            );
        });

        it('should NOT create a new entry if the email exists', async () => {
            const response = await app.post('/register').send(
                {
                    "email" : "mary2@gmail.com",
                    "password" : "1111",
                    "firstName" : "Mary",
                    "lastName" : "Jo",
                    "dob" : "030303",
                    "gender" : "female",
                    "marriageStatus" : "single",
                    "occupation" : "student",
                    "residence" : "Villa",
                    "country": "Nigeria",
                    "city" : "Abuja",
                    "homeAddress" : "101, Somewhere St.",
                    "postCode" : "231004",
                }
            ).then(x=>x)
            .catch(err => console.log('err', err))

            expect(response.status).toEqual(400);
        });

        
        it('should respond with 4xx if submission is not correct', async ()=> {
            const response = await app.post('/register').send(
                {
                    "email" : null,
                    "password" : "1111",
                    "firstName" : "Mary",
                    "lastName" : "Jo",
                    "dob" : "030303",
                    "gender" : "female",
                    "marriageStatus" : "single",
                    "occupation" : "student",
                    "residence" : "Villa",
                    "country": "Nigeria",
                    "city" : "Abuja",
                    "homeAddress" : "101, Somewhere St.",
                    "postCode" : "231004",
                }
            ).then(x=>x)
            .catch(err => err)//console.log('err', err))

            expect(response.status).toEqual(400);
        });
    });  

    describe('POST /login', ()=> {
        beforeEach( async ()=>{
            await StudentModel.insertMany(mockEntries, { ordered: false });          
            insertedItems = await StudentModel.find();    
        });

        afterEach( async ()=>{
            await StudentModel.deleteMany({})
            .then(x=>x).catch(err=>console.log(err))
        });
        

        it('should respond with an access token if credentials are correct AND is verified', async ()=>{
            
            await StudentModel.updateOne(
                { email: 'mary2@gmail.com' }, 
                { $set: {emailVerified: true} }
            )

            const response = await app.post('/login').send({
                "email" : "mary2@gmail.com",
                "password" : "1111",
            }).then(x=>x)
            .catch(err => console.log('err', err));

            expect(response.body.token).toBeTruthy();
            expect(response.body.firstName).toBeTruthy();
            expect(response.body.lastName).toBeTruthy();
            expect(response.status).toEqual(200);
        });

        it('should refuse to login user if email not verified', async ()=> {
            const response = await app.post('/login').send({
                "email" : "mary2@gmail.com",
                "password" : "1111",
            }).then(x=>x)
            .catch(err => console.log('err', err));

            expect(response.body.token).not.toBeTruthy();
            expect(response.body.msg).toEqual('Please verify your email')
            expect(response.status).toEqual(400);
        });

        it('should respond with 4xx if credentials are incorrect', async ()=>{
            const response = await app.post('/login').send({
                "email" : "@gmail.com",
                "password" : "1111",
            }).then(x=>x)
            .catch(err => console.log('err', err));

            //expect(response.body.msg).toBeTruthy();
            expect(response.status).toEqual(400);
        });
    });

    describe('/verify', ()=> {
        beforeEach( async ()=>{
            await StudentModel.insertMany(mockEntries, { ordered: false });          
            insertedItems = await StudentModel.find();    
        });

        afterEach( async ()=>{
            await StudentModel.deleteMany({})
            .then(x=>x).catch(err=>console.log(err))
        });
        
        it('should set emailVerified to true if id is correct', async ()=>{
            const response = await app.get('/verify/5c1f639e8bd4400cdec73308')
            .then(data=>data)
            .catch(err => console.log('err', err));

            // console.log('response is', response);
            expect(response.headers.location).toEqual(`${process.env.WEB_APP}/sign-in?verified=true`);
            expect(response.status).toEqual(302);
        });

        it('should return 4xx if id is NOT correct', async ()=>{
            const response = await app.get('/verify/wrngid')
            .then(data=>data)
            .catch(err => console.log('err', err));

            // expect(response.body.student.name).toEqual('CastError');
            expect(response.headers.location).toEqual(`${process.env.WEB_APP}/sign-in?verified=false`)
            expect(response.status).toEqual(302);
        });
    });
});
