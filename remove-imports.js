(() => {
  const DEBUG = false;
  
  const log = (text) => {
    if (DEBUG) console.log(text);
  }
  
  const main = () => {
    if (getCommitSummary() === null) { return;
      log("Running before page finished load. Returning early");
      return;
    }
    const fileHolders = getFileHolders();
    let blocksRemoved = getBlocksRemoved();
    fileHolders.forEach((holder) => {
      if (!isCollapsed(holder) &&
          !hasModifiedNonImport(holder)) {
        holder.remove()
        blocksRemoved++;
      }    
    });
    injectBlocksRemoved(blocksRemoved);
  }
  
  const getFileHolders = () => {
    log("getFileHolders")
    return Array.from(document.getElementsByClassName('file-holder'));
  }
    
  const getBlocksRemoved = () => {
    const injectedSpan = document.getElementById('injected');
    if (injectedSpan === null) return 0;
    const text = injectedSpan.innerHTML;
    const re = /\d+/g;
    return re.exec(text);
  }

  const isCollapsed = (elem) => {
    log("isCollapsed")
    return elem.getElementsByClassName('loading').length > 0
  }

  const getCommitSummary = () => {
    log("getCommitSummary")
    return document.getElementsByClassName('commit-stat-summary')[0];
  }

  const hasModifiedNonImport = (elem) => {
    log("hasModifiedNonImport")
    if (!isLineHolder(elem)) {
      if (elem.children === undefined) {
        return false;
      }
      const children = Array.from(elem.children);
      for (const child in children) {
        if (hasModifiedNonImport(children[child])) {
          return true;
        }
      }
      return false;
    }

    if (isModifiedLineHolder(elem)) {
      return !isImportOrPackage(elem);
    }
  }

  const isLineHolder = (elem) => {
    log("isLineHolder")
    return elem.classList != undefined &&
      elem.classList.contains('line_holder');
  }

  const isModifiedLineHolder = (elem) => {
    log("isModifiedLineHolder")
    return isLineHolder(elem) &&
    (elem.classList.contains('old') ||
    elem.classList.contains('new'))
  }

  const isImportOrPackage = (lineHolder) => {
    log("isImportOrPackage")
    const imp = Array.from(lineHolder.getElementsByClassName('kn'))
    if (imp.length == 0) return false;
    const text = imp[0].innerHTML;
    return text === 'import' || text === 'package';
  }

  const injectBlocksRemoved = (blocksRemoved) => {
    log("injectBlocksRemoved")
    let changed = document.getElementById('injected')
    if (changed === null) {
      const lineBreaker = document.createElement('p')
      changed = document.createElement('strong')
      changed.className = 'cgreen'
      changed.id = 'injected'
      lineBreaker.appendChild(changed)
      getCommitSummary().appendChild(lineBreaker);
    }
    changed.innerHTML = "\n" + blocksRemoved + " Import Only Blocks Removed"
  }
  main();
})()
