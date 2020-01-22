const express = require('express');
const expressVue = require('express-vue');
const path = require('path');
const async = require('async');
require('dotenv').config();
const knex1 = require('knex')({
  client: 'pg',
  connection: process.env.connectionStringAWS,
});
//const crossfilter = require('crossfilter2');
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const favicon = require('serve-favicon');

const knex = require('knex')({
  client: 'pg',
  connection: process.env.connectionString,
});

// Initialize Express
const app = express();
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));

// Options for express-vue
const vueOptions = {
  head: {
    title: 'Goethe and his Musical Settings',
    metas: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
      ],
    styles: [
      {
        style: '/css/styles.css'
      },
      {
        style: "//unpkg.com/bootstrap/dist/css/bootstrap.min.css"
      },
      {
        style: "//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.css"
      },
      {
        style: "//unpkg.com/dc@3/dc.css"
      }
    ],
  },
  template: {
    body: {
      start:`<body>
          <script src="//code.jquery.com/jquery.min.js"></script>
          <script src="//ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
          <script src="//unpkg.com/babel-polyfill@latest/dist/polyfill.min.js"></script>
          <script src="//unpkg.com/bootstrap-vue@latest/dist/bootstrap-vue.js"></script>
          <script src="//d3js.org/d3.v5.min.js"></script>
          <script src="//rawgithub.com/NickQiZhu/dc.js/master/web/js/crossfilter.js"></script>
          <script src="//unpkg.com/dc@3/dc.js"></script>`,
      end: `</body>`
      }
    },
    rootPath: path.join(__dirname, '/views')
  };

// Initialize express-vue
const expressVueMiddleware = expressVue.init(vueOptions);
app.use(expressVueMiddleware);

// home page, default (poems basic search page)

app.get('/', (req, res) => {
  res.renderVue('mainpage.vue');
});

// poem advanced search
app.get('/poems/advanced', (req, res) => {
  res.renderVue('poemAdvancedSearch.vue');
});

// on poem submit
app.get('/poems/results', (req, res) => {
  //console.log(req.body);
  knex('Poems').where('title', 'like', `%${req.query.poemSearch}%`)
    .orWhere('contents', 'like', `%${req.query.poemSearch}%`).then((ress) => {
      res.renderVue('poemResults.vue', {results: ress});
    });
});

app.get('/poems/advancedresults', (req, res) => {
  res.renderVue('poemResults.vue');
});

app.get('/bubblePoemsAdvanced', (req, res) => {
  var poems;
  let translations;
  var id_array = [];
  async.series([
    (callback) => {
      knex1.from('text_final')
      .select('text_id', 'written_year', 'published_year', 'display_title', 'genre', 'language')
      .where('display_title', 'like', `%${req.query.poemTitle}%`)
      .andWhere('written_year', 'like', `%${req.query.poemYW}%`)
      .andWhere('published_year', 'like', `%${req.query.poemYP}%`)
      .andWhere('genre', 'like', `%${req.query.poemGenre}%`)
      .andWhere('language', 'like', `%${req.query.poemLanguage}%`)
      .then((ress) => {
      // console.log("/bubblePoemsAdvanced", ress);
      poems = ress;
      //console.log("poems", poems);
      for (let i = 0; i < poems.length; i++) {
        id_array.push(poems[i].text_id);
      }
      callback(null);
    });
    },
    (callback) => {
    knex1.from('text_final') // for the setting list
        .select('text_id', 'based_on_text_id')
        .whereIn('based_on_text_id', id_array)
        .then((ress) => {
          translations = ress;
          // console.log("translations", translations)
          res.json({poems, translations});
      });
      callback(null);

    }
  ]);
  //console.log(req.body);

});

// app.get('/bubblePoemsAdvanced', (req, res) => {
//   var poems;
//   let translations;
//   var id_array = [];
//   async.series([
//     (callback) => {
//       knex1.from('text')
//       .fullOuterJoin('text_title', {'text_title.text_id': 'text.text_id'})
//       .fullOuterJoin('text_meta', {'text_meta.text_id': 'text.text_id'})
//       .fullOuterJoin('language', {'language.language_id': 'text.language_id'})
//       .select('text.text_id', 'text.written_year', 'text.published_year', 'text_title.display_title', 'text_meta.genre', 'text.language_id')
//       .where('text_title.display_title', 'like', `%${req.query.poemTitle}%`)
//       .andWhere('text.written_year', 'like', `%${req.query.poemYW}%`)
//       .andWhere('text.published_year', 'like', `%${req.query.poemYP}%`)
//       .andWhere('text_meta.genre', 'like', `%${req.query.poemGenre}%`)
//       .andWhere('language.language', 'like', `%${req.query.poemLanguage}%`)
//       .then((ress) => {
//       // console.log("/bubblePoemsAdvanced", ress);
//       poems = ress;
//       console.log("poems", poems);
//       for (let i = 0; i < poems.length; i++) {
//         id_array.push(poems[i].text_id);
//       }
//       callback(null);
//     });
//     },
//     (callback) => {
//     knex1.from('text') // for the setting list
//         .select('text_id', 'based_on_text_id')
//         .whereIn('based_on_text_id', id_array)
//         .then((ress) => {
//           translations = ress;
//           // console.log("translations", translations)
//           res.json({poems, translations});
//       });
//       callback(null);

//     }
//   ]);
//   //console.log(req.body);

// });

app.get('/bubblePoemsBasic', (req, res) => {
  var poems;
  let translations;
  var id_array = [];
  async.series([
    (callback) => {
      knex1.from('text')
      .fullOuterJoin('text_title', {'text_title.text_id': 'text.text_id'})
      .fullOuterJoin('text_meta', {'text_meta.text_id': 'text.text_id'})
      .fullOuterJoin('language', {'language.language_id': 'text.language_id'})
      .select('text.text_id', 'text.written_year', 'text.published_year', 'text_title.display_title', 'text_meta.genre', 'text.language_id')
      .where('text_title.display_title', 'like', `%${req.query.poemSearch}%`)
      .orWhere('text.written_year', 'like', `%${req.query.poemSearch}%`)
      .orWhere('text.published_year', 'like', `%${req.query.poemSearch}%`)
      .then((ress) => {
        poems = ress;
        //console.log("poems", poems);
        for (let i = 0; i < poems.length; i++) {
          id_array.push(poems[i].text_id);
        }
        callback(null);
      });
    },
    (callback) => {
    knex1.from('text') // for the setting list
        .select('text_id', 'based_on_text_id')
        .whereIn('based_on_text_id', id_array)
        .then((ress) => {
          translations = ress;
          // console.log("translations", translations)
          res.json({poems, translations});
      });
      callback(null);
    }
    ]);
});

// SETTING ----------------------------------------------------------------

// settings basic search
app.get('/settings', (req, res) => {
  res.renderVue('settingSearch.vue');
});

// settings advanced search
app.get('/settings/advanced', (req, res) => {
  res.renderVue('settingAdvancedSearch.vue');
});

app.get('/settings/results', (req, res) => {
  //console.log(req.body);
  knex1.from('setting')
    .fullOuterJoin('setting_meta', {'setting_meta.setting_id': 'setting.setting_id'})
    .fullOuterJoin('text_title', {'text_title.text_id': 'setting.text_id'})
    .select('setting.setting_id', 'setting.text_id', 'setting_meta.display_title', 'setting.published_year', 'setting.composed_year',
    'setting.instrumentation', 'setting_meta.setting_tempo', 'setting_meta.setting_key','setting_meta.display_title', {poem_title: 'text_title.display_title'})
    .where('setting_meta.display_title', 'like', `%${req.query.settingSearch}%`)
    .orWhere('setting.published_year', 'like', `%${req.query.settingSearch}%`)
    .orWhere('setting.composed_year', 'like', `%${req.query.settingSearch}%`)
    .then((ress) => {
      //console.log(ress);
      ress.forEach(setting => {
        setting.setting_id = `/setting/${setting.setting_id}`;
      });
      res.renderVue('settingResults.vue', {results: ress});
    });
});

app.get('/settings/advancedresults', (req, res) => {
  //console.log(req.body);
  knex1.from('setting')
    .fullOuterJoin('setting_meta', {'setting_meta.setting_id': 'setting.setting_id'})
    .fullOuterJoin('composership', {'composership.setting_id': 'setting.setting_id'})
    .fullOuterJoin('artist', {'artist.artist_id': 'composership.composer_artist_id'})
    .fullOuterJoin('text_title', {'text_title.text_id': 'setting.text_id'})
    .select('setting.setting_id', 'setting.text_id', 'setting_meta.display_title', 'setting.published_year', 'setting.composed_year',
    'setting.instrumentation', 'setting_meta.setting_tempo', 'setting_meta.setting_key','setting_meta.display_title', 'artist.display_name', {poem_title: 'text_title.display_title'})
    .where('setting_meta.display_title', 'like', `%${req.query.settingTitle}%`)
    .andWhere('artist.display_name', 'like', `%${req.query.settingComposer}%`)
    .andWhere('setting.composed_year', 'like', `%${req.query.settingYW}%`)
    .andWhere('setting.published_year', 'like', `%${req.query.settingYP}%`)
    //.andWhere('language', 'like', `%${req.query.poemLanguage}%`)
    .andWhere('setting_meta.setting_key', 'like', `%${req.query.settingKey}%`)
    .andWhere('setting_meta.setting_tempo', 'like', `%${req.query.settingTempo}%`)
    .andWhere('setting.instrumentation', 'like', `%${req.query.settingInstrumentation}%`)
    .then((ress) => {
      ress.forEach(setting => {
        setting.setting_id = `/setting/${setting.setting_id}`;
      });
      res.renderVue('settingResults.vue', {results: ress});
    });
});

// CROSSFILTER AND DETAIL -------------------------------------------------

// crossfilter
app.get('/crossPoems', (req, res) => {
  knex1.from('text').fullOuterJoin('authorship', {'authorship.text_id': 'text.text_id'})
    .fullOuterJoin('text_title', {'text_title.text_id': 'text.text_id'})
    .fullOuterJoin('text_meta', {'text_meta.text_id': 'text.text_id'})
    .fullOuterJoin('text_contents', {'text_contents.text_id': 'text.text_id'})
    .select('text.text_id', 'text.written_year', 'text.published_year', 'text_title.display_title', 'text_meta.genre', 'text_contents.contents')
    .where('authorship.author_artist_id', 993).then((ress) => {
      let poems = ress;
      //console.log(poems.length);
      res.json(poems);
  });
});

app.get('/crossSettings', (req, res) => {
  knex1.from('setting').fullOuterJoin('setting_meta', {'setting_meta.setting_id': 'setting.setting_id'})
    .fullOuterJoin('text_title', {'text_title.text_id': 'setting.text_id'})
    .fullOuterJoin('composership', {'composership.setting_id': 'setting.setting_id'})
    .fullOuterJoin('artist', {'artist.artist_id': 'composership.composer_artist_id'})
    .select('setting_meta.setting_id', {composition_title: 'setting_meta.display_title'}, 'setting.published_year', 'setting.composed_year',
    'setting.instrumentation', 'setting_meta.setting_tempo', 'setting_meta.setting_key', {poem_title: 'text_title.display_title'}, 'artist.display_name')
    .then((ress) => {
      let settings = ress;
      res.json(settings);
  });
});


app.get('/poem/:text_id', (req, res) => {
  let poems = {};
  let languagelist = [];
  let settingsdata;
  let appear = {};
  async.series([
    (callback) => {
      knex1.from('text') // for the poem detail
        .fullOuterJoin('authorship', {'authorship.text_id': 'text.text_id'})
        .fullOuterJoin('artist', {'artist.artist_id': 'authorship.author_artist_id'})
        .fullOuterJoin('text_title', {'text_title.text_id': 'text.text_id'})
        .fullOuterJoin('text_meta', {'text_meta.text_id': 'text.text_id'})
        .fullOuterJoin('text_contents', {'text_contents.text_id': 'text.text_id'})
        .fullOuterJoin('language', {'language.language_id': 'text.language_id'})
        .select('text.written_year', 'text.published_year', 'text_title.display_title', 'text_meta.genre', 'text_contents.contents',
        'artist.display_name', 'artist.birth_year', 'artist.death_year', 'language.language')
        .where('text.text_id', req.params.text_id).then((ress) => {
          poems['Basic'] = ress[0];
          languagelist.push('Basic');
          // console.log('poem data');
          // console.log(poemdata);
          // for (poem in poemdata) {
          //   console.log('printing type of poem');
          //   console.log(typeof poem.contents);
          // }
          callback(null);
      });
    },
    (callback) =>{
      knex1.from('text') // for different translations
        .fullOuterJoin('authorship', {'authorship.text_id': 'text.text_id'})
        .fullOuterJoin('artist', {'artist.artist_id': 'authorship.author_artist_id'})
        .fullOuterJoin('text_title', {'text_title.text_id': 'text.text_id'})
        .fullOuterJoin('text_meta', {'text_meta.text_id': 'text.text_id'})
        .fullOuterJoin('text_contents', {'text_contents.text_id': 'text.text_id'})
        .fullOuterJoin('language', {'language.language_id': 'text.language_id'})
        .select('text.written_year', 'text.published_year', 'text_title.display_title', 'text_meta.genre', 'text_contents.contents',
        'artist.display_name', 'artist.birth_year', 'artist.death_year', 'language.language')
        .where('text.based_on_text_id', req.params.text_id).then((ress) => {
          ress.forEach(translation => {
            if(appear[translation.language]) 
              appear[translation.language] += 1;
            else
              appear[translation.language] = 1;
            if(appear[translation.language]>1){
              languagelist.push(`${translation.language}${appear[translation.language]}`);
              poems[`${translation.language}${appear[translation.language]}`] = translation;
            }
            else{
              languagelist.push(translation.language);
              poems[translation.language] = translation;
            }
          });
          //console.log('poem translation');
          //console.log(poemtranslation);
          callback(null);
      });
    },
    (callback) =>{
      knex1.from('setting') // for the setting list
        .fullOuterJoin('composership', {'composership.setting_id': 'setting.setting_id'})
        .fullOuterJoin('artist', {'artist.artist_id': 'composership.composer_artist_id'})
        .fullOuterJoin('setting_meta', {'setting_meta.setting_id': 'setting.setting_id'})
        .select('setting_meta.setting_id', 'setting_meta.display_title', 'setting.published_year', 'setting.composed_year', 'artist.display_name')
        .where('setting.text_id', req.params.text_id).then((ress) => {
          settingsdata = ress;
          settingsdata.forEach(setting => {
            setting.setting_id = `/setting/${setting.setting_id}`;
          });
          //console.log('settings data');
          //console.log(settingsdata);
          callback(null);
      });
    },
    (callback) =>{
          //console.log(poems);
          //console.log(languagelist);
          res.renderVue('poem.vue', {poems: poems, settingsdata: settingsdata, languagelist: languagelist});
          callback(null);
    },
  ]);


});

app.get('/setting/:setting_id', (req, res) => {
  //console.log(':setting_id');
  let settingbasis;
  let settingsdata; // for the setting list
  async.series([
   (callback) => {
      knex1.from('setting') // for the individual setting
      .fullOuterJoin('setting_meta', {'setting_meta.setting_id': 'setting.setting_id'})
      .fullOuterJoin('text_title', {'text_title.text_id': 'setting.text_id'})
      .fullOuterJoin('composership', {'composership.setting_id': 'setting.setting_id'})
      .fullOuterJoin('artist', {'artist.artist_id': 'composership.composer_artist_id'})
      .select('setting.setting_id', 'setting.text_id', {composition_title: 'setting_meta.display_title'}, 'setting.published_year',
      'setting.composed_year', 'setting.instrumentation', 'setting_meta.setting_tempo', 'setting_meta.setting_key',
      'artist.display_name', {poem_title: 'text_title.display_title'})
      .where('setting.setting_id', req.params.setting_id).then((ress) => {
        settingbasis = ress;
        console.log('settings basis');
        console.log(settingbasis);
        callback(null);
      });
    },
  (callback) => {
      knex1.from('setting') // for the setting list
        .fullOuterJoin('composership', {'composership.setting_id': 'setting.setting_id'})
        .fullOuterJoin('artist', {'artist.artist_id': 'composership.composer_artist_id'})
        .fullOuterJoin('setting_meta', {'setting_meta.setting_id': 'setting.setting_id'})
        .select('setting_meta.setting_id', 'setting_meta.display_title', 'setting.published_year', 'setting.composed_year', 'artist.display_name')
        .where('setting.text_id', settingbasis[0].text_id).then((ress) => {
          settingsdata = ress;
          settingsdata.forEach(setting => {
            setting.setting_id = `/setting/${setting.setting_id}`;
          });
          console.log(settingsdata);
          callback(null);
      });
    },
    (callback) =>{
          res.renderVue('setting.vue', {settingbasis: settingbasis, settingsdata: settingsdata});
          callback(null);
    },
  ]);
});

// Listen on socket
app.listen(port,  () => {
  console.log(`Server running on :${port}/`);
});
