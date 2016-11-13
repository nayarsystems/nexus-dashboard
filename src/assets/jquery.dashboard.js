
/**
* Theme: Flacto Admin Template
* Author: Coderthemes
* Dashboard
*/

function graphsInit() {

    Morris.Donut.prototype.resizeHandler = function () {
        this.timeoutId = null;
        if (this.el && this.el.width() > 0 && this.el.height() > 0) {
            this.raphael.setSize(this.el.width(), this.el.height());
            return this.redraw();
        }
        else return null;
    };
    Morris.Donut.prototype.setData = function (data) {
        var row;
        this.data = data;
        this.values = (function () {
            var _i, _len, _ref, _results;
            _ref = this.data;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                row = _ref[_i];
                _results.push(parseFloat(row.value));
            }
            return _results;
        }).call(this);
        if (this.el && this.el.width() > 0 && this.el.height() > 0) {
            return this.redraw();
        }
        else return null;
    };

    !function ($) {
        "use strict";

        var Dashboard1 = function () {
            this.$realData = []
        };

        //creates Bar chart
        Dashboard1.prototype.createBarChart = function (element, data, xkey, ykeys, labels, lineColors) {
            Morris.Bar({
                element: element,
                data: data,
                xkey: xkey,
                ykeys: ykeys,
                labels: labels,
                hideHover: 'auto',
                resize: true, //defaulted to true
                gridLineColor: '#eeeeee',
                barSizeRatio: 0.2,
                barColors: lineColors
            });
        },

            //creates line chart
            Dashboard1.prototype.createLineChart = function (element, data, xkey, ykeys, labels, opacity, Pfillcolor, Pstockcolor, lineColors) {
                Morris.Line({
                    element: element,
                    data: data,
                    xkey: xkey,
                    ykeys: ykeys,
                    labels: labels,
                    fillOpacity: opacity,
                    pointFillColors: Pfillcolor,
                    pointStrokeColors: Pstockcolor,
                    behaveLikeLine: true,
                    gridLineColor: '#eef0f2',
                    hideHover: 'auto',
                    resize: true, //defaulted to true
                    pointSize: 0,
                    lineColors: lineColors
                });
            },

            //creates Donut chart
            Dashboard1.prototype.createDonutChart = function (element, data, colors) {
                Morris.Donut({
                    element: element,
                    data: data,
                    resize: true, //defaulted to true
                    colors: colors,
                    backgroundColor: '#fff',
                    formatter: function (y, data) { return y + '%'; }
                });
            },


            Dashboard1.prototype.init = function () {

                //creating bar chart
                var $barData = [
                    { y: 'Marzo', a: 1000 },
                    { y: 'Abril', a: 1100 },
                    { y: 'Mayo', a: 1200 },
                    { y: 'Junio', a: 1150 },
                    { y: 'Julio', a: 1100 },
                    { y: 'Agosto', a: 1000 },
                    { y: 'Septiembre', a: 1250 }
                ];
                this.createBarChart('morris-bar-example', $barData, 'y', ['a'], ['Pedidos'], ['#97BE0C']);

                //create line chart
                var $data = [
                    { y: '2016-01-01', a: 16000, b: 7000 },
                    { y: '2016-02-01', a: 16101, b: 7100 },
                    { y: '2016-03-01', a: 16300, b: 7300 },
                    { y: '2016-04-01', a: 16200, b: 7200 },
                    { y: '2016-05-01', a: 16700, b: 7500 },
                    { y: '2016-06-01', a: 16800, b: 7400 },
                    { y: '2016-07-01', a: 17100, b: 7300 },
                    { y: '2016-08-01', a: 17000, b: 7400 }
                ];
                this.createLineChart('morris-line-example', $data, 'y', ['a', 'b'], ['Cumplen EN81-28', 'No hacen testeo'], ['0.9'], ['#ffffff'], ['#999999'], ['#97BE0C', '#e64c3d']);

                //create line chart
                var $data = [
                    { y: '2016-01-01', a: 16000, b: 7000, c: 10000, d: 5000 },
                    { y: '2016-02-01', a: 16101, b: 7100, c: 10000, d: 5000 },
                    { y: '2016-03-01', a: 16300, b: 7300, c: 10000, d: 5000 },
                    { y: '2016-04-01', a: 16200, b: 7200, c: 10000, d: 5000 },
                    { y: '2016-05-01', a: 16700, b: 7500, c: 10000, d: 5000 },
                    { y: '2016-06-01', a: 16800, b: 7400, c: 10000, d: 5000 },
                    { y: '2016-07-01', a: 17100, b: 7300, c: 10000, d: 5000 },
                    { y: '2016-08-01', a: 17000, b: 7400, c: 10000, d: 5000 }
                ];
                this.createLineChart('morris-line-example-2', $data, 'y', ['a', 'b', 'c', 'd'], ['Voz Jazztel', 'Voz Orange', 'M2CC', 'CSD'], ['0.9'], ['#ffffff'], ['#999999'], ['#97BE0C', '#2fa7df', '#e64c3d', '#fbc31c']);

                //creating donut chart
                var $donutData = [
                    { label: "Activos", value: 40 },
                    { label: "Sin servicio", value: 40 },
                    { label: "Inactivos", value: 20 }
                ];
                this.createDonutChart('morris-donut-example', $donutData, ['#97BE0C', '#2fa7df', "#e64c3d"]);

                var donut2Data = [
                    { label: "Cumplen EN81-28", value: 80 },
                    { label: "No hacen testeo", value: 20 }
                ];
                this.createDonutChart('morris-donut-example-2', donut2Data, ['#97BE0C', "#e64c3d"]);
            },
            //init
            $.Dashboard1 = new Dashboard1, $.Dashboard1.Constructor = Dashboard1
    } (window.jQuery),

        //initializing 
        function ($) {
            "use strict";
            $.Dashboard1.init();
        } (window.jQuery);
}