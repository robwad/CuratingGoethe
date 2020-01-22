<template>
    <div>
      <div>
        <navigation></navigation>
      </div>
      <br></br>
    <!-- creating container -->
    <div class="container">

      <div class="row">
        <h1>Setting Advanced Search</h1>

      </div>
    <!-- Search form -->
      <div class="row">
        <form class="md-form form-sm mt-0" action="/settings/advancedresults" method="get" >

          <!-- Title -->
          <div class="form-group">
             <label for="poemTitle">Title</label>
             <input type="text" class="form-control" id="poemTitle" name="settingTitle">
           </div>
           <!-- Composer -->
           <div class="form-group">
              <label for="composerName">Composer</label>
              <input type="text" class="form-control" id="composerName" name="settingComposer">
            </div>
            <!-- Year Written -->
            <div class="form-group">
               <label for="yearWritten">Year Composed</label>
               <input type="text" class="form-control" id="yearWritten" name="settingYW">
             </div>
             <!-- Year Published -->
             <div class="form-group">
                <label for="yearPublished">Year Published</label>
                <input type="text" class="form-control" id="yearPublished" name="settingYP">
             </div>
             <!-- Key -->
              <div class="form-group">
             <key></key>
             </div>
             <!-- Tempo -->
             <div class="form-group">
                <label for="tempo">Tempo</label>
                <input type="text" class="form-control" id="tempo" name="settingTempo">
             </div>
             <!-- Instrumentation - Text for now -->
             <div class="form-group">
                <label for="intrumentation">Instrumentation</label>
                <input type="text" class="form-control" id="instrumentation" name="settingInstrumentation">
             </div>
             <!-- Language - -->
             <languageSelect></languageSelect>
          <div class="container">
          <b-button class="btn aqua-gradient btn-rounded btn-outline-primary btn-sm my-0" type="submit">Search</b-button>
          </div>
        </form>
      </div>
      <!-- ending container -->
    </div>
</div>

</template>

<script>
// import components
import navigation from './components/navigation.vue'
import languageSelect from './components/language_selection.vue'
import key from './components/key.vue'
export default {
    data() {
      return {};
    },
      components: {
        'Navigation' : navigation,
        'languageSelect' : languageSelect,
        'key' : key
    }
  }
</script>

<style>
  [v-cloak] {
    display: none;
  }
</style>
