/*global beforeEach, it, after*/
/*eslint-env node */

"use strict";
var request = require("supertest"),
    app = require("../app"),
    setup = require("./setup"),
    assign = require("object-assign"),
    Promise = require("es6-promise").Promise,
    expect = require("expect.js");

beforeEach(function (done) {
    //clean the database before playing the tests
    setup.reset(function () {
        done();
    });
});

after(function () {
    setup.disconnect();
});

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
            .post("/user/authenticate")
            .send({
                login: login,
                password: pwd
            });
    },

    checkLogin: function (login) {
        return request(app)
            .get("/check/login/" + login);
    },

    checkPseudo: function (pseudo) {
        return request(app)
            .get("/check/pseudo/" + pseudo);
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
            passwordConfirmation: "felix",
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
                expect(u.id).to.not.be(undefined);
                expect(u.password).to.be(undefined);
                expect(u.login).to.be(testUser.login);
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

    it("should tell the login is available", function (done) {
        api
            .checkLogin("felix@felix.fr")
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                expect(res.body.available).to.be.ok();
                done();
            });
    });

    it("should tell the login is not available", function (done) {
        preconditions
            .hasUser(testUser)
            .then(function () {
                api
                    .checkLogin(testUser.login)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) { return done(err); }
                        expect(res.body.available).to.not.be.ok();
                        done();
                    });
            });
    });

    it("should tell the pseudo is available", function (done) {
        api
            .checkPseudo("felox")
            .expect(200)
            .end(function (err, res) {
                if (err) { return done(err); }
                expect(res.body.available).to.be.ok();
                done();
            });
    });

    it("should tell the pseudo is not available", function (done) {
        preconditions
            .hasUser(testUser)
            .then(function () {
                api
                    .checkPseudo(testUser.pseudo)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) { return done(err); }
                        expect(res.body.available).to.not.be.ok();
                        done();
                    });
            });
    });

    it("should not create user if passwords don't match", function (done) {
        var u = assign({}, testUser, {
            passwordConfirmation: "wrong"
        });

        api
            .createUser(u)
            .expect(400, done);
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
                        expect(u.id).to.equal(loggedUser.id);
                        expect(u.pseudo).to.equal(loggedUser.pseudo);
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
                        expect(body.token).to.not.be(undefined);
                        expect(body.user.login).to.be(userData.user.login);

                        done();
                    });
            });
    });

    it("should not be able to login with wrong password", function (done) {
        preconditions
            .hasUser(testUser)
            .then(function () {
                api.login(testUser.login, "wrong password")
                    .expect(401, done);
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

                        expect(event.title).to.be(testEvent.title);
                        expect(event.id).to.not.be(undefined);
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
                        expect(res.body.length).to.be(1);
                        expect(res.body[0]).to.eql(event);
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
                        expect(e.title).to.be("new title");
                        expect(e.id).to.be(datas.event.id);
                        expect(e.date).to.equal(datas.event.date);

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
