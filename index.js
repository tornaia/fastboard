var app = angular.module('StarterApp', ['ngMaterial']);app.config(function ($sceProvider) {    $sceProvider.enabled(false);});app.factory('chartService', function () {    return {        createLinearChart: function () {            console.log('ChartService.createLinearChart()');        }    };});app.directive('sampleLinearChart', function () {    return {        restrict: 'EA',        template: '<svg width="275" height="100"></svg>',        replace: true,        link: function (scope, elem, attrs) {            var lineChartData = [                {date: "2011-10-01 00:00", close: 70},                {date: "2011-10-02 00:00", close: 0},                {date: "2011-10-03 00:00", close: 60},                {date: "2011-10-04 00:00", close: 120}            ];            var parseDateTime = d3.timeParse("%Y-%m-%e %H:%M");            lineChartData.forEach(function (d) {                d.date = parseDateTime(d.date);            });            var id = attrs.id;            var svg = d3.select("#" + id),                margin = {top: 25, right: 15, bottom: 30, left: 25},                width = +svg.attr("width") - margin.left - margin.right,                height = +svg.attr("height") - margin.top - margin.bottom,                g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");            var x = d3.scaleTime()                .rangeRound([0, width]);            var y = d3.scaleLinear()                .domain([0, 100])                .range([height, 0]);            var line = d3.line()                .x(function (d) {                    return x(d.date);                })                .y(function (d) {                    return y(d.close);                });            x.domain(d3.extent(lineChartData, function (d) {                return d.date;            }));            y.domain(d3.extent(lineChartData, function (d) {                return d.close;            }));            g.append("g")                .attr("transform", "translate(0," + height + ")")                .call(d3                    .axisBottom(x)                    .ticks(3)                    .tickSize(2)                    .tickFormat(d3.timeFormat("%b %e")))                .select(".domain");            svg.selectAll(".tick text")                .attr("transform", function (d) {                    return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + 10 + ")rotate(-45)";                });            g.append("g")                .call(d3                    .axisLeft(y)                    .ticks(3)                    .tickSize(2))                .append("text")                .attr("fill", "#000")                .attr("transform", "rotate(-90)")                .attr("y", 6)                .attr("dy", "0.71em")                .attr("text-anchor", "end");            g.append("path")                .datum(lineChartData)                .attr("fill", "none")                .attr("stroke", "steelblue")                .attr("stroke-linejoin", "round")                .attr("stroke-linecap", "round")                .attr("stroke-width", 1.5)                .attr("d", line);        }    }});app.directive('linearChart', ['$http', function ($http) {    return {        restrict: 'EA',        template: '<svg width="480" height="220"></svg>',        replace: true,        link: function (scope, elem, attrs) {            var chartData = scope.chart;            console.log("chart " + chartData.id + "'s dataSource: " + chartData.datasource);            $http.get(chartData.datasource)                .then(function (response) {                    var lineChartData = response.data;                    lineChartData.forEach(function (d) {                        d.date = new Date(d.start);                        d.value = d.duration;                    });                    var id = attrs.id;                    var svg = d3.select("#" + id);                    var margin = {top: 25, right: 15, bottom: 30, left: 30};                    var width = attrs.width - margin.left - margin.right;                    var height = attrs.height - margin.top - margin.bottom;                    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");                    var x = d3.scaleTime()                        .rangeRound([0, width]);                    var y = d3.scaleLinear()                        .domain([0, 100])                        .range([height, 0]);                    var line = d3.line()                        .x(function (d) {                            return x(d.date);                        })                        .y(function (d) {                            return y(d.value);                        });                    x.domain(d3.extent(lineChartData, function (d) {                        return d.date;                    }));                    y.domain(d3.extent(lineChartData, function (d) {                        return d.value;                    }));                    g.append("g")                        .attr("transform", "translate(0," + height + ")")                        .call(d3                            .axisBottom(x)                            .ticks(3)                            .tickSize(2)                            .tickFormat(d3.timeFormat("%b %e")))                        .select(".domain");                    svg.selectAll(".tick text")                        .attr("transform", function (d) {                            return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + 10 + ")rotate(-45)";                        });                    g.append("g")                        .call(d3                            .axisLeft(y)                            .ticks(3)                            .tickSize(2))                        .append("text")                        .attr("fill", "#000")                        .attr("transform", "rotate(-90)")                        .attr("y", 6)                        .attr("dy", "0.71em")                        .attr("text-anchor", "end");                    g.append("path")                        .datum(lineChartData)                        .attr("fill", "none")                        .attr("stroke", "steelblue")                        .attr("stroke-linejoin", "round")                        .attr("stroke-linecap", "round")                        .attr("stroke-width", 1.5)                        .attr("d", line);                });        }    }}]);app.controller('AppCtrl', ['$scope', '$mdSidenav', '$mdToast', 'chartService', function ($scope, $mdSidenav, $mdToast, chartService) {    $scope.toggleSidenav = function () {        $mdSidenav('left').toggle();    };    $scope.charts = [];    $scope.addLinearChart = function () {        var newLinearChartData = {            id: $scope.charts.length,            type: 'linear',            name: 'Chart ' + new Date().getSeconds(),            datasource: 'https://sync-monitor.dev2.mdl.swisscom.ch/monitor'        };        $scope.charts.push(newLinearChartData);        $mdToast.show(            $mdToast.simple()                .textContent('Linear chart added')        );    }}]);