/*global expect, beforeEach*/
/*eslint-env node */

"use strict";
var frisby = require("frisby"),
    setup = require("./setup");

var isInit = false;

beforeEach(function (done) {
    if (isInit) { return done(); }
    //clean the database before playing the tests
    setup.init(done);
    isInit = true;
});

frisby.globalSetup({
    request: {
        json: true,
        baseUri: "http://localhost:1337"
    }
});


//all tests on the timeline model
function timelineTests(timeline, userToken) {
    //retreive the newly created timeline
    frisby
        .create("get timeline with id")
        .get("/u/timelines/" + timeline.id, {
            json: false,
            headers: {
                "Authorization": "Bearer " + userToken
            }
        })
        .expectStatus(200)
        .expectJSON({
            id: timeline.id,
            title: timeline.title,
            events: []
        })
        .toss();

    frisby
        .create("get user's timeline")
        .get("/u/timelines", {
            json: false,
            headers: {
                "Authorization": "Bearer " + userToken
            }
        })
        .afterJSON(function (response) {
            expect(response.length).toBe(1);
        })
        .toss();

}

//all tests on the user model
function userTests(response) {
    //keep the token for future requests
    var userToken = response.token;

    //retreive freshly created user
    frisby
        .create("get user from token")
        .get("/u", {
            json: false,
            headers: {
                "Authorization": "Bearer " + userToken
            }
        })
        .expectStatus(200)
        .expectJSON({
            login: "felix@felix.fr",
            password: undefined
        })
        .toss();


    //create a new timeline
    frisby
        .create("create new timeline")
        .post("/u/timelines", {
            title: "new timeline"
        }, {
            headers: {
                "Authorization": "Bearer " + userToken
            }
        })
        .expectJSON({
            id: function (val) { expect(val).toBeDefined(); },
            title: "new timeline",
            events: []
        })
        .afterJSON(function (timeline) {
            timelineTests(timeline, userToken);
        })
        .toss();
}

frisby
    .create("user create")
    .post("/user/create", {
        login: "felix@felix.fr",
        password: "felix"
    })
    .expectStatus(200)
    .expectJSON({
        user: {
            id: function (val) { expect(val).toBeDefined(); },
            created: function (val) { expect(val).toBeDefined(); },
            login: "felix@felix.fr",
            password: undefined
        },
        token: function (val) { expect(val).toBeDefined(); }
    })
    .afterJSON(userTests)
    .toss();
