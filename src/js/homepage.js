var icons = [
    "home",
    "newspaper",
    "quill",
    "location",
    "clock",
    "bubbles2",
    "leaf",
    "power",
    "earth",
    "heart",
    "happy2"
];

var AnimatedIcon = function (icon) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
        use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    svg.classList.add("icon");
    svg.classList.add("live-icon");
    use.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#icon-" + icon);

    svg.appendChild(use);

    function computeBounds(x) {
        let value = 0;
        if (x >= 0) {
            value = Math.pow(x/10, 2);
        }
        return { max: value, min: -value };
    }

    function computeSize(x) {
        return Math.max(0.5, x/100);
    }

    function computeOpacity(x, opacity) {
        return x > 0 ? Math.min(1, opacity + 0.01) : (100 + x)/100;
    }

    return {
        element: svg,
        speed: 0.5,
        position: {
            x: 0,
            y: 0
        },
        size: 1,
        opacity: 1,
        computeY: function () { return 1; },
        /**
         * set initial position of the icon
         *
         * @return {undefined}
         */
        init() {
            let x = 30 + Math.floor((Math.random() * 200)),
                y;
            let bounds = computeBounds(x);
            y = Math.random() * (bounds.max - bounds.min + 1) + bounds.min;
            this.computeY = function (newX) {
                return y/Math.pow(x, 2) * Math.pow(newX, 2);
            };
            this.position.x = x;
            this.position.y = y;
            this.opacity = 0.1;
            return this;
        },

        /**
         * update the current state of the element
         * the new x position is computed, then everything else is
         * deduced from the x position (y position, opacity, size)
         *
         * @return {undefined}
         */
        update() {
            let {position} = this;

            position.x = position.x - this.speed;
            let bounds = computeBounds(position.x);
            position.y = Math.max(bounds.min, Math.min(bounds.max, this.computeY(position.x)));

            this.size = computeSize(position.x);
            this.opacity = computeOpacity(position.x, this.opacity);

            return this;
        },

        /**
         * render current state to the dom element
         *
         * @return {undefined}
         */
        commit() {
            this.element.style.transform = "translate(" + this.position.x + "px, " + this.position.y + "px) scale(" + this.size + ") rotate(-300deg)"
            this.element.style.opacity = this.opacity;
            return this;
        }
    };
};


function init(rootNode) {
    var iconsElements = icons
        .map(iconName => AnimatedIcon(iconName))
        .map(icon => {
            icon.init();
            icon.commit();
            rootNode.appendChild(icon.element);
            return icon;
        });

    function nextFrame() {
        iconsElements
            .map(element => {
                if (element.opacity === 0) {
                    //recycle disapeared icons
                    return element.init();
                }
                return element.update()
            })
            .map(element => element.commit());
        window.requestAnimationFrame(nextFrame);
    }
    window.requestAnimationFrame(nextFrame);
}

init(document.querySelector(".canvas"));
