<template>
    <div>
      <div>
        <navigation></navigation>
      </div>
      <br></br>
    <!-- Creating Container -->
    <div class="container">

    <div class="row">
      <h1>Poem Advanced Search</h1>

    </div>
    <!-- Advanced Search form -->
    <div class="row">
    <form class="md-form form-sm mt-0" action="/poems/advancedresults" method="get" >
    <!-- Title -->
    <div class="form-group">
       <label for="poemTitle">Title</label>
       <input type="text" class="form-control" id="poemTitle" name="poemTitle">
     </div>
     <!-- Year Written -->
     <div class="form-group">
        <label for="yearWritten">Year Written</label>
        <input type="text" class="form-control" id="yearWritten" name="poemYW">
      </div>
      <!-- Year Published -->
      <div class="form-group">
         <label for="yearPublished">Year Published</label>
         <input type="text" class="form-control" id="yearPublished" name="poemYP">
      </div>
    <!-- Genre -->
      <div class="form-group">
         <label for="genre">Genre</label>
         <input type="text" class="form-control" id="genre" name="poemGenre">
      </div>
     <!-- Translation -->

    <div>
    <languageSelect></languageSelect>
  </div>
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
//import navbar
import navigation from './components/navigation.vue'
// import components
import languageSelect from './components/language_selection.vue'
export default {
    data() {
      return {};
    },
    components: {
      'Navigation' : navigation,
      'languageSelect' : languageSelect
    }
  }
</script>

<style>
  [v-cloak] {
    display: none;
  }
</style>
