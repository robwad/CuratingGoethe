<template>
  <div>
    <div>
            <navigation></navigation>
    </div>
    <!-- starting container -->
    <div class="container">
      <br></br>
        <h2 align="center">Setting Results</h2>
      <br></br>

<!-- Search Form -->
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

<!-- Ending Container -->
    </div>

<!-- Create Column for Settings -->
    <b-card-group columns>
        <div v-for="result in results">
        <div class="card text-center mx-auto" style="width: 28rem;">
        <div class="card-header">{{ result.display_title}}</div>
          <div class="card-body">
              <h5 class="card-title">{{ result.display_title }}</h5>
              <h6 class="card-subtitle mb-2 text-muted" v-if="result.published_year">Year Published: {{ result.published_year}}</h6>
              <p class="card-text" v-if="result.instrumentation">Instrumentation: <em>{{ result.instrumentation}}</em></p>
              <p class="card-text" v-if="result.setting_tempo != 0">Tempo: <em>{{ result.setting_tempo }}</em></p>
              <p class="card-text" v-if="result.setting_key != 0">Instrumentation: {{ result.setting_key }}</p>
              <b-button :href="result.setting_id" class="btn btn-secondary btn-sm">Show Setting</b-button>
              <br></br>
            </div>
        </div>
        </div>
        </b-card-group>
      </div>


 </template>


<script>
//import navbar
import navigation from './components/navigation.vue'
export default {
    data() {
      return {};
    },
    method: {
      decodeHtml: (html) => {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
      }
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
