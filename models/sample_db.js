const mongoose = require("mongoose");

const sampleDB = [
	{
		// "_id": mongoose.Types.ObjectId("5c1f639e8bd4400cdec73308"),
		"_id": "5c1f639e8bd4400cdec73308",
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
];

const sampleSubmissions = [
	{
		// "_id": mongoose.Types.ObjectId("5c1f800z8bd4400cdec73308"),
		"_id": "5c1f800z8bd4400cdec73308",
		"email" : "mary2@gmail.com",
		submisson: {
			q1: "Lorem upsum sit amter",
			q2: "Adssa sdas 33asds"
		}
	}
]

module.exports = {
	sampleDB,
	sampleSubmissions
};