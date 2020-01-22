<template>
  <div>
    <div>
        <div>
          <navigation></navigation>
        </div>
      <!-- starting container -->
      <div class="container">
        <br><br>
        <br><br>
        <div align="center">
          <h1>Goethe Poem</h1>
        </div>
        <!-- Search form -->
        <div>
          <form class="form-sm mt-0" action="/poems/results" method="get" align="center">
            <div class="form-group row">
              <input class="form-control form-control-sm mx-5 mb-4 mt-4 mx-auto w-75" type="text" placeholder="Search for a Poem" aria-label="Search" name="poemSearch">
            </div>
            <div class="form-group row">
              <div style="display: block; margin: 0 auto;">
                <b-button class="btn aqua-gradient btn-rounded btn-outline-primary btn-md my-0" type="submit">Search</b-button>&ensp;
                <b-button onclick="location.href='./poems/advanced'" class="btn aqua-gradient btn-rounded btn-outline-secondary btn-md my-0">Advanced Search</b-button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <br>
    <br>
    <br>
    <div id="charts">
          <div id="yearly-volume-chart" class="dc-chart" v-on:click=""> <strong>Poems by Time</strong> <div class="clearfix"></div> </div>
          <div id="genre-chart2"> <strong>Genres in Pie</strong> <div class="clearfix"></div> </div>
          <div v-show="showRow" id="genre-chart1"> <strong>Genre in Row</strong> </div>
    </div>
    <br>
    <div class="dc-data-count">
      <span class="filter-count"></span> selected out of <span class="total-count"></span> records | <b-button @click="fetchData()" class="btn btn-secondary btn-sm">Reset All</b-button>
    </div>
    <b-button @click="showRow=~showRow">Show More About Genre</b-button>
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
      //poems: new Array
      showRow: false
    };
  },
  methods: {
    fetchData: () => { // have only one function, and call it every time to reset. tried to seperate function but failed
      fetch('/crossPoems')
        .then((response) => { return response.json() })
        .then((data) => {
          //console.log(data);
          let poems = data;
          let dateFormatSpecifier = '%Y';
          let dateFormat = d3.timeFormat(dateFormatSpecifier);
          let dateFormatParser = d3.timeParse(dateFormatSpecifier);
          let appear = {};
          let poems1 = []; //removed duplicate
          poems.forEach((d) => {
            if(!d.display_title) {d.display_title = 'unknown';}
            if(!d.genre){ d.genre = 'unknown';}
            if(!d.contents){ d.contents = 'unknown';}
            if(!d.written_year || isNaN(d.written_year))
            {
              if(d.published_year && !isNaN(d.published_year))
                { d.written_year = d.published_year;} // use publish year to demonstrate written year
              else
                { d.written_year = '2019';} // use 2019 to lable unknown
            }
            d.dd = dateFormatParser(d.written_year);
            d.year = d3.timeYear(d.dd); // pre-calculate year for better performance
            if(!appear[d.text_id]) { // just use the poems withe the same text_id once
              appear[d.text_id] = 1;
              poems1.push(d);
            }
          });

          //console.log(poems);

          let poem = crossfilter(poems1);
          let all = poem.groupAll();

          let yearlyDimension = poem.dimension((d) => {
            return d3.timeYear(d.dd).getFullYear();
          });
          var dateDimension = poem.dimension((d) => {
              return d.dd;
          });
          var moveYears = poem.dimension((d) => {
              return d.year;
          });
          let volumeByYearGroup = moveYears.group().reduceSum((d) => {
              return 1;
          });
          let genre = poem.dimension((d) => {
            return d.genre;
          });
          var genreGroup = genre.group().reduceSum((d) => {
            //console.log(d);
            if(d.genre == 'unknown') // solve the problem of unknown data in charts
              return 0;
            return 1;
          });
          let volumeChart = dc.barChart('#yearly-volume-chart');
          var poemCount = dc.dataCount('.dc-data-count');
          var poemTable = dc.dataTable('.dc-data-table');
          var genreChart1 = dc.rowChart('#genre-chart1');
          var genreChart2 = dc.pieChart('#genre-chart2');

          genreChart2 /* dc.pieChart('#quarter-chart', 'chartGroup') */
            .width(300)
            .height(300)
            .radius(170)
            .innerRadius(60)
            .dimension(genre)
            .renderLabel(true)
            .group(genreGroup);

          genreChart1 /* dc.rowChart('#day-of-week-chart', 'chartGroup') */
            .width(800)
            .height(350)
            .margins({top: 20, left: 10, right: 10, bottom: 20})
            .group(genreGroup)
            .dimension(genre)
            .label((d) => {
                return d.key;
            })
            .title((d) => {
                return d.genre;
            })
            .elasticX(true)
            .xAxis().ticks(4);

          volumeChart /* dc.barChart('#monthly-volume-chart', 'chartGroup'); */
            .width(900)
            .height(360)
            .margins({top: 0, right: 50, bottom: 20, left: 40})
            .dimension(moveYears)
            .group(volumeByYearGroup)
            .centerBar(true)
            .gap(1)
            .x(d3.scaleTime().domain([new Date(1770, 0, 1), new Date(1829, 11, 31)])) //d3.extent(data, (d) => {return d.year}) || [new Date(1770, 0, 1), new Date(1829, 11, 31)]
            .round(d3.timeYear.round)
            .alwaysUseRounding(true)
            //.xAxis(d3.axisBottom(d3.scaleTime().domain([new Date(2010, 7, 1), new Date(2012, 7, 1)])).ticks(d3.timeYears));
            .xUnits(d3.timeYears)
            .xAxis().tickFormat(function (v) {
              //console.log(v);
              return d3.timeYear(v).getFullYear();
            });

          poemCount /* dc.dataCount('.dc-data-count', 'chartGroup'); */
            .dimension(poem)
            .group(all)
            // .html({
            //   some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
            //         ' | <b-button @click="fetchData()" class="btn btn-secondary btn-sm">Reset All</b-button>',
            //   all: 'All records selected. Please click on the graph to apply filters.'
            // }); // want to show differently base on selected or not, but the button now doesn't work

          poemTable /* dc.dataTable('.dc-data-table', 'chartGroup') */
            .dimension(dateDimension)
            .group((d) => {
              if(d.written_year == '2019')
                return 'unknown';
              else
                return d.dd.getFullYear();
            })
            .size(500)
            .columns([
                // {
                //   label:'Date',
                //   format: (d) => {
                //     if(d.written_year == '1769')
                //       return 'unknown'
                //     else
                //       return d.dd;
                //   }
                // },
                'Date',
                {
                  label: 'Poem Title',
                  format: (d) => {
                      return `<a href='/poem/${d.text_id}'> ${d.display_title} </a>`;
                  }
                },
                {
                  label: 'Genre',
                  format: (d) => {
                    return d.genre;
                  }
                },
                {
                  label: 'First Line',
                  format: (d) => {
                    return d.contents.split('\\')[0];
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
</style>
