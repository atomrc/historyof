/*global expect, beforeEach, it*/
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
    setup.init(function () {
        done();
    });
    isInit = true;
});


describe("API", function () {
    var userToken,
        user = {
            login: "felix@felix.fr",
            password: "felix",
            firstname: "Felix",
            lastname: "Hello"
        },
        timeline,
        event;

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
                expect(u.createdAt).toBeDefined();
                expect(u.login).toBe(user.login);
                expect(u.timelines).toEqual([]);
                userToken = res.body.token;
                user = u;
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
                expect(u).toEqual(user);
                done();
            });
    });

    it("should return user's token", function (done) {
        request(app)
            .post("/login")
            .send({
                login: user.login,
                password: "felix"
            })
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                var body = res.body;
                expect(body.token).toBeDefined();
                expect(body.user).toEqual(user);
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
                expect(res.body[0].id).toEqual(timeline.id);

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

    it("should not found an non existing timeline", function (done) {
        request(app)
            .get("/u/timelines/eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee")
            .set("Authorization", "Bearer " + userToken)
            .expect(404, done);
    });

    it("should add an event in a timeline", function (done) {
        request(app)
            .post("/u/timelines/" + timeline.id + "/events")
            .set("Authorization", "Bearer " + userToken)
            .send({ title: "new event", type: "event", date: new Date() })
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                event = res.body;
                expect(event.title).toBe("new event");
                expect(event.id).toBeDefined();

                done();
            });
    });

    it("should return created event", function (done) {
        request(app)
            .get("/u/timelines/" + timeline.id + "/events/" + event.id)
            .set("Authorization", "Bearer " + userToken)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                expect(res.body).toEqual(event);

                done();
            });
    });

    it("should update newly created event", function (done) {
        request(app)
            .put("/u/timelines/" + timeline.id + "/events/" + event.id)
            .set("Authorization", "Bearer " + userToken)
            .send({ title: "new title" })
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }

                var e = res.body;
                expect(e.title).toBe("new title");
                expect(e.id).toBe(event.id);
                expect(e.timelineId).toBe(event.timelineId);
                expect(e.date).toBe(event.date);
                event = e;

                done();
            });
    });

    it("should not found an event not belonging to timeline", function (done) {
        request(app)
            .get("/u/timelines/eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee/events/" + event.id)
            .set("Authorization", "Bearer " + userToken)
            .expect(404, done);
    });

    it("should not find an inexistant event", function (done) {
        request(app)
            .get("/u/timelines/" + timeline.id + "/events/eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee")
            .set("Authorization", "Bearer " + userToken)
            .expect(404, done);
    });

    it("should update timeline", function (done) {
        request(app)
            .put("/u/timelines/" + timeline.id)
            .set("Authorization", "Bearer " + userToken)
            .send({title: "a new title"})
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                var tl = res.body;
                expect(tl.id).toBe(timeline.id);
                expect(tl.title).toBe("a new title");
                timeline = tl;

                done();
            });
    });

    it("timeline events should have the new event", function (done) {
        request(app)
            .get("/u/timelines/" + timeline.id + "/events")
            .set("Authorization", "Bearer " + userToken)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                expect(res.body.length).toBe(1);
                expect(res.body[0]).toEqual(event);

                done();
            });
    });

    it("should delete event from timeline", function (done) {
        request(app)
            .del("/u/timelines/" + timeline.id + "/events/" + event.id)
            .set("Authorization", "Bearer " + userToken)
            .expect(204, done);
    });

    it("should return empty timeline events array", function (done) {
        request(app)
            .get("/u/timelines/" + timeline.id + "/events")
            .set("Authorization", "Bearer " + userToken)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                expect(res.body.length).toBe(0);
                done();
            });
    });

    it("should delete timeline", function (done) {
        request(app)
            .del("/u/timelines/" + timeline.id)
            .set("Authorization", "Bearer " + userToken)
            .expect(204, done);
    });

    return;

    it("should return empty timelines for user", function (done) {
        request(app)
            .get("/u/timelines")
            .set("Authorization", "Bearer " + userToken)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                expect(res.body.length).toBe(0);
                done();
            });
    });
});
