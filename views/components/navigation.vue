<template>
  <div>

  <b-navbar toggleable="md" type="dark" variant="primary">

    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand href="/">Curating Geothe</b-navbar-brand>
        <img src="https://raw.githubusercontent.com/cs276/Curating-Goethe/website/static/geothe_icon%20copy.png?token=AiQs7llt9nbIYP01Lgu9KmOKO8qxYFtsks5cE9i8wA%3D%3D" height="75" width="75">

    <b-collapse is-nav id="nav_collapse">

      <b-navbar-nav>
        <b-nav-item href="/">Poem</b-nav-item>
        <b-nav-item href="/settings">Setting</b-nav-item>
      </b-navbar-nav>


    </b-collapse>
  </b-navbar>
</div>
</template>

<script>
  export default {
  name: 'navigation',
  data(){
            return {}
        }
}
</script>

<style>
  .navbar {
    padding-bottom: 0;
    padding-top: 0;
  }
</style>
