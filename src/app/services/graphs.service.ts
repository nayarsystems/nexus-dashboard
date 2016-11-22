import { Injectable } from '@angular/core';

declare var Morris: any;

@Injectable()
export class GraphsService {
  graphs: any = {};
  ykeys: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  colors: string[] = ['#97BE0C', '#e64c3d', '#2fa7df', '#fbc31c'];

  constructor() {
    Morris.Donut.prototype.resizeHandler = function () {
      this.timeoutId = null;
      if (this.el && this.el.width() > 0 && this.el.height() > 0) {
        this.raphael.setSize(this.el.width(), this.el.height());
        return this.redraw();
      }
      else return null;
    };

    Morris.Donut.prototype.setData = function (data) {
      let row;
      this.data = data;
      this.values = (function () {
        let _i, _len, _ref, _results;
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

  }

  createBarChart(element, data, labels) {
    let dataCount = Object.keys(data[0]).length - 1;
    return Morris.Bar({
      element: element,
      data: data,
      xkey: 'y',
      ykeys: this.ykeys.slice(0, dataCount),
      labels: labels,
      hideHover: 'auto',
      resize: true, //defaulted to true
      gridLineColor: '#eeeeee',
      barSizeRatio: 0.2,
      barColors: this.colors.slice(0, dataCount)
    });
  }

  createLineChart(element, data, labels) {
    let dataCount = Object.keys(data[0]).length - 1;
    return Morris.Line({
      element: element,
      data: data,
      xkey: 'y',
      ykeys: this.ykeys.slice(0, dataCount),
      labels: labels,
      fillOpacity: ['0.9'],
      pointFillColors: '#ffffff',
      pointStrokeColors: '#999999',
      behaveLikeLine: true,
      gridLineColor: '#eef0f2',
      hideHover: 'auto',
      resize: true, //defaulted to true
      pointSize: 0,
      lineColors: this.colors.slice(0, dataCount)
    });
  }

  createDonutChart(element, data) {
    return Morris.Donut({
      element: element,
      data: data,
      resize: true, //defaulted to true
      colors: this.colors.slice(0, data.length),
      backgroundColor: '#fff',
      formatter: function (y, data) { return y + '%'; }
    });
  }

}
