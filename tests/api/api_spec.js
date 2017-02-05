/*global beforeEach, it, after*/
/*eslint-env node */

"use strict";
var request = require("supertest"),
    setup = require("./setup"),
    jwt = require("jsonwebtoken"),
    app = require("../../app"),
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
    hasStory: function (token, story) {
        return new Promise(function (resolve, reject) {
            api
                .createStory(token, story)
                .end(function (err, res) {
                    if (err) {
                        return reject(err);
                    }

                    resolve({ token: token, story: res.body });
                });
        }.bind(this));
    }
};

function genToken(userid) {
    return jwt.sign({ sub: "user0" }, new Buffer(process.env.JWT_SECRET, "base64"));
}


describe("API", function () {
    var testStory = { title: "new story", type: "story", date: new Date() };

    it("should add a new story to user", function (done) {
            var token = genToken("user0");

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

    it("should return list of user's stories", function (done) {
        var token = genToken("user0");

        preconditions
            .hasStory(token, testStory)
            .then(function (datas) {
                var story = datas.story;

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
        var token = genToken("user0");

        preconditions
            .hasStory(token, testStory)
            .then(function (datas) {
                api
                    .updateStory(token, datas.story.id, { title: "new title" })
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
        var token = genToken("user0");

        preconditions
            .hasStory(token, testStory)
            .then(function () {
                api
                    .getStory(token, "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee")
                    .expect(404, done);
            });
    });

    it("should delete story", function (done) {
        var token = genToken("user0");

        preconditions
            .hasStory(token, testStory)
            .then(function (datas) {
                api
                    .deleteStory(token, datas.story.id)
                    .expect(204, done);
            });
    });

});
