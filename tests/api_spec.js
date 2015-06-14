/*global expect, beforeEach, it*/
/*eslint-env node */

"use strict";
var request = require("supertest"),
    app = require("../app"),
    setup = require("./setup"),
    Promise = require("es6-promise").Promise;

beforeEach(function (done) {
    //clean the database before playing the tests
    setup.reset(function () {
        done();
    });
});

/**
 * Override the finishCallback so we can add some cleanup methods.
 * This is run after all tests have been completed.
 */
var _finishCallback = jasmine.Runner.prototype.finishCallback;
jasmine.Runner.prototype.finishCallback = function () {
    // Run the old finishCallback
    _finishCallback.bind(this)();

    setup.disconnect();
    // add your cleanup code here...
};

var api = {
    createUser: function (user) {
        return request(app)
            .post("/user/create")
            .send(user);
    },

    getUser: function (userToken) {
        return request(app)
            .get("/u")
            .set("Authorization", "Bearer " + userToken);
    },

    login: function (login, pwd) {
        return request(app)
            .post("/login")
            .send({
                login: login,
                password: pwd
            });
    },

    createEvent: function (userToken, event) {
        return request(app)
            .post("/u/events")
            .set("Authorization", "Bearer " + userToken)
            .send(event);
    },

    getEvents: function (userToken) {
        return request(app)
            .get("/u/events")
            .set("Authorization", "Bearer " + userToken);
    },

    getEvent: function (userToken, eventId) {
        return request(app)
            .get("/u/events/" + eventId)
            .set("Authorization", "Bearer " + userToken);
    },


    updateEvent: function (userToken, eventId, newData) {
        return request(app)
            .put("/u/events/" + eventId)
            .set("Authorization", "Bearer " + userToken)
            .send(newData);
    },

    deleteEvent: function (userToken, eventId) {
        return request(app)
            .del("/u/events/" + eventId)
            .set("Authorization", "Bearer " + userToken);
    }
};

var preconditions = {
    hasUser: function (user) {
        return new Promise(function (resolve, reject) {
            api
                .createUser(user)
                .end(function (err, res) {
                    if (err) { return reject(err); }
                    resolve(res.body);
                });
        });
    },

    hasEvent: function (user, event) {
        return new Promise(function (resolve, reject) {
            this
                .hasUser(user)
                .then(function (datas) {
                    api
                        .createEvent(datas.token, event)
                        .end(function (err, res) {
                            if (err) {
                                return reject(err);
                            }

                            resolve({ token: datas.token, event: res.body });
                        });
                });
        }.bind(this));
    }
};


describe("API", function () {
    var testUser = {
            login: "felix@felix.fr",
            pseudo: "felox",
            password: "felix",
            firstname: "Felix",
            lastname: "Hello"
        },
        testEvent = { title: "new event", type: "event", date: new Date() };

    it("should create a new user", function (done) {
        api
            .createUser(testUser)
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                var u = res.body.user;
                expect(u.id).toBeDefined();
                expect(u.password).not.toBeDefined();
                expect(u.login).toBe(testUser.login);
                done();
            });
    });

    it("cannot create user with same login", function (done) {
        preconditions
            .hasUser(testUser)
            .then(function () {
                api
                    .createUser(testUser)
                    .expect(400, done);
            });
    });

    it("should return logged user", function (done) {
        preconditions
            .hasUser(testUser)
            .then(function (userData) {
                var token = userData.token,
                    loggedUser = userData.user;

                api.getUser(token)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) { return done(err); }
                        var u = res.body;
                        expect(u.id).toEqual(loggedUser.id);
                        expect(u.pseudo).toEqual(loggedUser.pseudo);
                        done();
                    });
            });
    });

    it("should return user's token", function (done) {
        preconditions
            .hasUser(testUser)
            .then(function (userData) {
                api.login(testUser.login, testUser.password)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) { return done(err); }
                        var body = res.body;
                        expect(body.token).toBeDefined();
                        expect(body.user.login).toEqual(userData.user.login);

                        done();
                    });
            });
    });

    it("should add a new event to user", function (done) {
        preconditions
            .hasUser(testUser)
            .then(function (userData) {
                var token = userData.token;

                api.createEvent(token, testEvent)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) { return done(err); }
                        var event = res.body;

                        expect(event.title).toBe(testEvent.title);
                        expect(event.id).toBeDefined();
                        done();
                    });
            });
    });

    it("should return list of user's events", function (done) {
        preconditions
            .hasEvent(testUser, testEvent)
            .then(function (datas) {
                var token = datas.token,
                    event = datas.event;

                api
                    .getEvents(token)
                    .end(function (err, res) {
                        if (err) { return done(err); }
                        expect(res.body.length).toBe(1);
                        expect(res.body[0]).toEqual(datas.event);
                        done();
                    });
            });
    });

    it("should update newly created event", function (done) {
        preconditions
            .hasEvent(testUser, testEvent)
            .then(function (datas) {
                api
                    .updateEvent(datas.token, datas.event.id, { title: "new title" })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) { return done(err); }

                        var e = res.body;
                        expect(e.title).toBe("new title");
                        expect(e.id).toBe(datas.event.id);
                        expect(e.date).toEqual(datas.event.date);

                        done();
                    });
            });
    });

    it("should not find an inexistant event", function (done) {
        preconditions
            .hasEvent(testUser, testEvent)
            .then(function (datas) {
                api
                    .getEvent(datas.token, "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee")
                    .expect(404, done);
            });
    });

    it("should delete event", function (done) {
        preconditions
            .hasEvent(testUser, testEvent)
            .then(function (datas) {
                api
                    .deleteEvent(datas.token, datas.event.id)
                    .expect(204, done);
            });
    });

});
