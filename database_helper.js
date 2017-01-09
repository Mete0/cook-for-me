'use strict';
module.change_code = 1;

var State_helper = require('./state_helper');
var DATA_TABLE_NAME = 'recipesData';

//var localUrl = 'http://localhost:8000';
//var localCredentials = {
//    region: 'us-east-1',
//    accessKeyId: 'fake',
//    secretAccessKey: 'fake'
//};
//var localDynasty = require('dynasty')(localCredentials, localUrl);
//var dynasty = localDynasty;
var dynasty = require('dynasty')({});
function DatabaseHelper() {
}
var recipeTable = function () {
    return dynasty.table(DATA_TABLE_NAME);
};

DatabaseHelper.prototype.createRecipeTable = function () {
    return dynasty.describe(DATA_TABLE_NAME)
        .catch(function (error) {
            console.log('createRecipeTable::error: ', error);
            console.log('creating table');
            return dynasty.create(DATA_TABLE_NAME, {
                key_schema: {
                    hash: ['userId', 'string']
                }
            });
        });
};

DatabaseHelper.prototype.storeRecipeData = function (userId, recipeData) {
    console.log('writing recipeData to database for user ' + userId);
    return recipeTable().insert({
        userId: userId,
        data: JSON.stringify(recipeData)
    }).catch(function (error) {
        console.log(error);
    });
};

DatabaseHelper.prototype.readRecipeData = function (userId) {
    console.log('reading recipeData with user id of : ' + userId);
    return recipeTable().find(userId).then(function (result) {
        console.log(result);
        var data = (result === undefined ? {} : JSON.parse(result['data']));
        return new State_helper(data);
    }).catch(function (error) {
        console.log(error);
    });
};

module.exports = DatabaseHelper;