/*global expect, beforeEach*/
/*eslint-env node */

"use strict";
var request = require("supertest"),
    app = require("../app"),
    setup = require("./setup");

var isInit = false;
/**
 * Override the finishCallback so we can add some cleanup methods.
 * This is run after all tests have been completed.
 */
var _finishCallback = jasmine.Runner.prototype.finishCallback;
jasmine.Runner.prototype.finishCallback = function () {
    // Run the old finishCallback
    _finishCallback.bind(this)();

    setup.teardown();
    // add your cleanup code here...
};

beforeEach(function (done) {
    if (isInit) { return done(); }
    //clean the database before playing the tests
    setup.init(done);
    isInit = true;
});


describe("API", function () {
    var userToken,
        user = {
            login: "felix@felix.fr",
            password: "felix"
        },
        timeline;

    it("should create a new user", function (done) {
        request(app)
            .post("/user/create")
            .send(user)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                var u = res.body.user;
                expect(u.id).toBeDefined();
                expect(u.password).not.toBeDefined();
                expect(u.created).toBeDefined();
                expect(u.login).toBe(user.login);
                userToken = res.body.token;
                done();
            });
    });

    it("should return logged user", function (done) {
        request(app)
            .get("/u")
            .set("Authorization", "Bearer " + userToken)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                var u = res.body;
                expect(u.id).toBeDefined();
                expect(u.password).not.toBeDefined();
                expect(u.created).toBeDefined();
                expect(u.login).toBe(user.login);
                done();
            });
    });

    it("should create a new timeline for user", function (done) {
        request(app)
            .post("/u/timelines")
            .set("Authorization", "Bearer " + userToken)
            .send({
                title: "new timeline"
            })
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                timeline = res.body;
                expect(timeline.id).toBeDefined();
                expect(timeline.title).toBe("new timeline");
                done();
            });
    });

    it("should return all user's timelines", function (done) {
        request(app)
            .get("/u/timelines")
            .set("Authorization", "Bearer " + userToken)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                expect(res.body.length).toBe(1);
                expect(res.body[0]).toEqual(timeline);

                done();
            });
    });

    it("should return timeline with id", function (done) {
        request(app)
            .get("/u/timelines/" + timeline.id)
            .set("Authorization", "Bearer " + userToken)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                var tl = res.body;
                expect(tl).toEqual(timeline);

                done();
            });
    });

    return;

});
