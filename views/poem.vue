<template>
  <div>
    <div>
            <navigation></navigation>
    </div>
    <br></br>

    <div v-if="poems['Basic']">
      <h2 align="center">{{poems['Basic'].display_title}}</h2>
    </div>
    <div v-else>
      <h2 align="center">Title Unknown</h2>
    </div>
    <br></br>

    <!-- Create Column for Poems -->
    <b-container class="bv-example-row">
      <div class="row">
        <div class="col-sm-6">
          <div class="card" style="width: 32rem;">
            <div class="card-header" v-if="poems[translang].display_name">
              {{poems[translang].display_name}}
            </div>
            <div class="card-header" v-else>
              Author Unknown
            </div>
            <div class="card-body">
              <h5 class="card-text" v-if="poems[translang].display_title"> {{ poems[translang].display_title }}</h5>
              <h5 class="card-text" v-else>Translation Title Unknown</h5>
              <h6 class="card-text" v-if="poems[translang].written_year"> Written Year: {{ poems[translang].written_year }}</h6>
              <h6 class="card-text" v-if="poems[translang].published_year"> Published Year: {{ poems[translang].published_year }}</h6>
              <h6 class="card-text" v-if="poems[translang].genre"> Genre: {{ poems[translang].genre }}</h6>
              <br>
              <div v-if="poems[translang].contents">
                <p class="card-text">
                  <p v-for="line in poems[translang].contents.split('\\')">
                    {{ line.replace(/(<([^>]+)>)/ig, '' ).replace(/\d/g, '')}}
                  </p>
                </p>
              </div>
              <div v-else>
                <p class="card-text">
                  The Translation Text has been Copyrighted
                </p>
              </div>
            </div>
            <div class="card-header">Available Translations:</div>
                <b-row>
                <div v-for="language in languagelist">
                  <b-col>
                  <b-button @click="translang=language" class="btn btn-outline-secondary btn-sm">{{ language }}</b-button>
                  </b-col>
                 </div>
                </b-row>
      </div>
      </div>
    <!-- Create Column for Settings -->
    <div cols="col-sm-6">
      <div class="card" style="width: 28rem;">
        <div class="card-header">Setting</div>
          <div class="card-body">
            <div v-for="setting in settingsdata">
              <h5 class="card-title">{{ setting.display_title }}</h5>
              <h6 class="card-subtitle mb-2 text-muted" v-if="setting.published_year">Year Written: {{ setting.published_year}}</h6>
              <p class="card-text">{{ setting.display_name}}</p>
              <a :href="setting.setting_id" class="btn btn-primary btn-sm">Setting Information</a>
              <br></br>
            </div>
          </div>
        </div>
    </div>
  </div>

</b-container>

</div>

 </template>

 <script>
 //import navbar
 import navigation from './components/navigation.vue'
 export default {
    data () {
      return {
        isTop: true,
        timer: null,
        translang: 'Basic'
      }
    },
    components: {
      'Navigation': navigation,
      // 'nl2br': Nl2br
    },
    methods: {
      objectUrl(id) {
        return "/object/" + id;
      }
    }
  }
 </script>
 <style>
   [v-cloak] {
    display: none;
  }
   go-top{ /* style from https://www.jianshu.com/p/471e732b0c7e */
    width: 100%;
    box{
      img{
        float: left;
        width: 100%;
      }
    }
    b-button{
      width: 50px;
      height: 50px;
      position: fixed;
      right: 50px;
      bottom: 50px;
      border: none;
      background-image:url('./../resource/up.png');
      background-repeat: no-repeat;
      background-size: cover;
      display: none;
      padding: 0 2em 1em 0;
      border-spacing: 10em 5em;
    }
  }
  .card-columns {
    @include media-breakpoint-only(lg) {
      column-count: 4;
    }
    @include media-breakpoint-only(xl) {
      column-count: 5;
    }
  }

</style>
