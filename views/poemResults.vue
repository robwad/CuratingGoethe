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
        <h1>Poem Results</h1>
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
              <b-button onclick="location.href='./advanced'" class="btn aqua-gradient btn-rounded btn-outline-secondary btn-md my-0">Advanced Search</b-button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div>
    <svg width="700" height="400" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0,0,932,932">
      <g>

      </g>
    </svg>
    <p id="demo"></p>

  </div>

 </div>
 </div>

</template>

<script>
//import navbar
import navigation from './components/navigation.vue'
export default {
    data() {
      return {};
    },
    methods: {
      fetchData: () => {
        // change this to an if statement that checks for a flag that you need to add when generating the query
        // in app.js and either builds path using bubblePoemsAdvanced or bubblePoemsBasic
        var query = window.location.search
        var advanced_path = '/bubblePoemsAdvanced' + query
        var basic_path = '/bubblePoemsBasic' + query
        // console.log("path", advanced_path)
        if (query.includes("poemLanguage")) {
          var final_path = advanced_path
          // console.log("advanced_path")
        }
        else {
          var final_path = basic_path
          // console.log("basic_path")
        }
        fetch(final_path)
        .then((response) => { return response.json()})
        .then((data) => {
          var both = data
          var poems = both.poems
          var translations = both.translations
          // console.log("poems vue:", poems)
          // console.log("translations vue:", translations)

          var trans_array = []
          for (let k = 0; k < poems.length; k++) {
            var next = 0;
            for (let j = 0; j < translations.length; j++) {
              if (poems[k].text_id == translations[j].based_on_text_id) {
                next++
              }
            }
            trans_array.push(next)
          }
          // console.log("trans_array:", trans_array)

          var new_data = [{}]
          for (let i = 0; i < poems.length; i++) {
            var next_entry = {}
            if (poems[i].display_title == null) {
              var disp_title = "Untitled"
            }
            else {
              var all_lower = poems[i].display_title.toLowerCase()
              var disp_title = all_lower.charAt(0).toUpperCase() + all_lower.slice(1)
            }
            next_entry.name = `${disp_title}$/poem/${poems[i].text_id}`
            //next_entry.href = `/poem/${poems[i].text_id}`
            next_entry.title = `${disp_title}`// for show data when you move your mouse on
            next_entry.group = poems[i].genre
            next_entry.value = trans_array[i] * 100 + 100
            next_entry.count = trans_array[i]
            new_data.push(next_entry)
          }
          //console.log("new_data", new_data)

          var width = 932
          var height = width
          // ƒ m(t)
          var format = d3.format(",d")
          // ƒ i(i)
          var color = d3.scaleOrdinal().range(d3.schemeCategory10)

          function pack(data) {
  return d3.pack()
    .size([width - 2, height - 2])
    .padding(3)
  (d3.hierarchy({children: data})
    .sum(d => d.value))
}

// console.log(pack(dummydata))


  const roott = pack(new_data);

  const svg = d3.select("svg")
      .style("width", "100%")
      .style("height", "auto")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif")
      .attr("text-anchor", "middle");

  const leaf = svg.selectAll("g")
    .data(roott.leaves())
    .enter().append("g")
      .attr("transform", d => `translate(${d.x + 1},${d.y + 1})`);

  leaf.append("circle")
      // .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("r", d => d.r)
      .attr("fill-opacity", 0.7)
      .attr("fill", d => color(d.data.group));

  leaf.append("clipPath")
      // .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
      // .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
      // .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter().append("a")
       .attr("href", d => d.split('$')[1])
      // .attr("y", (d, i, nodes) => `${i - nodes.length / 2 + 0.8}em`)
      .text(d => d.split('$')[0]);

  leaf.append("title")

      .text(d => `${d.data.title}\ntranslations:${d.data.count}`);

  // console.log(svg.node());
        }
      )}
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
</style>
