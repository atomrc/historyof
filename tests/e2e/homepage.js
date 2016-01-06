require("dotenv").load();
var Browser = require("zombie"),
    app = require("../../app"),
    db = require("../../db/db"),
    config = require("../../config/config"),
    expect = require("expect.js");

var sequelize = db.init(config.db);

app.listen(3000, function () {
    console.log("listening at %s", process.env.PORT || 1337);
});

Browser.localhost("historyof.test", "3000");

describe("homepage", function () {
    var browser = new Browser();
    it("should show baseline", function (done) {
        browser
            .visit("/")
            .then(function () {
                expect(browser.success).to.be.ok();
                expect(browser.text("h1")).to.be.equal("HistoryOf");
                expect(browser.text("h2")).to.be.equal("Ecris, sauvegarde & protège");
            })
            .then(done);
    });
})

describe("account creation", function () {
    var browser = new Browser();
    it("should show the register form", function (done) {
        browser
            .visit("/register")
            .then(function() {
                expect(browser.success).to.be.ok();
                //submit button should be disabled
                expect(browser.querySelector("input[type=submit][disabled]")).to.not.be(null);
                browser
                    .fill("pseudo", "felix")
                    .fill("login", "felix@felix.com")
                    .fill("password", "$o$trong")
                    .fill("passwordConfirmation", "$o$trong")
                    .pressButton("Start Writting")
                    .then(function () {
                        //expect(browser.text(".timeline-header h1")).to.be("felix's timeline");
                    })
                    .then(done);
            });
    });
});
