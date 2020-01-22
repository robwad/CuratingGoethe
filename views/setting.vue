<template>
  <div>
    <div>
            <navigation></navigation>
    </div>
    <br></br>

    <div v-if="setting" v-for="setting in settingbasis">
        <div v-if="setting">
              <h2 align="center">Settings on Poem: {{setting.poem_title}}</h2>
         </div>
    </div>


    <br></br>


    <b-container class="bv-example-row">
      <div class="row">
        <div class="col-sm-6">
    <div class="card" style="width: 32rem;">
          <div v-for="setting in settingbasis">
        <h2 class="card-header">{{ setting.composition_title}}</h2>
      <div class="card-body">
        <h6 class="card-subtitle mb-2 text-muted" v-if="setting.published_year"> Published Year: {{ setting.published_year }}</h6>
        <p class="card-text" v-if="setting.display_name">{{ setting.display_name }}<p>
        <p class="card-text" v-if="setting.composed_year"> Published Year: {{ setting.composed_year }}</p>
        <p class="card-text" v-if="setting.instrumentation"> Instrumentation: <em>{{ setting.instrumentation }}</em></p>
        <p class="card-text" v-if="setting.setting_tempo != 0"> Tempo: <em>{{ setting.setting_tempo }}</em></p>
        <p class="card-text" v-if="setting.setting_key != 0"> Key: <em>{{ setting.setting_key }}</em></p>

        </div>
      </div>
    </div>
        </div>





    <div cols="col-sm-6">
      <div class="card" style="width: 28rem;">
        <div class="card-header">Similiar Settings</div>
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
        timer: null
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
   go-top{ /* style from https://www.jianshu.com/p/471e732b0c7e */
    width: 100%;
    box{
      img{
        float: left;
        width: 100%;
      }
    }
    button{
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
