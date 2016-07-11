/*global beforeEach, it, after*/
/*eslint-env node */

"use strict";
var request = require("supertest"),
    app = require("../../app"),
    setup = require("./setup"),
    assign = Object.assign,
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

    createStory: function (userToken, story) {
        return request(app)
            .post("/u/stories")
            .set("Authorization", "Bearer " + userToken)
            .send(story);
    },

    getStories: function (userToken) {
        return request(app)
            .get("/u/stories")
            .set("Authorization", "Bearer " + userToken);
    },

    getStory: function (userToken, storyId) {
        return request(app)
            .get("/u/stories/" + storyId)
            .set("Authorization", "Bearer " + userToken);
    },


    updateStory: function (userToken, storyId, newData) {
        return request(app)
            .put("/u/stories/" + storyId)
            .set("Authorization", "Bearer " + userToken)
            .send(newData);
    },

    deleteStory: function (userToken, storyId) {
        return request(app)
            .del("/u/stories/" + storyId)
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

    hasStory: function (user, story) {
        return new Promise(function (resolve, reject) {
            this
                .hasUser(user)
                .then(function (datas) {
                    api
                        .createStory(datas.token, story)
                        .end(function (err, res) {
                            if (err) {
                                return reject(err);
                            }

                            resolve({ token: datas.token, story: res.body });
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
        testStory = { title: "new story", type: "story", date: new Date() };

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

    it("should add a new story to user", function (done) {
        preconditions
            .hasUser(testUser)
            .then(function (userData) {
                var token = userData.token;

                api.createStory(token, testStory)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) { return done(err); }
                        var story = res.body;

                        expect(story.title).to.be(testStory.title);
                        expect(story.id).to.not.be(undefined);
                        done();
                    });
            });
    });

    it("should return list of user's stories", function (done) {
        preconditions
            .hasStory(testUser, testStory)
            .then(function (datas) {
                var token = datas.token,
                    story = datas.story;

                api
                    .getStories(token)
                    .end(function (err, res) {
                        if (err) { return done(err); }
                        expect(res.body.length).to.be(1);
                        expect(res.body[0]).to.eql(story);
                        done();
                    });
            });
    });

    it("should update newly created story", function (done) {
        preconditions
            .hasStory(testUser, testStory)
            .then(function (datas) {
                api
                    .updateStory(datas.token, datas.story.id, { title: "new title" })
                    .expect(200)
                    .end(function (err, res) {
                        if (err) { return done(err); }

                        var e = res.body;
                        expect(e.title).to.be("new title");
                        expect(e.id).to.be(datas.story.id);
                        expect(e.date).to.equal(datas.story.date);

                        done();
                    });
            });
    });

    it("should not find an inexistant story", function (done) {
        preconditions
            .hasStory(testUser, testStory)
            .then(function (datas) {
                api
                    .getStory(datas.token, "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee")
                    .expect(404, done);
            });
    });

    it("should delete story", function (done) {
        preconditions
            .hasStory(testUser, testStory)
            .then(function (datas) {
                api
                    .deleteStory(datas.token, datas.story.id)
                    .expect(204, done);
            });
    });

});
