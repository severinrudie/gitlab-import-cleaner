(() => {
  const DEBUG = false;
  
  const log = (text) => {
    if (DEBUG) console.log(text);
  }
  
  const main = () => {
    if (!getCommitSummary()) { return;
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
    if (!injectedSpan) return 0;
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
      if (!elem.children) {
        return false;
      }
      const lines = Array.from(elem.getElementsByClassName('noteable_line'));
      for (var i in lines) {
        if (hasModifiedNonImport(lines[i])) return true;
      }
      return false;
    }

    if (isModifiedLineHolder(elem)) {
      return !isImportOrPackage(elem) &&
        !isWhiteSpace(elem);
    }
  }

  const isLineHolder = (elem) => {
    log("isLineHolder")
    return elem.classList != undefined &&
      elem.classList.contains('noteable_line');
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
  
  const isWhiteSpace = (lineholder) => {
    const spans = Array.from(lineholder.getElementsByTagName('span'))
    if (spans.length > 1) return false;
    if (spans.length === 0) return true;
    if (!spans[0].innerHTML) return true;
  }

  const injectBlocksRemoved = (blocksRemoved) => {
    log("injectBlocksRemoved")
    let changed = document.getElementById('injected')
    if (!changed) {
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
