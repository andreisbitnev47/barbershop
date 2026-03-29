const fs = require('fs');
const ejs = require('ejs');
const path = require('path');
const translations = require('./translations');

// Helper to ensure directory exists
function ensureDirectoryExistence(filePath) {
  var dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// 1. Build Homepages
const langs = ['est', 'ru', 'en'];

langs.forEach(lang => {
  const t = translations[lang];
  // Calculate base directory (relative paths for CSS/JS)
  const baseDir = lang === 'est' ? '' : '../';
  
  ejs.renderFile('views/pages/index.ejs', { t, baseDir, lang }, {}, function(err, str){
    if (err) {
      console.error(`Error rendering index for ${lang}:`, err);
      return;
    }
    const outputPath = path.join(__dirname, t.dirPrefix, 'index.html');
    ensureDirectoryExistence(outputPath);
    fs.writeFileSync(outputPath, str);
    console.log(`Generated ${outputPath}`);
  });
});

// 2. Build Service Landing Pages (Phase 4)
const services = {
  beard: {
    est: { url: 'habeme-piiramine-tallinnas.html', title: 'Habeme piiramine Tallinnas - Rocca Juuksur', serviceTitle: 'Habeme kujundamine', article: 'Pakume kvaliteetset habeme kujundamist ja piiramist Rocca al Mares.' },
    ru: { url: 'ru/strizhka-borodi-tallinn.html', title: 'Стрижка бороды в Таллинне - Rocca Juuksur', serviceTitle: 'Стрижка бороды', article: 'Предлагаем качественную стрижку и оформление бороды в Рокка-аль-Маре.' },
    en: { url: 'en/beard-trimming-tallinn.html', title: 'Beard Trimming in Tallinn - Rocca Juuksur', serviceTitle: 'Beard styling', article: 'We offer high-quality beard trimming and styling in Rocca al Mare.' }
  },
  scissor: {
    est: { url: 'meeste-juukseloikus-ja-fade.html', title: 'Meeste juukselõikus ja Fade Tallinnas - Rocca Juuksur', serviceTitle: 'Kääridega lõikus', article: 'Parim meeste juuksur Rocca al Mares. Teostame nii klassikalisi kääridega lõikusi kui ka modernseid fade stiilis lõikusi.' },
    ru: { url: 'ru/muzhskaja-strizhka-fade.html', title: 'Мужская стрижка и фейд в Таллинне - Rocca Juuksur', serviceTitle: 'Стрижка ножницами', article: 'Лучшая мужская парикмахерская в Рокка-аль-Маре. Выполняем как классические стрижки ножницами, так и современные фейд.' },
    en: { url: 'en/mens-haircut-fade-tallinn.html', title: 'Men\'s Haircut & Fade in Tallinn - Rocca Juuksur', serviceTitle: 'Scissor cut', article: 'The best men\'s hairdresser in Rocca al Mare. We perform classic scissor cuts and modern skin fades.' }
  }
};

Object.keys(services).forEach(serviceKey => {
  langs.forEach(lang => {
    const t = translations[lang];
    const serviceData = services[serviceKey][lang];
    
    // For service pages within main directory for est, and ru/en corresponding, the base prefix is always the same or relative
    // Actually, their URLs for EST are in root, and ru/en are in ru/en directories.
    // So baseDir is the same as the homepages.
    const baseDir = lang === 'est' ? '' : '../';

    ejs.renderFile('views/pages/service.ejs', { t, baseDir, lang, service: serviceData }, {}, function(err, str){
      if (err) {
        console.error(`Error rendering service ${serviceKey} for ${lang}:`, err);
        return;
      }
      const outputPath = path.join(__dirname, serviceData.url);
      ensureDirectoryExistence(outputPath);
      fs.writeFileSync(outputPath, str);
      console.log(`Generated ${outputPath}`);
    });
  });
});
