(() => {
  const DEBUG = false;
  
  const log = (text) => {
    if (DEBUG) console.log(text);
  }
  
  const main = () => {
    [...document.getElementsByTagName('input')]
        .forEach(elem => elem.value = elem.value.replace(/MEC{(\d+)}/, 'some.$1.com'))
  }

  main();
})()
