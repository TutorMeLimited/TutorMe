
        fetch('/.netlify/functions/get-firebase-config')
        .then(r => r.json())
        .then(config => fetch(config.databaseURL + '/settings/theme.json'))
        .then(r => r.json())
        .then(theme => { if(theme) document.documentElement.setAttribute('data-theme', theme); })
        .catch(() => {});
    
