
/**
* Theme: Flacto Admin Template
* Author: Coderthemes
* Dashboard
*/

function graphsInit() {
    createLineChartFunc = function ($) {
        "use strict";

        var Dashboard1 = function () {
            this.$realData = []
        };
        //creates line chart
        Dashboard1.prototype.createLineChart = function (element, data, xkey, ykeys, labels, opacity, Pfillcolor, Pstockcolor, lineColors) {
            return Morris.Line({
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
        };
        
        //init
        $.Dashboard1 = new Dashboard1, $.Dashboard1.Constructor = Dashboard1
        
        return Dashboard1.prototype.createLineChart;
    } (window.jQuery);
    
    return createLineChartFunc;
}