<template>
  <div class="form-group">
  <label for="keySelect">Key</label>
   <select class="form-control" id="keySelect" name="settingKey">
     <option value=""></option>
     <option value="C">CMaj</option>
     <option value="Cm">CMin</option>
     <option value="C#m">C#Min</option>
     <option value="D">DMaj</option>
     <option value="Dm">DMin</option>
     <option value="Dbm">DbMin</option>
     <option value="E">EMaj</option>
     <option value="Em">EMin</option>
     <option value="Eb">EbMaj</option>
     <option value="Ebm">EbMin</option>
     <option value="F">FMaj</option>
     <option value="Fm">FMin</option>
     <option value="F#">F#Maj</option>
     <option value="F#m">F#Min</option>
     <option value="G">GMaj</option>
     <option value="Gm">GMin</option>
     <option value="Gb">GbMaj</option>
     <option value="G#m">G#Min</option>
     <option value="A">AMaj</option>
     <option value="Am">AMin</option>
     <option value="Ab">AbMaj</option>
     <option value="Abm">AbMin</option>
     <option value="B">BMaj</option>
     <option value="Bm">BMin</option>
     <option value="Bb">BbMaj</option>
     <option value="Bbm">BbMin</option>
   </select>
  </div>
</template>

<script>
  export default {
  name: 'key',
  data(){
            return {}
        }
}
</script>


<style>
</style>
