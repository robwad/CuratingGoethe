<template>
  <div>
    <div>
      <navigation></navigation>
    </div>
    <br><br>
    <br><br>

    <!-- starting container -->
    <div class="container">

      <div align="center">
        <h1>Settings</h1>
      </div>

    <!-- Search form -->
    <div>
      <form class="form-sm mt-0" action="/settings/results" method="get" align="center">
        <div class="form-group row">
        <input class="form-control form-control-sm mx-5 mb-4 mt-4 mx-auto w-75" type="text" placeholder="Search for a Setting" aria-label="Search" name="settingSearch">
      </div>
        <div class="form-group row">
          <div style="display: block; margin: 0 auto;">
            <b-button class="btn aqua-gradient btn-rounded btn-outline-primary btn-md my-0" type="submit">Search</b-button>
            <b-button onclick="location.href='/settings/advanced'" class="btn aqua-gradient btn-rounded btn-outline-secondary btn-md my-0">Advanced Search</b-button>
        </div>
        </div>
      </form>
    </div>

    <!-- ending container -->
    </div>

    <br>
    <br>
    <br>
    <div id="charts" class="container">
        <div class="row">
          <div id="yearly-volume-chart" class="dc-chart" v-on:click=""> <strong>Settings by Time</strong> <div class="clearfix"></div> </div>
            <div class="dc-data-count">
              <span class="filter-count"></span> selected out of <span class="total-count"></span> records | <b-button @click="fetchData()" class="btn btn-secondary btn-sm">Reset All</b-button>
            </div>
        </div>
        <div id="tempo-chart1"> <strong>Tempo</strong> <div class="clearfix"></div> </div>
        <!--<div id="tempo-chart2"> <strong>Tempo in Pie</strong> </div>-->
        <div id="key-chart1"> <strong>Key</strong> <div class="clearfix"></div> </div>
        <!--<div id="key-chart2"> <strong>Key in Pie</strong> </div>-->
        <!--<div id="instrumentation-chart1"> <strong>Instrumentation in Row</strong> </div>-->
        <div id="instrumentation-chart2"> <strong>Instrumentation</strong> <div class="clearfix"></div> </div>
        <div id="author-chart"> <strong>Composer</strong> <div class="clearfix"></div> </div>
    </div>

    <table class="table table-hover dc-data-table">
    </table>

  </div>

</template>

<script>
//import navbar
import navigation from './components/navigation.vue'
export default {
  data() {
    return {
    };
  },
  methods: {
    fetchData: () => { // have only one function, and call it every time to reset. tried to seperate function but failed
      fetch('/crossSettings')
        .then((response) => { return response.json() })
        .then((data) => {
          //console.log(data);
          let settings = data;
          let dateFormatSpecifier = '%Y';
          let dateFormat = d3.timeFormat(dateFormatSpecifier);
          let dateFormatParser = d3.timeParse(dateFormatSpecifier);
          let appear = {};
          let settings1 = []; //removed duplicate
          settings.forEach((d) => {
            if(!d.instrumentation){ d.instrumentation = 'unknown';}
            if(!d.setting_tempo || d.setting_tempo == '0' || d.setting_tempo == 'N/A'){ d.setting_tempo = 'unknown';}
            if(!d.setting_key || d.setting_key == '0' || d.setting_key == 'N/A'){ d.setting_key = 'unknown';}
            if(!d.composition_title){ d.composition_title = 'unknown';}
            if(!d.poem_title){ d.poem_title = 'unknown';}
            if(!d.composed_year || isNaN(d.composed_year))
            {
              if(d.published_year && !isNaN(d.published_year))
                { d.composed_year = d.published_year;} // use publish year to demonstrate written year
              else
                { d.composed_year = '2019';} // use 2019 to lable unknown
            }
            d.dd = dateFormatParser(d.composed_year);
            d.year = d3.timeYear(d.dd); // pre-calculate year for better performance
            if(!appear[d.setting_id]) { // just use the poems withe the same text_id once
              appear[d.setting_id] = 1;
              settings1.push(d);
            }
          });

          let setting = crossfilter(settings1);
          let all = setting.groupAll();

          let yearlyDimension = setting.dimension((d) => {
            return d3.timeYear(d.dd).getFullYear();
          });
          let dateDimension = setting.dimension((d) => {
              return d.dd;
          });
          let moveYears = setting.dimension((d) => {
              return d.year;
          });
          let volumeByYearGroup = moveYears.group().reduceSum((d) => {
              return 1;
          });
          let instrumentation = setting.dimension((d) => {
            return d.instrumentation;
          });
          let instrumentationGroup = instrumentation.group().reduceSum((d) => {
            if(d.instrumentation == 'unknown') // solve the problem of unknown data in charts
              return 0;
            return 1;
          });
          let musicKey = setting.dimension((d) => {
            return d.setting_key;
          });
          let musicKeyGroup = musicKey.group().reduceSum((d) => {
            if(d.setting_key == 'unknown') // solve the problem of unknown data in charts
              return 0;
            return 1;
          });
          let tempo = setting.dimension((d) => {
            d.setting_tempo1 = d.setting_tempo.split(' ')[0];
            if(d.setting_tempo1[d.setting_tempo1.length-1] == '.' || d.setting_tempo1[d.setting_tempo1.length-1] == ',')
              d.setting_tempo1 = d.setting_tempo1.slice(0, d.setting_tempo1.length-1);
            return d.setting_tempo1;
          });
          let tempoGroup = tempo.group().reduceSum((d) => {
            if(d.setting_tempo == 'unknown') // solve the problem of unknown data in charts
              return 0;
            return 1;
          });
          let composer = setting.dimension((d) => {
            return d.display_name;
          });
          let composerGroup = composer.group().reduceSum((d) => {
            if(d.display_name == 'unknown') // solve the problem of unknown data in charts
              return 0;
            return 1;
          });
          let poem = setting.dimension((d) => {
            return d.poem_title;
          });
          let poemGroup = poem.group().reduceSum((d) => {
            if(d.poem_title == 'unknown') // solve the problem of unknown data in charts
              return 0;
            return 1;
          });
          let composition = setting.dimension((d) => {
            return d.composition_title;
          });
          let compositionGroup = poem.group().reduceSum((d) => {
            if(d.composition_title == 'unknown') // solve the problem of unknown data in charts
              return 0;
            return 1;
          });
          let volumeChart = dc.barChart('#yearly-volume-chart');
          let settingCount = dc.dataCount('.dc-data-count');
          let settingTable = dc.dataTable('.dc-data-table');
          let keyChart1 = dc.rowChart('#key-chart1');
          //let keyChart2 = dc.pieChart('#key-chart2');
          let tempoChart1 = dc.rowChart('#tempo-chart1');
          //let tempoChart2 = dc.pieChart('#tempo-chart2');
          //let instrumentationChart1 = dc.rowChart('#instrumentation-chart1');
          let instrumentationChart2 = dc.pieChart('#instrumentation-chart2');
          let authorChart = dc.pieChart('#author-chart');

          keyChart1 /* dc.rowChart */
            .width(500)
            .height(600)
            .margins({top: 20, left: 10, right: 10, bottom: 20})
            .group(musicKeyGroup)
            .dimension(musicKey)
            .label((d) => {
                return d.key;
            })
            .title((d) => {
                return d.setting_key;
            })
            .elasticX(true)
            .xAxis().ticks(4);

          // keyChart2 /* dc.pieChart */
          //   .width(500)
          //   .height(500)
          //   .radius(400)
          //   .innerRadius(120)
          //   .dimension(musicKey)
          //   .group(musicKeyGroup);

          tempoChart1 /* dc.rowChart */
            .width(600)
            .height(1600)
            .margins({top: 20, left: 10, right: 10, bottom: 20})
            .group(tempoGroup)
            .dimension(tempo)
            .label((d) => {
                return d.key;
            })
            .title((d) => {
                return d.setting_tempo;
            })
            .elasticX(true)
            .xAxis().ticks(4);

          // tempoChart2 /* dc.pieChart */
          //   .width(400)
          //   .height(400)
          //   .radius(320)
          //   .innerRadius(80)
          //   .dimension(tempo)
          //   .group(tempoGroup);

          // instrumentationChart1 /* dc.rowChart */
          //   .width(400)
          //   .height(800)
          //   .margins({top: 20, left: 10, right: 10, bottom: 20})
          //   .group(instrumentationGroup)
          //   .dimension(instrumentation)
          //   .label((d) => {
          //       return d.key;
          //   })
          //   .title((d) => {
          //       return d.instrumentation;
          //   })
          //   .elasticX(true)
          //   .xAxis().ticks(4);

          instrumentationChart2 /* dc.pieChart */
            .width(400)
            .height(400)
            .radius(320)
            .innerRadius(80)
            .dimension(instrumentation)
            .group(instrumentationGroup);

          authorChart /* dc.pieChart */
            .width(400)
            .height(400)
            .radius(320)
            .innerRadius(80)
            .dimension(composer)
            .group(composerGroup);

          volumeChart /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
            .width(1100)
            .height(400)
            .margins({top: 0, right: 50, bottom: 20, left: 40})
            .dimension(moveYears)
            .group(volumeByYearGroup)
            .centerBar(true)
            .gap(1)
            .x(d3.scaleTime().domain([new Date(1774, 0, 1), new Date(2013, 11, 31)])) //d3.extent(data, (d) => {return d.year}) || [new Date(1770, 0, 1), new Date(1829, 11, 31)]
            .round(d3.timeYear.round)
            .alwaysUseRounding(true)
            .xUnits(d3.timeYears)
            .xAxis().tickFormat(function (v) {
              //console.log(v);
              return d3.timeYear(v).getFullYear();
            });

          settingCount /* dc.dataCount('.dc-data-count', 'chartGroup'); */
            .dimension(setting)
            .group(all)
            // .html({
            //   some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
            //         ' | <b-button @click="fetchData()" class="btn btn-secondary btn-sm">Reset All</b-button>',
            //   all: 'All records selected. Please click on the graph to apply filters.'
            // }); // want to show differently base on selected or not, but the button now doesn't work

          settingTable /* dc.dataTable('.dc-data-table', 'chartGroup') */
            .dimension(dateDimension)
            .group((d) => {
              if(d.composed_year == '2019')
                return 'unknown';
              else
                return d.dd.getFullYear();
            })
            .size(500)
            .columns([
                'Date',
                {
                  label: 'Composition Title',
                  format: (d) => {
                      return `<a href='/setting/${d.setting_id}'> ${d.composition_title} </a>`;
                  }
                },
                {
                  label: 'Poem Title',
                  format: (d) => {
                    return d.poem_title;
                  }
                },
                {
                  label: 'Composer',
                  format: (d) => {
                    return d.display_name;
                  }
                },
                {
                  label: 'Key',
                  format: (d) => {
                    return d.setting_key;
                  }
                },
                {
                  label: 'Tempo',
                  format: (d) => {
                    return d.setting_tempo;
                  }
                },
                {
                  label: 'Instrumentation',
                  format: (d) => {
                    return d.instrumentation;
                  }
                }
            ])
            .sortBy((d) => {
                return d.dd;
            })
            .order(d3.ascending)
            .on('renderlet', (table) => {
                table.selectAll('.dc-table-group').classed('info', true);
            });

          // Render
            dc.renderAll();

        }).catch( error => { console.log(error); });
    }
  },
  mounted() {
    this.fetchData();
  },
  components: {
    'Navigation': navigation
  }
}
</script>

<style>
  [v-cloak] {
    display: none;
  }
  .dc-chart g.row text {
    fill: black;
  }
  p {
      margin-bottom: 25px;
  }

</style>
