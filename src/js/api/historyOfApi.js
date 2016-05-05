/*global require, module, fetch*/
var assign = require("object-assign"),
    fetchPolyfill = require("whatwg-fetch");

var config = {
    loginUrl: "/user/authenticate",
    urlPattern: "/u/stories/:eid"
};

function request(url, params={}) {
    params.method = params.method ? params.method : "GET";
    params.headers = assign({}, {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }, params.headers);

    params.body = params.body ? JSON.stringify(params.body) : undefined;

    return fetch(url, params)
        .then(function (response) {
            if (!response.ok) {
                throw response;
            }
            return response.json();
        })
        .catch(function (response) {
            return response
                .json()
                .then(function (error) {
                    throw error;
                });
        });
}

function requestProtected(url, token, params) {
    if (!token) {
        throw new Error("requesting protected ressource with no token");
    }

    var conf = assign({}, {
        headers: {
            Authorization: "Bearer " + token
        }
    }, params);

    return request(url, conf);
}

function generateUrl(url, data) {
    data = data || {};
    for (var i in data) {
        url = url.replace(":" + i, data[i]);
    }
    //cut the end of the pattern to remove unbinded datas
    return url.replace(/\/:.*/g, "");
}

function initStory (story) {
    story.date = new Date(story.date);
    return story;
}

var api = {
    login: function ({ login, password }) {

        return request(config.loginUrl, {
            method: "POST",
            body: {
                login: login,
                password: password
            }
        });
    },

    checkLogin: function (login) {
        return request("/check/login/" + login);
    },

    checkPseudo: function (pseudo) {
        return request("/check/pseudo/" + pseudo);
    },

    fetchUser: function (token) {
        return requestProtected("/u", token);
    },

    createUser: function (user) {
        return request("/user/create", {
            method: "POST",
            body: user
        });
    },

    fetchStories: function (token) {
        return requestProtected("/u/stories", token)
            .then((stories) => {
                return stories.map(initStory)
            });
    },

    createStory: function (token, { story }) {
        return requestProtected("/u/stories", token, {
                method: "POST",
                body: story
            }).then(initStory);
    },

    updateStory: function (token, { story }) {
        requestProtected(generateUrl(config.urlPattern, { eid: story.id }), token, {
            method: "PUT",
            body: story
        }).then(initStory);
    },

    remove: function (token, { story }) {
        requestProtected(generateUrl(config.urlPattern, { eid: story.id }), token, {
            method: "DELETE"
        });
    }
};

module.exports = api;
